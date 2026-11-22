# PRD — ExperimentLab

## 1. Overview

**Product:** ExperimentLab — AI Experimentation Copilot  
**One-liner:** An AI-powered product experimentation platform that helps Product Managers turn product ideas into measurable hypotheses, design experiments, analyze results, and make evidence-based Ship / Iterate / Kill decisions.  
**Status:** Concept / MVP

## 2. Problem

Product Managers, Growth PMs, AI PMs, and Product Analysts have feature ideas but lack a structured workflow to answer:

- What exactly are we testing?
- Which users should receive the feature?
- What metric defines success?
- How large should the experiment be?
- What baseline should we compare against?
- Is the observed improvement meaningful?
- Is the feature worth the additional AI/inference cost?
- Should we ship, iterate, or stop?

Existing tools provide analytics or experimentation infrastructure, but none focus on the PM decision-making workflow from hypothesis → experiment → analysis → product decision.

## 3. Target Users

| User | Needs |
|------|-------|
| Product Manager | Validate whether a feature should ship. |
| Growth PM | Run experiments around activation, conversion, retention, engagement. |
| AI PM | Evaluate product impact vs AI/inference cost. |
| Product Analyst | Analyze experiment results and identify meaningful patterns. |

## 4. Goals & Success Metrics

### Goals
- Structured workflow from idea to decision.
- AI-generated hypothesis (clearly labelled as AI-generated).
- Real statistical analysis computed from data (no invented confidence).
- Transparent SHIP / ITERATE / KILL decision with reasoning.
- AI cost analysis (incremental revenue vs incremental AI cost).
- What-if simulator for dynamic scenario planning.
- All data clearly labelled as synthetic / demo.

### Success Metrics (North Star)
**Validated Product Decisions** — number of decisions made with clear evidence per month.

Supporting: experiment completion rate, decision confidence, time-to-decision, win rate, average lift, cost per experiment, % resulting in iteration.

## 5. Scope

### In Scope
- Experiment creation form
- AI hypothesis generator
- Experiment designer (type, variants, traffic, metrics, guardrails)
- Synthetic dataset generator (deterministic, seeded)
- Statistical analysis engine (z-test, CI, lift)
- Decision engine (SHIP / ITERATE / KILL + reasoning)
- AI cost analysis (incremental cost, ROI)
- What-if simulator
- Experiment dashboard
- Decision log
- AI assistant (data-grounded Q&A)
- /docs folder with product documentation

### Out of Scope (MVP)
- Real analytics integrations (Amplitude, Mixpanel, etc.)
- Feature flag integrations (LaunchDarkly, etc.)
- User authentication / team collaboration
- Real-time data streaming
- Export to PDF/CSV

## 6. Ethical Data Requirements

All generated data is labelled **Synthetic / Demo Data**. No real customers, real experiments, or real statistical results are claimed. All research participants are **Illustrative**. All pricing is **Illustrative**.

## 7. Technical Requirements

- TypeScript (strict)
- React 18 + Vite
- Component-based architecture
- Deterministic demo data (seeded RNG)
- Unit tests + render smoke tests
- Responsive design
- No TypeScript errors, no build errors, all tests pass

## 8. Roadmap

| Phase | Features |
|-------|----------|
| Phase 1 — MVP | Experiment creation, hypothesis generation, A/B config, synthetic dataset, analysis, decision engine |
| Phase 2 | What-if simulator, AI assistant, cost analysis, advanced analytics |
| Phase 3 | Real analytics integrations, feature flag integrations, experiment history, team collaboration |
