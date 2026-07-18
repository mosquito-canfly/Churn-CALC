# Churn-CALC

A churn-prediction dashboard for subscription businesses. It scores each customer's
risk of cancelling, explains *why* in plain language, and suggests a retention action —
aimed at small SaaS/subscription teams who can't afford enterprise customer-success tools.

---

## What's built so far

- **Frontend (Next.js)** — Overview dashboard, Customers list, and Customer detail pages.
- **ML model (XGBoost)** — trained on subscription behaviour + support-ticket sentiment.
  Scores churn risk from 0–100. Test ROC-AUC ≈ 0.83.
- **ML service (FastAPI)** — a small Python server that loads the model and returns
  predictions over HTTP. The frontend calls this for live risk scores.

## Still to do

- Wire the frontend's `/api/predict` route to the ML service (in progress).
- Gemini layer — turn risk scores into plain-language explanations + draft retention messages.
- Load the real demo dataset into the app and polish for the live demo.

---

## Project structure

```
Churn-CALC/
  ml-service/          Python FastAPI service that serves the model
    main.py
    requirements.txt
    artifacts/         the trained model + config files
  src/                 Next.js app (frontend + API routes)
  ...
```

---

## How to run it

You need **two terminals** — one for the ML service, one for the web app.

### 1. Start the ML service (Terminal 1)

```
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Runs at http://localhost:8000
Test it directly at http://localhost:8000/docs (interactive API page —
you can send test predictions there without any frontend).

> Note: this uses your global Python. A virtual environment is optional and not required.
> If you see an error about `sklearn`, run `pip install scikit-learn`.

### 2. Start the web app (Terminal 2)

```
npm install
npm run dev
```

Open http://localhost:3000

Keep **both** running at the same time — the web app calls the ML service for risk scores.

---

## The model, briefly

Trained on ~2,000 customer records. It predicts churn from four signals:

- Account age (days)
- Daily usage (minutes)
- Login frequency (Daily / Weekly / Rarely)
- Support-ticket sentiment (scored from the ticket text)

Sentiment is the second most predictive feature — evidence that combining
behavioural + text signals beats a numbers-only model.

Model training lives in the Colab notebook (Churn_CALC_Model_Training.ipynb).
You don't need to retrain it — the trained artifacts are already in ml-service/artifacts/.

---

## Tech stack

Frontend: Next.js, TypeScript, Tailwind
ML: Python, XGBoost, scikit-learn
Serving: FastAPI
(Planned) AI layer: Gemini API
