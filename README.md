# Churn-CALC

Churn-CALC — a churn-prediction dashboard that tells subscription businesses which
customers are about to leave, why, and what to do about it.

## Overview

Churn-CALC helps small SaaS and subscription teams — the ones who can't afford
enterprise customer-success tools — spot at-risk customers before they cancel. It's
built on three pillars: real ML churn scoring, plain-language AI explanations of *why*
a customer is at risk, and AI-drafted retention actions you can send right away.

## Features

- Churn risk scoring per customer via a trained XGBoost model (test ROC-AUC ~0.83)
- Plain-language "why" explanations grounded in each customer's real data (Gemini)
- AI-drafted personalized retention emails (Gemini)
- Interactive what-if panel that recomputes real risk when you change customer inputs
- Revenue-at-risk / ROI business metrics on the dashboard

## Architecture

```
Browser
  │
  ▼
Next.js app (frontend + API routes)
  │
  ├──► /api/predict ──────────────► FastAPI ML service (XGBoost)
  │
  └──► /api/explain,
       /api/draft-message ───────► Gemini API
```

The Next.js API routes are thin proxies — they forward requests to the ML service or
Gemini, apply a typed response shape, and fall back to templated/mock output if either
service is unreachable, so the UI never hard-fails.

## Tech stack

| Layer       | Stack                                          |
| ----------- | ----------------------------------------------- |
| Frontend    | Next.js (App Router), TypeScript, Tailwind, Recharts |
| ML service  | Python, FastAPI, XGBoost, scikit-learn          |
| AI layer    | Gemini API                                      |

## Getting started

### Prerequisites

- Node.js
- Python 3
- A [Gemini API key](https://aistudio.google.com/apikey)

### Environment variables

Copy `.env.example` to `.env.local` and fill it in:

```
ML_SERVICE_URL=http://localhost:8000
GEMINI_API_KEY=your-key-here
```

- `ML_SERVICE_URL` — base URL of the ML service. The default works for local dev.
- `GEMINI_API_KEY` — get one from [Google AI Studio](https://aistudio.google.com/apikey).
  Without it, `/api/explain` and `/api/draft-message` still work but fall back to
  templated (non-AI) text.

### Running it

You need **two terminals** running at the same time.

**Terminal 1 — ML service**

```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Runs at http://localhost:8000. Visit `/docs` for interactive API docs you can test
predictions against directly.

> If you see an error about `sklearn`, run `pip install scikit-learn`.

**Terminal 2 — web app**

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> Restart `npm run dev` after editing `.env.local` — Next.js only reads it on startup.

## How the model works

The XGBoost model is trained on ~2,000 subscription-customer records and predicts
churn from four signals: account age, daily usage, login frequency, and
support-ticket sentiment. Sentiment is the second-strongest predictor — evidence that
combining behavioral and text signals beats a numbers-only model.

Training lives in `Churn_CALC_Model_Training.ipynb`. You don't need to retrain
anything — the trained artifacts already ship in `ml-service/artifacts/`.

## Project status

Feature-complete for the hackathon prototype. The customer roster is sample data
(no database yet), but churn scoring, explanations, and retention drafting all run
against real, live services.
