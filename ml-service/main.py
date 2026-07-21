"""
Churn-CALC ML Service
FastAPI server that loads the trained XGBoost model and serves churn predictions.
The Next.js app calls this over HTTP from its /api/predict route.
"""
import json
import os
from pathlib import Path
from typing import List

import numpy as np
import xgboost as xgb
from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator

from feature_schema import (
    DEFAULT_SENTIMENT,
    FEATURE_KEYS,
    FEATURES,
    LOGIN_FREQ_ENCODING,
    THRESHOLD,
)

# ---- Load artifacts once at startup -------------------------------------
ARTIFACT_DIR = Path(__file__).parent / "artifacts"

model = xgb.XGBClassifier()
model.load_model(str(ARTIFACT_DIR / "churn_model.json"))

with open(ARTIFACT_DIR / "sentiment_map.json") as f:
    SENTIMENT_MAP = json.load(f)

UNDERUSE_USAGE_MINS = 20        # below this daily usage => "under-utilized" if not at risk
UNDERUSE_DAYS_SINCE_LOGIN = 14  # above this staleness => "under-utilized" if not at risk
UNDERUSE_USAGE_PCT = 30         # below this core-feature usage % => "under-utilized" if not at risk

# last_support_ticket maps to the derived ticket_sentiment feature, not a numeric bound
# on the request field itself, so it's excluded from the numeric-range lookup below.
SCHEMA_BY_FIELD = {f.request_field: f for f in FEATURES if f.request_field != "last_support_ticket"}


# ---- Request / response schemas -----------------------------------------
class Customer(BaseModel):
    customer_id: str
    account_age_days: int = Field(
        ge=SCHEMA_BY_FIELD["account_age_days"].min_value,
        le=SCHEMA_BY_FIELD["account_age_days"].max_value,
    )
    daily_usage_mins: int = Field(
        ge=SCHEMA_BY_FIELD["daily_usage_mins"].min_value,
        le=SCHEMA_BY_FIELD["daily_usage_mins"].max_value,
    )
    login_frequency: str          # "Daily" | "Weekly" | "Rarely"
    last_support_ticket: str = ""
    days_since_last_login: int = Field(
        ge=SCHEMA_BY_FIELD["days_since_last_login"].min_value,
        le=SCHEMA_BY_FIELD["days_since_last_login"].max_value,
    )
    core_feature_usage_percentage: float = Field(
        ge=SCHEMA_BY_FIELD["core_feature_usage_percentage"].min_value,
        le=SCHEMA_BY_FIELD["core_feature_usage_percentage"].max_value,
    )

    @field_validator("login_frequency")
    @classmethod
    def _validate_login_frequency(cls, v: str) -> str:
        if v not in LOGIN_FREQ_ENCODING:
            raise ValueError(f"login_frequency must be one of {list(LOGIN_FREQ_ENCODING)}, got {v!r}")
        return v


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
    row = {
        "Account_Age_Days": c.account_age_days,
        "Daily_Usage_Mins": c.daily_usage_mins,
        "login_freq_enc": LOGIN_FREQ_ENCODING[c.login_frequency],
        "ticket_sentiment": sentiment,
        "days_since_last_login": c.days_since_last_login,
        "core_feature_usage_percentage": c.core_feature_usage_percentage,
    }
    return [row[key] for key in FEATURE_KEYS], sentiment


def categorize(risk_prob: float, usage_mins: int, days_since_last_login: int, usage_pct: float) -> str:
    if risk_prob >= THRESHOLD:
        return "At-risk"
    if (
        usage_mins < UNDERUSE_USAGE_MINS
        or days_since_last_login > UNDERUSE_DAYS_SINCE_LOGIN
        or usage_pct < UNDERUSE_USAGE_PCT
    ):
        return "Under-utilized"
    return "Healthy"


# ---- App -----------------------------------------------------------------
app = FastAPI(title="Churn-CALC ML Service")

# Always allow local dev; add the deployed frontend's origin(s) via FRONTEND_ORIGIN
# (comma-separated, e.g. "https://churn-calc.vercel.app,https://churn-calc-git-main.vercel.app").
DEV_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]


def _allowed_origins() -> list[str]:
    configured = [
        origin.strip()
        for origin in os.environ.get("FRONTEND_ORIGIN", "").split(",")
        if origin.strip()
    ]
    return list(dict.fromkeys(configured + DEV_ORIGINS))


app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins(),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content={"error": "Invalid request payload.", "details": jsonable_encoder(exc.errors())},
    )


@app.get("/health")
def health():
    return {"status": "ok", "features": FEATURE_KEYS}


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
            risk_category=categorize(float(p), c.daily_usage_mins, c.days_since_last_login, c.core_feature_usage_percentage),
            ticket_sentiment=round(float(s), 4),
        ))
    return {"predictions": preds}


if __name__ == "__main__":
    # Respects Render's injected $PORT when the service is started as `python main.py`;
    # `uvicorn main:app --port $PORT` (the documented start command) already gets this
    # from the shell, so this is a fallback for that alternate invocation, not the
    # primary path.
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
