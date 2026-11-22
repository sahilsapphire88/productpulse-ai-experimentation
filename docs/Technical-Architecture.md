# Technical Architecture — ExperimentLab

## Stack

- **Language:** TypeScript (strict mode)
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + custom UI components
- **Charts:** Recharts
- **Icons:** lucide-react
- **State:** React Context + useReducer (single source of truth)
- **Math:** Custom (normal CDF, two-proportion z-test, confidence intervals) — no heavy statistics library
- **Tests:** Vitest + React Testing Library
- **Routing:** React Router DOM

## Directory Structure

```
src/
  types/          # Shared domain types
  lib/            # Pure logic: math, rng, demoData, analysis, cost, decision, hypothesis, assistant, simulator, labels, decisionLog
  store/          # React Context + reducer (experiment store)
  components/     # Reusable UI (ui/, common/, layout/)
  pages/          # Route-level pages
  test/           # Test setup
```

## Data Flow

1. User creates experiment → stored in `ExperimentContext`
2. User generates demo data → `generateDataset()` (seeded RNG, deterministic)
3. `analyzeExperiment()` computes aggregates, z-test, lift, CI from dataset
4. `computeCostBreakdown()` calculates incremental revenue, AI cost, net value, ROI
5. `makeDecision()` applies rules → SHIP / ITERATE / KILL + reasoning
6. `runSimulation()` recomputes all of the above for what-if inputs
7. Decision logged to `decisionLog` (localStorage)

## Statistical Method

- Two-proportion z-test (pooled SE for z, unpooled SE for CI)
- 95% confidence interval for difference in proportions
- Significance at α = 0.05
- No invented confidence — all computed from generated data

## Ethical Data Contract

- All generated data: `synthetic: true`, labelled **Synthetic / Demo Data**
- All hypotheses: labelled **AI-Generated Hypothesis**
- All research: labelled **Illustrative**
- All pricing: labelled **Illustrative**

## Key Files

- `src/lib/math.ts` — normal CDF, z-test, CI, sample size
- `src/lib/analysisEngine.ts` — aggregation + analysis from dataset
- `src/lib/decisionEngine.ts` — SHIP / ITERATE / KILL with reasoning
- `src/lib/costAnalysis.ts` — incremental cost, revenue, ROI
- `src/lib/simulator.ts` — what-if simulation
- `src/store/experimentStore.ts` — Context + reducer
