# Churn-CALC ML Service

FastAPI service that serves churn predictions from the trained XGBoost model.
The Next.js app calls this from its `/api/predict` route.

## Setup

```bash
cd ml-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Place the model artifacts in `ml-service/artifacts/`:
- churn_model.json
- feature_config.json
- sentiment_map.json

(churn_model.pkl is a backup, not needed by the service.)

## Run

```bash
uvicorn main:app --reload --port 8000
```

Service runs at http://localhost:8000
Interactive API docs at http://localhost:8000/docs

## Endpoints

`GET /health` — liveness check.

`POST /predict` — body:
```json
{
  "customers": [
    {
      "customer_id": "c1",
      "account_age_days": 90,
      "daily_usage_mins": 6,
      "login_frequency": "Rarely",
      "last_support_ticket": "I'm very frustrated with the downtime."
    }
  ]
}
```

Returns `churn_risk` (0-100), `risk_category`, and `ticket_sentiment` per customer.
