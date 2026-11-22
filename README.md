# ExperimentLab — AI Experimentation Copilot

**An AI-powered product experimentation platform that helps Product Managers turn product ideas into measurable hypotheses, design experiments, analyze results, and make evidence-based Ship / Iterate / Kill decisions.**

---

## ⚠️ Ethical Data Disclaimer

**All experiment data, metrics, results, and decisions in this application are SYNTHETIC / DEMO DATA.**

No real customers, real experiments, real conversion improvements, real revenue, or real statistical results are claimed or represented.

- All generated data is labelled **Synthetic / Demo Data**
- All AI-generated hypotheses are labelled **AI-Generated Hypothesis** (distinct from observed experiment results)
- All research participants are labelled **Illustrative Research Participant**
- All pricing is labelled **Illustrative**

This is a portfolio product demonstrating AI product management thinking, functional execution, transparent decision logic, and polished UX.

---

## Problem

Product Managers, Growth PMs, AI PMs, and Product Analysts have feature ideas but struggle to systematically answer:

- What exactly are we testing?
- Which users should receive the feature?
- What metric defines success?
- How large should the experiment be?
- Is the observed improvement meaningful?
- Is the feature worth the additional AI/inference cost?
- Should we ship, iterate, or stop?

Existing tools provide analytics **or** experimentation infrastructure, but none focus on the PM decision-making workflow from hypothesis → experiment → analysis → product decision, with AI cost analysis as a core differentiator.

---

## Solution

ExperimentLab turns the messy experimentation process into a structured workflow:

**Idea → User Problem → Hypothesis → Experiment → Metrics → Data → Analysis → Decision → Learning**

### Key Features

1. **Experiment Creation** — Define product, problem, target users, baseline, expected improvement, duration, AI cost.
2. **AI Hypothesis Generator** — Structured hypothesis ("We believe that [feature] for [target users] will increase [metric] from [baseline] to [target] because [reason]") with secondary hypotheses, assumptions, risks, expected behavior, and failure modes. Clearly labelled as AI-generated.
3. **Experiment Designer** — A/B test, feature flag, holdout, pre/post types; configurable variants and traffic allocation; primary, secondary, and guardrail metrics.
4. **Synthetic Dataset Generator** — Deterministic, seeded demo data for control/treatment users with conversion, revenue, retention, engagement, AI cost, latency. Clearly labelled synthetic.
5. **Analysis Engine** — Real statistical analysis computed from the dataset: control/treatment conversion, absolute/relative lift, confidence intervals, p-values, significance, guardrail changes. No invented confidence.
6. **Decision Engine** — Transparent SHIP / ITERATE / KILL recommendation considering product impact, statistical evidence, business value, AI cost, guardrails, and risk. Includes reasoning and next steps.
7. **AI Cost Analysis** — Incremental revenue vs incremental AI cost, net value, ROI, cost per conversion, cost per activated user.
8. **What-If Simulator** — Dynamic scenario planning: change conversion rate, sample size, AI cost, traffic allocation, duration, revenue/user and watch lift, ROI, and decision update live.
9. **Experiment Dashboard** — Active experiments, experiment health stats (running, completed, win rate, avg lift, avg duration, cost per experiment), all labelled synthetic.
10. **AI Assistant** — Data-grounded Q&A ("Why shouldn't we ship?", "What is the biggest risk?", "What happens if inference cost increases 25%?") using the current experiment's actual data.
11. **Decision Log** — Append-only record of date, experiment, hypothesis, result, decision, evidence, follow-up action.
12. **Product Documentation** — `/docs` folder with PRD, personas, competitive analysis, RICE, MoSCoW, metrics, framework, architecture, business model, roadmap, case study.

---

## Product Thinking

### Personas

- **Product Manager** — Needs to validate whether a feature should ship.
- **Growth PM** — Runs experiments around activation, conversion, retention, engagement.
- **AI PM** — Evaluates product impact vs AI/inference cost.
- **Product Analyst** — Analyzes experiment results and identifies patterns.

### Problem

PMs lack a unified tool combining hypothesis generation, statistical rigor, and AI cost analysis for the experimentation decision workflow.

### Hypothesis

Providing PMs with a structured experimentation workflow from AI-generated hypothesis through statistical analysis to a transparent decision will increase the percentage of product decisions backed by evidence.

### MVP

Experiment creation, hypothesis generation, A/B configuration, synthetic dataset, analysis, decision engine, ethical data labelling.

### Prioritization

RICE = Reach × Impact × Confidence / Effort. See `/docs/RICE-Prioritization.md`.

### Metrics

North Star: **Validated Product Decisions**. See `/docs/Product-Metrics.md`.

### Experiments

Structured before/during/after framework. See `/docs/Experimentation-Framework.md`.

### Roadmap

Phase 1 MVP → Phase 2 (simulator, assistant, cost) → Phase 3 (integrations, collaboration). See `/docs/Roadmap.md`.

---

## Architecture

- **TypeScript** (strict) + **React 18** + **Vite**
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **State:** React Context + `useReducer`
- **Math:** Custom normal CDF, two-proportion z-test, confidence intervals
- **Tests:** Vitest + React Testing Library
- **Routing:** React Router DOM

See `/docs/Technical-Architecture.md` for full details.

---

## Demo

### Prerequisites

- Node.js 18+
- npm

### Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run typecheck` | Run TypeScript typecheck (`tsc --noEmit`) |
| `npm run test` | Run unit tests (`vitest run`) |
| `npm run build` | Typecheck + production build (`tsc --noEmit && vite build`) |
| `npm run preview` | Preview production build |

### User Flow

1. **Create experiment** at `/create` — fill in feature details, baseline, expected improvement, AI cost.
2. **Review hypothesis** at `/hypothesis` — AI-generated hypothesis clearly labelled.
3. **Configure design** at `/design` — experiment type, variants, traffic allocation, metrics, guardrails.
4. **Generate data & analyze** — deterministic synthetic dataset, statistical analysis from data.
5. **Review decision** at `/decision` — SHIP / ITERATE / KILL with transparent reasoning.
6. **Run what-if** at `/simulator` — dynamic scenario planning.
7. **Log decision** at `/history` — append-only decision log.
8. **View docs** at `/docs` — full product documentation.

---

## Quality Requirements

Before considering the project complete:

```bash
npm install
npm run typecheck   # Zero TypeScript errors
npm run test        # All unit + smoke tests pass
npm run build       # Clean production build
```

Verification:
- No TypeScript errors
- No runtime errors / console errors
- No broken routes — all major screens render
- Experiment calculations work (computed from dataset, not invented)
- What-if simulator updates decision correctly
- Decision engine reacts to changing data
- Synthetic/demo labels visible on every screen

---

## Future Roadmap

- Real analytics integrations (Amplitude, Mixpanel, PostHog)
- Feature flag integrations (LaunchDarkly, Split, Statsig)
- Experiment history and persistence
- Team collaboration (shared experiment library)
- Export to PDF/CSV

---

## License

MIT
