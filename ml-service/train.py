"""
Trains the v2 churn model on a synthetic dataset and exports it to
ml-service/artifacts/v2/. Additive only — does not touch artifacts/ (v1).

Adds two engagement features on top of the original four:
  - days_since_last_login
  - core_feature_usage_percentage

Run:
    cd ml-service
    python train.py
"""
import json
import shutil
from pathlib import Path

import joblib
import numpy as np
import xgboost as xgb
from scipy.stats import randint, uniform
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import RandomizedSearchCV, train_test_split

from feature_schema import (
    FEATURE_KEYS,
    LOGIN_FREQ_ENCODING,
    build_feature_config,
)

ARTIFACT_DIR = Path(__file__).parent / "artifacts"
V2_DIR = ARTIFACT_DIR / "v2"

N_SAMPLES = 2000
RANDOM_STATE = 42

# Mean days-since-last-login by login frequency — correlated with login_frequency by
# design (a "Rarely" user is much more likely to also be stale), which is fine for
# XGBoost to pick apart from the raw feature values.
DAYS_SINCE_LOGIN_SCALE = {"Daily": 3.0, "Weekly": 10.0, "Rarely": 40.0}


def generate_dataset(n: int = N_SAMPLES, seed: int = RANDOM_STATE):
    rng = np.random.default_rng(seed)

    account_age_days = rng.integers(1, 1500, size=n)
    daily_usage_mins = np.clip(rng.gamma(shape=2.0, scale=15.0, size=n), 0, 180).round().astype(int)

    login_frequency = rng.choice(["Daily", "Weekly", "Rarely"], size=n, p=[0.45, 0.35, 0.20])
    login_freq_enc = np.array([LOGIN_FREQ_ENCODING[f] for f in login_frequency])

    scales = np.array([DAYS_SINCE_LOGIN_SCALE[f] for f in login_frequency])
    days_since_last_login = np.clip(rng.exponential(scales), 0, 400).round().astype(int)

    core_feature_usage_percentage = np.clip(rng.beta(a=2.0, b=2.0, size=n) * 100, 0, 100)
    ticket_sentiment = np.clip(rng.normal(loc=0.05, scale=0.45, size=n), -1.0, 1.0)

    # Linear risk signal: rises with staleness/inactivity, falls with engagement and
    # positive support sentiment. Coefficients are illustrative, not fitted.
    logit = (
        -3.2
        + 0.045 * days_since_last_login
        - 0.035 * core_feature_usage_percentage
        - 0.02 * daily_usage_mins
        - 1.6 * ticket_sentiment
        - 0.001 * account_age_days
        + np.where(login_frequency == "Rarely", 1.8, np.where(login_frequency == "Weekly", 0.5, 0.0))
    )
    logit += rng.normal(0, 1.0, size=n)  # noise so classes aren't perfectly separable
    prob = 1 / (1 + np.exp(-logit))
    churned = rng.binomial(1, prob)

    columns = {
        "Account_Age_Days": account_age_days,
        "Daily_Usage_Mins": daily_usage_mins,
        "login_freq_enc": login_freq_enc,
        "ticket_sentiment": ticket_sentiment,
        "days_since_last_login": days_since_last_login,
        "core_feature_usage_percentage": core_feature_usage_percentage,
    }
    X = np.column_stack([columns[key] for key in FEATURE_KEYS]).astype(float)
    y = churned
    return X, y


def train():
    X, y = generate_dataset()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )

    n_pos = y_train.sum()
    n_neg = len(y_train) - n_pos
    scale_pos_weight = n_neg / max(n_pos, 1)

    base_model = xgb.XGBClassifier(
        objective="binary:logistic",
        eval_metric="auc",
        scale_pos_weight=scale_pos_weight,
        random_state=RANDOM_STATE,
    )

    param_dist = {
        "n_estimators": randint(100, 500),
        "max_depth": randint(2, 8),
        "learning_rate": uniform(0.01, 0.29),
        "subsample": uniform(0.6, 0.4),
        "colsample_bytree": uniform(0.6, 0.4),
        "min_child_weight": randint(1, 10),
        "gamma": uniform(0, 5),
    }

    search = RandomizedSearchCV(
        base_model,
        param_distributions=param_dist,
        n_iter=40,
        scoring="roc_auc",
        cv=5,
        random_state=RANDOM_STATE,
        n_jobs=-1,
    )
    search.fit(X_train, y_train)

    best_model = search.best_estimator_
    test_probs = best_model.predict_proba(X_test)[:, 1]
    test_auc = roc_auc_score(y_test, test_probs)

    print(f"Best CV ROC-AUC: {search.best_score_:.4f}")
    print(f"Test ROC-AUC:    {test_auc:.4f}")
    print(f"Best params:     {search.best_params_}")
    print("\nFeature importances:")
    for key, importance in sorted(
        zip(FEATURE_KEYS, best_model.feature_importances_), key=lambda kv: kv[1], reverse=True
    ):
        print(f"  {key:32s} {importance:.4f}")

    V2_DIR.mkdir(parents=True, exist_ok=True)

    best_model.save_model(str(V2_DIR / "churn_model.json"))
    joblib.dump(best_model, V2_DIR / "churn_model.pkl")  # backup, not loaded by the service

    with open(V2_DIR / "feature_config.json", "w") as f:
        json.dump(build_feature_config(), f, indent=2)

    # Sentiment lookup is static text -> score data, independent of the model version.
    shutil.copyfile(ARTIFACT_DIR / "sentiment_map.json", V2_DIR / "sentiment_map.json")

    print(f"\nSaved v2 artifacts to {V2_DIR}")


if __name__ == "__main__":
    train()
