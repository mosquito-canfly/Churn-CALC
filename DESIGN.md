---
name: Churn-CALC
description: Dark, cyan-accented churn-prediction dashboard for subscription businesses
colors:
  page-bg: "#0a0a0a"
  card-surface: "#171717"
  card-border: "#262626"
  ink: "#fafafa"
  muted-ink: "#a3a3a3"
  accent-text: "#38bdf8"
  accent-fill: "#0369a1"
  accent-fill-hover: "#075985"
  accent-tint-bg: "#082f49"
  accent-tint-border: "#0c4a6e"
  healthy: "#34d399"
  healthy-tint-bg: "#022c22"
  healthy-tint-border: "#064e3b"
  under-utilized: "#fbbf24"
  under-utilized-tint-bg: "#451a03"
  under-utilized-tint-border: "#78350f"
  at-risk: "#f87171"
  at-risk-tint-bg: "#450a0a"
  at-risk-tint-border: "#7f1d1d"
  rec-upsell: "#a684ff"
  rec-upsell-tint-bg: "#2f0d68"
  rec-upsell-tint-border: "#4d179a"
  rec-downgrade: "#7c86ff"
  rec-downgrade-tint-bg: "#1e1a4d"
  rec-downgrade-tint-border: "#312c85"
  rec-reengage: "#ff637e"
  rec-reengage-tint-bg: "#4d0218"
  rec-reengage-tint-border: "#8b0836"
  rec-retain: "#00d5be"
  rec-retain-tint-bg: "#022f2e"
  rec-retain-tint-border: "#0b4f4a"
  insight-green: "#05df72"
  insight-green-border: "#0d542b"
typography:
  display:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "16px"
    fontWeight: 600
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "12px"
    fontWeight: 500
rounded:
  sm: "8px"
  md: "12px"
  full: "9999px"
spacing:
  sm: "12px"
  md: "20px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent-fill}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.accent-fill-hover}"
  card:
    backgroundColor: "{colors.card-surface}"
    rounded: "{rounded.md}"
    padding: "20px"
  badge-status:
    rounded: "{rounded.full}"
    padding: "4px 10px"
---

# Design System: Churn-CALC

## 1. Overview

**Creative North Star: "The Quiet Control Room"**

Churn-CALC reads like an instrument panel built for someone making real revenue
decisions, not a marketing site for an AI feature. The surface is dark and settled —
near-black cards on a near-black page — so that the handful of things that actually
need attention (a red risk badge, a revenue-at-risk figure, a recommended action) are
the only things that visually raise their hand. Cyan is used deliberately and
sparingly: bright for text, icons, and active state; a deeper, muted step for solid
button fills. Nothing shouts, because nothing here should look manufactured to
impress — it should look like software a small business owner already trusts.

This system explicitly rejects the AI-dashboard reflex: no gradient-filled logo tiles,
no pastel "AI feature" panels that set model output apart as a gimmick, no single
accent color doing every job on the page, no decorative side-stripe borders standing
in for real hierarchy.

**Key Characteristics:**
- Near-black surfaces (`neutral-950` page, `neutral-900` cards) with a subtle
  `neutral-800` border — never a plain white card.
- A deliberate two-step cyan: bright `sky-400` for text/icons/links, deeper `sky-700`
  reserved for solid button fills.
- Risk severity color (emerald / amber / red) is a signal, not a decoration — it only
  ever appears on the thing it's actually describing.
- Flat by default. Depth comes from a border and a lighter surface tone, not shadow.

## 2. Colors

The palette is a single dark neutral scale, one cyan accent used at two distinct
strengths, and three semantic risk colors that never leak outside their role.

### Primary
- **Cyan Signal** (`#38bdf8`, Tailwind `sky-400`): text, icons, links, active nav/tab
  state, and chart highlights directly on dark surfaces (~8:1 contrast). This is the
  "the app is drawing your eye here" color.
- **Cyan Fill** (`#0369a1`, Tailwind `sky-700`, hover `#075985`/`sky-800`): solid button
  backgrounds with white label text (~5.9:1 contrast). Deliberately a different, darker
  step than Cyan Signal — the bright step fails AA as white-on-fill text even though it
  reads fine as a graphical accent.

