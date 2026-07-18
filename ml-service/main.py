"""
Churn-CALC ML Service
A small FastAPI server that loads the trained XGBoost model and serves churn predictions.
The Next.js app calls this over HTTP from its /api/predict route.
"""
import json
from pathlib import Path
from typing import List, Optional

import numpy as np
import xgboost as xgb
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ---- Load artifacts once at startup -------------------------------------
ARTIFACT_DIR = Path(__file__).parent / "artifacts"

model = xgb.XGBClassifier()
model.load_model(str(ARTIFACT_DIR / "churn_model.json"))

with open(ARTIFACT_DIR / "feature_config.json") as f:
    CONFIG = json.load(f)
with open(ARTIFACT_DIR / "sentiment_map.json") as f:
    SENTIMENT_MAP = json.load(f)

FEATURES = CONFIG["features"]
FREQ_ENC = CONFIG["login_freq_encoding"]
DEFAULT_SENTIMENT = CONFIG["default_sentiment"]
THRESHOLD = CONFIG["threshold"]
UNDERUSE_USAGE_MINS = 20  # below this daily usage => "under-utilized" if not at risk

# ---- Request / response schemas -----------------------------------------
class Customer(BaseModel):
    customer_id: str
    account_age_days: int
    daily_usage_mins: int
    login_frequency: str          # "Daily" | "Weekly" | "Rarely"
    last_support_ticket: str = ""

class PredictRequest(BaseModel):
    customers: List[Customer]

class Prediction(BaseModel):
    customer_id: str
    churn_risk: int               # 0-100
    risk_category: str            # "Healthy" | "Under-utilized" | "At-risk"
    ticket_sentiment: float

class PredictResponse(BaseModel):
    predictions: List[Prediction]

# ---- Feature building ----------------------------------------------------
def build_features(c: Customer):
    sentiment = SENTIMENT_MAP.get(c.last_support_ticket, DEFAULT_SENTIMENT)
    freq = FREQ_ENC.get(c.login_frequency, 0)
    row = {
        "Account_Age_Days": c.account_age_days,
        "Daily_Usage_Mins": c.daily_usage_mins,
        "login_freq_enc": freq,
        "ticket_sentiment": sentiment,
    }
    return [row[f] for f in FEATURES], sentiment

def categorize(risk_prob: float, usage_mins: int) -> str:
    if risk_prob >= THRESHOLD:
        return "At-risk"
    if usage_mins < UNDERUSE_USAGE_MINS:
        return "Under-utilized"
    return "Healthy"

# ---- App -----------------------------------------------------------------
app = FastAPI(title="Churn-CALC ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # fine for hackathon/local; tighten for prod
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "features": FEATURES}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if not req.customers:
        return {"predictions": []}

    rows, sentiments = [], []
    for c in req.customers:
        feats, sent = build_features(c)
        rows.append(feats)
        sentiments.append(sent)

    probs = model.predict_proba(np.array(rows))[:, 1]

    preds = []
    for c, p, s in zip(req.customers, probs, sentiments):
        preds.append(Prediction(
            customer_id=c.customer_id,
            churn_risk=round(float(p) * 100),
            risk_category=categorize(float(p), c.daily_usage_mins),
            ticket_sentiment=round(float(s), 4),
        ))
    return {"predictions": preds}
