# Churn-CALC

Churn-CALC — a churn-prediction dashboard that tells subscription businesses which
customers are about to leave, why, and what to do about it.

## Overview

Churn-CALC helps small SaaS and subscription teams — the ones who can't afford
enterprise customer-success tools — spot at-risk customers before they cancel. It's
built on three pillars: real ML churn scoring, plain-language AI explanations of *why*
a customer is at risk, and retention actions — deterministic recommendations plus
AI-drafted messages — that you review and send yourself.

## Screenshots

### Overview dashboard

![Overview metrics](./docs/screenshots/Screenshot%202026-07-20%20154651.png)
*Overview: total customers, % at risk, revenue at risk, MRR, plus monthly/annual revenue at risk and the estimated recoverable amount.*

![Risk distribution](./docs/screenshots/Screenshot%202026-07-20%20154707.png)
*Risk distribution across Healthy, At-risk, and Under-utilized, with labelled counts (not conveyed by colour alone).*

![What's driving churn](./docs/screenshots/Screenshot%202026-07-20%20154735.png)
*What's Driving Churn: at-risk/under-utilized customers grouped by their top churn factor.*

![Highest risk customers](./docs/screenshots/Screenshot%202026-07-20%20154748.png)
*Highest Risk Customers ranked by revenue at risk, with Churn Score and Revenue at Risk as distinct columns.*

![Retention outbox](./docs/screenshots/Screenshot%202026-07-20%20154802.png)
*Retention Outbox: drafts a retention message for every at-risk customer at once, each reviewed and sent individually.*

![At-risk register](./docs/screenshots/Screenshot%202026-07-20%20154813.png)
*At-Risk Register: every at-risk/under-utilized customer, ranked by revenue at risk, with top reason and recommended action.*

### Customer detail

![Customer detail](./docs/screenshots/Screenshot%202026-07-20%20154924.png)
*Customer detail: churn score, top risk factor, an AI explanation of why, and a recommended action.*

![What-if simulator](./docs/screenshots/Screenshot%202026-07-20%20155217.png)
*What-if simulator: adjusting inputs re-scores the customer live against the real model.*

![Draft retention message](./docs/screenshots/Screenshot%202026-07-20%20155227.png)
*Draft retention message with "Open in email client" (mailto) — nothing is sent automatically.*

![Customer feedback](./docs/screenshots/Screenshot%202026-07-20%20163113.png)
*Customer feedback: recording satisfaction feeds the sentiment input so the live score responds — session-only, no retraining.*

## Features

- Churn risk scoring per customer via a trained XGBoost model (test ROC-AUC ~0.86),
  using six features: account age, daily usage, login frequency, support-ticket
  sentiment, days since last login, and core-feature usage percentage — the last two
  exist specifically to detect under-utilized/inactive accounts, not just customers who
  are actively churning
- Two distinct, separately-labelled numbers throughout: **Churn Score** (0-100, the
  model's prediction) and **Revenue at Risk** (churnRisk/100 × monthlyValue, a
  deterministic dollar formula on top of the score) — never merged into one abstract
  number
- A deterministic recommendation engine that maps churn score + plan tier + engagement
  to a specific action — upsell, downgrade-to-retain, re-engage, retain, or monitor.
  It's a business-rules layer, not a Gemini call and not a model output, so it keeps
  working even when Gemini is down
- Deterministic churn-reason detection: each customer's top churn driver (e.g. "45 days
  since last login", "5% feature usage on a Pro plan"), plus an Overview chart grouping
  at-risk/under-utilized customers by their top factor
- At-Risk Register: every at-risk + under-utilized customer ranked by revenue at risk,
  with its top reason and recommended action; the "Highest Risk Customers" summary
  table is the same ranked list capped to the top few
- Retention Outbox: one action drafts a personalized retention message for every
  at-risk customer at once, generated from the deterministic templated path (no
  per-customer Gemini call, so batch drafting can't rate-limit) — each message is
  reviewed and sent individually
- Plain-language "why" explanations grounded in each customer's real data (Gemini),
  with a templated fallback when Gemini is unavailable
- AI-drafted personalized retention emails per customer (Gemini), with a templated
  fallback — sending is via a `mailto:` link that opens your own email client
  pre-filled; there's no server-side send and no email backend
- Interactive what-if panel that recomputes real risk live when you change customer
  inputs (usage, login frequency, days since login, feature usage, support-ticket state)
- Customer feedback signal: recording a customer's satisfaction (negative/neutral/
  positive) feeds the same sentiment input the model already uses, so the live churn
  score responds in real time — session-only, and it does not retrain or otherwise
  improve the model
- Revenue-at-risk / ROI business metrics on the dashboard
- Accessible by default: keyboard-navigable controls, visible focus indicators, WCAG AA
  colour contrast, and charts that expose a text alternative and don't rely on colour
  alone; the upload modal uses the native `<dialog>` element for a real focus trap and
  Esc-to-close

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

The XGBoost model is trained on ~2,000 synthetic subscription-customer records and
predicts churn from six signals: account age, daily usage, login frequency,
support-ticket sentiment, days since last login, and core-feature usage percentage.
Engagement and login signals carry significant weight in the trained model — the last
two features exist specifically so it can catch quietly under-utilized or inactive
accounts, not just customers who are actively showing churn behavior. Test ROC-AUC is
~0.86.

Training lives in `ml-service/train.py`, which generates the synthetic dataset and
exports the trained model. You don't need to retrain anything — the trained artifacts
already ship in `ml-service/artifacts/`.

## Project status

Feature-complete for the hackathon prototype. The customer roster is sample data
(no database yet), but churn scoring, explanations, and retention drafting all run
against real, live services. There's no server-side email send — retention messages
open in your own email client via `mailto:` — and no historical/month-over-month trend
data; every number reflects the current snapshot of the roster.