### Neutral
- **Page** (`#0a0a0a`, `neutral-950`): the app background.
- **Card Surface** (`#171717`, `neutral-900`): every card, panel, and the sidebar's
  nested tiles.
- **Card Border** (`#262626`, `neutral-800`): the one border every surface gets;
  nothing is a bare white card.
- **Ink** (`#fafafa`, `neutral-50`/white): primary text and headings.
- **Muted Ink** (`#a3a3a3`, `neutral-400`): secondary text, labels, timestamps — chosen
  over the darker `neutral-500` step specifically because `-500` falls short of 4.5:1
  against the card surface.

### Semantic (Risk) Colors
Each risk category owns one hue across the whole app — the chart, the badge, the
progress bar, the what-if ring — and always pairs the same bright text/icon step with
a near-black tinted background, the inverse of a light-theme badge:
- **Healthy** — text/bar/dot `#34d399` (`emerald-400`) on `#022c22` (`emerald-950`),
  ring `#064e3b` (`emerald-900`).
- **Under-utilized** — text/bar/dot `#fbbf24` (`amber-400`) on `#451a03` (`amber-950`),
  ring `#78350f` (`amber-900`).
- **At-risk** — text/bar/dot `#f87171` (`red-400`) on `#450a0a` (`red-950`), ring
  `#7f1d1d` (`red-900`).

### Tertiary (Recommendation Kind)
A recommendation kind (what to do about a customer) is a different question from a
risk category (how healthy they are), so it owns a hue family entirely disjoint from
Semantic (Risk) Colors above — never emerald/amber/red, so the two questions never
share a color in the same table row:
- **Upsell** — `#a684ff` (`violet-400`) on `#2f0d68` (`violet-950`), ring `#4d179a`
  (`violet-900`).
- **Downgrade** — `#7c86ff` (`indigo-400`) on `#1e1a4d` (`indigo-950`), ring `#312c85`
  (`indigo-900`).
- **Re-engage** — `#ff637e` (`rose-400`) on `#4d0218` (`rose-950`), ring `#8b0836`
  (`rose-900`).
- **Retain** — `#00d5be` (`teal-400`) on `#022f2e` (`teal-950`), ring `#0b4f4a`
  (`teal-900`).
- **Monitor** — plain `neutral-800`/`neutral-400`/`neutral-700`, matching the
  lowest-urgency tier of every other neutral control in the app.

### Insight Green (Fixed Accent)
Two spots use green as a fixed, non-semantic accent rather than a risk signal: the
Overview's "recoverable revenue" callout, and the customer detail page's AI
Explanation panel. Both draw from Tailwind's `green` family — a distinct hue from
`emerald` (`green-400` sits at OKLCH hue ~152° vs. `emerald-400`'s ~163°, a
perceptibly different, more grass-toned green) — specifically so this accent can
never be mistaken for the Healthy risk color, and so it never changes with the
customer's actual risk category:
- **Insight Green** — `#05df72` (`green-400`) for icons/heading text/emphasis, `#0d542b`
  (`green-900`) for the AI Explanation panel's border. Fixed regardless of context;
  never swapped for `riskColors[category]`.

### Named Rules
**The Two-Step Cyan Rule.** Cyan text/icons and cyan button fills are never the same
shade. Bright `sky-400` is for anything read directly off a dark surface; the deeper
`sky-700`/`sky-800` is reserved for solid fills carrying white text.

**The One Hue, One Meaning Rule.** Emerald, amber, and red belong to Healthy,
Under-utilized, and At-risk respectively, and to nothing else. They are never
repurposed as generic decorative color — including for a different taxonomy like
recommendation kind (violet/indigo/rose/teal) or a fixed non-semantic accent
(`green`, deliberately a different Tailwind family from `emerald`).

## 3. Typography

