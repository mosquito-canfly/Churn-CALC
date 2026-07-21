# Product

## Register

product

## Platform

web

## Users

Non-technical operators at small subscription businesses — a founder, a customer
success lead, or a solo operator wearing both hats — who need to know which customers
are likely to cancel and what to do about it, without reading model internals or a
spreadsheet of feature weights. They check the dashboard periodically rather than
staring at a live ops screen all day: scanning for the highest-revenue accounts at
risk, and expecting one clear next action per customer, not a raw probability to
interpret themselves.

## Product Purpose

Churn-CALC is a churn-prediction dashboard for small subscription businesses. It
surfaces which customers are likely to churn, why, and what to do about it: MRR,
revenue-at-risk, a per-customer churn score from a real XGBoost model, an AI-generated
explanation of that score, and a deterministic recommended retention action. Success
is an operator opening the dashboard, immediately identifying the highest-revenue-at-risk
accounts, understanding the top driving factor behind each one, and having a concrete
next step ready to act on within a minute — turning a churn signal into an action
instead of a number they have to interpret themselves.

## Positioning

Where a generic BI dashboard stops at a number, Churn-CALC pairs a live prediction with
a plain-language reason and one concrete action to take — every risk score on screen
resolves to something the operator can actually do next.

## Brand Personality

Trustworthy, calm, and professional — software an operator trusts with real revenue
decisions. Confident through precision and restraint, not through flash: clear numbers,
plain language, deliberate color, no gamification or hype.

## Anti-references

The AI-generated-dashboard clichés this should never read as: gradient-filled logo
tiles, pastel-tinted "AI" panels or badges that ghettoize model output as a gimmick,
over-reliance on a single accent color used indiscriminately for everything, and
decorative side-stripe borders on cards or callouts.

## Design Principles

- **Earn color, don't decorate with it.** Risk category color (red / amber / emerald)
  and the cyan accent are load-bearing signals, not decoration — they mark severity or
  actionability, never used just to look lively.
- **Every score resolves to an action.** A churn score or revenue-at-risk figure never
  stands alone on screen without the driving reason and the recommended next step
  nearby.
- **Real is presented as real, illustrative is labeled.** Live model output (churn
  score, AI explanation, what-if predictions) reads with the same plain confidence as
  static data; anything illustrative or mock is never dressed up to look like a live
  signal.
- **Quiet by default, loud only where it matters.** Restraint is the resting state;
  visual weight (bright fills, badges, saturated color) is reserved for what genuinely
  needs the operator's attention right now.

## Accessibility & Inclusion

WCAG AA, already implemented and to be maintained on any new work: body text ≥4.5:1
contrast, a consistent 2px `sky-400` focus-visible ring on every interactive element,
full keyboard operability (native `<input type="range">`, `<select>`, `<dialog>`,
`role="tablist"` with roving tabindex and arrow-key support), and no information
conveyed by color alone — risk categories, chart legends, and progress bars all pair
color with text or icons.