**Body Font:** Arial, Helvetica, sans-serif (via `globals.css`'s `body` rule).

**Character:** Plain, system-native, unadorned — there is currently no deliberate
display/body pairing; one sans-serif stack carries every size and weight in the app.

> Note: the codebase also loads Geist Sans / Geist Mono via `next/font` and exposes
> them as `--font-geist-sans` / `--font-geist-mono` CSS variables, but `globals.css`'s
> plain `body { font-family: Arial, Helvetica, sans-serif; }` rule is what actually
> renders (confirmed via computed style) — the Geist variables are currently unused.
> Documented as-is per this pass's scope; a future `/impeccable typeset` pass is the
> right place to resolve this, not this document.

### Hierarchy
- **Display** (600, 24px, tight tracking): metric card values (Total Customers, MRR,
  Revenue at Risk).
- **Headline** (600, 20px, tight tracking): page titles ("Overview", "Customers", a
  customer's name).
- **Title** (600, 16px): section headings (`SectionHeading`'s title slot).
- **Body** (400, 14px): the default text size across tables, dates, descriptions, form
  controls.
- **Label** (500, 12px, wide tracking on the sidebar's "WORKSPACE" eyebrow only):
  badges, table headers, small metadata.

## 4. Elevation

Flat by default: surfaces are separated by a `neutral-800` border and a lighter
`neutral-900` fill against the `neutral-950` page, never a drop shadow. Shadow is
reserved for the small set of elements that genuinely float above the page: the
upload button (`shadow-sm`) and the upload `<dialog>` (`shadow-lg`, plus its
`backdrop:bg-black/60` scrim). Cards, badges, and panels carry no shadow at all.

### Named Rules
**The Border-Not-Shadow Rule.** Depth on a resting surface comes from a border and a
lighter fill, never a shadow. Shadow only appears on something that's actually
elevated above the page (a modal, a lifted button), not on ordinary cards.

## 5. Components

### Buttons
- **Shape:** `rounded-lg` (8px).
- **Primary:** Cyan Fill background (`sky-700`), white text, `px-4 py-2`; hover darkens
  to `sky-800`.
- **Secondary / Ghost:** `neutral-700` border, `neutral-300` text, `neutral-800` hover
  fill — no color fill at rest.

### Badges (risk / status)
- **Style:** full pill (`rounded-full`), `ring-1 ring-inset`, a semantic tint
  background + bright text (see Semantic Colors), a small leading dot in the same hue.
  Never a side-stripe or left-border variant. Always `whitespace-nowrap` — a badge
  wrapping onto a second line inside its pill is a bug, not a valid narrow state.

### Badges (recommendation kind)
- **Style:** same full-pill construction as risk badges (`rounded-full`, `ring-1
  ring-inset`, tint background + bright text), but drawn from the Recommendation Kind
  hues, never risk hues — no leading dot, so the two badge families are also
  distinguishable by shape, not color alone.

### Cards / Containers
- **Corner Style:** `rounded-xl` (12px).
- **Background:** `neutral-900`.
- **Border:** `neutral-800`, 1px, full perimeter, by default.
- **Fixed-accent variant:** exactly two panels (AI Explanation, Recommended Action)
  swap the border color only — `green-900` / `sky-900` respectively, still 1px, still
  full perimeter, background still plain `neutral-900` — never a tinted fill and never
  a thicker or single-side border (a thicker accent border clashes with the rounded
  corner). Paired with heading text in the same hue. See Do's and Don'ts.
- **Shadow Strategy:** none (see Elevation).
- **Internal Padding:** `p-5`/`p-6` (20–24px).

### Field Strip
- **Use:** a compact row of labeled stat cells — currently the customer detail page's
  header (Plan Tier, Monthly Value, Account Age, Login Frequency, Daily Usage, Last
  Active).
- **Style:** a CSS grid with a 1px `neutral-800` gap between cells (`gap-px` on a
  `neutral-800` background, each cell `neutral-900`) inside one `rounded-lg
  neutral-800` border — renders as hairline dividers between fields without manually
  managing `border-right`/last-child edge cases. Label (`text-xs neutral-400`) above
  value (`text-sm font-medium neutral-200`), `px-5 py-4` per cell.
- **Responsive:** column count steps down at narrower widths (e.g. 6 → 3 → 2); the
  divider grid re-flows automatically rather than needing separate mobile markup.

### Navigation (Sidebar)
- **Logo tile:** a flat `rounded-xl` chip, `sky-950` background, `sky-800` border,
  `sky-400` icon — bordered and tinted, not a gradient fill. The icon itself is a
  standalone `Logo` component (`src/components/Logo.tsx`) rather than inline markup,
  specifically so a future asset swap only touches one file; every path/stroke in it
  uses `currentColor` so it always follows the tile's `sky-400`, never carrying its
  own fixed hue.
- **Nav item:** active = `neutral-800` fill + white text + `sky-400` icon; inactive =
  `neutral-400` text, `neutral-900` hover fill.
- **Behavior:** `sticky top-0 h-screen overflow-y-auto` — stays visible while content
  scrolls, scrolls internally rather than clipping.

### Insight Callout
- **Use:** the Overview's recoverable-revenue callout ("Acting on your N at-risk
  customers could protect an estimated $X/month...").
- **Style:** the same plain card as every other panel (`rounded-xl border
  border-neutral-800 bg-neutral-900 p-5`) — not a full-width tinted alert bar. An icon
  chip reuses `MetricCard`'s own icon-chip idiom (`h-8 w-8 rounded-lg bg-neutral-800`)
  with an Insight Green icon instead of the danger-tone red, so the callout reads as a
  natural variant of an existing pattern rather than a bolted-on banner. The dollar
  figure is the only bolded/colored text in the sentence.

### Modal
- Native `<dialog>` (`UploadModal`), centered via `fixed inset-0 m-auto`, `neutral-900`
  surface, `neutral-800` border, `shadow-lg`, dark `backdrop:bg-black/60` scrim.

## 6. Do's and Don'ts

### Do:
- **Do** keep the two-step cyan intact: `sky-400` for text/icons, `sky-700`/`sky-800`
  only for solid fills. Never swap which step does which job.
- **Do** use the near-black tint + bright text badge convention
  (`bg-{color}-950` + `text-{color}-400` + `ring-{color}-900`) for every status or risk
  indicator, and pair it with a text label or icon — never color alone.
- **Do** keep cards flat: `neutral-800` border + `neutral-900` surface, no drop shadow.
  Reserve shadow for genuinely floating elements (the upload button, the modal).
- **Do** give every risk category (`emerald`/`amber`/`red`) exactly one meaning across
  the whole app; never repurpose one for plain decoration.
- **Do** keep recommendation-kind badges (`violet`/`indigo`/`rose`/`teal`) visually
  disjoint from risk-category badges (`emerald`/`amber`/`red`) — they answer different
  questions and must never share a hue in the same row.
- **Do** keep the AI Explanation (`green-900` border, `green-400` heading) and
  Recommended Action (`sky-900` border, `sky-400` heading) colors fixed — never derive
  either from `riskCategory`. An At-risk customer's explanation must never render in
  Insight Green being mistaken for "Healthy," which is exactly why that accent is
  `green`, not `emerald`, in the first place.

### Don't:
- **Don't** put a gradient on the sidebar logo tile or any icon tile — it's a flat
  bordered cyan chip today, not a gradient fill.
- **Don't** give the AI Explanation or Recommended Action panels a tinted background
  fill, a side-stripe border, or a decorative icon next to the heading — a real `<h2>`
  (via `SectionHeading`), a plain `neutral-900` background, and a colored 1px full
  border are the whole treatment. Model output isn't visually set apart as a gimmick;
  it's a restrained variant of the same card every other panel uses.
- **Don't** lean on cyan as the only accent for everything on a screen; risk category
  color carries its own meaning and shouldn't be recolored cyan "for consistency."
- **Don't** add a colored side-stripe (`border-left`/`border-right` accent) to cards,
  list rows, or callouts. Use the full border + tint convention instead.
- **Don't** treat Arial/system-default as a deliberate typographic choice going
  forward — it's the current de facto body font, not a designed decision (see
  Typography's note); flagged for a future pass, not something to casually reproduce
  in new components.
