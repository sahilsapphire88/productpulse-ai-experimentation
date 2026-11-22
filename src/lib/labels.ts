import type { DemoLabel } from '../types';

export const SYNTHETIC_LABEL: DemoLabel = {
  kind: 'SYNTHETIC',
  text: 'SYNTHETIC / DEMO DATA',
};

export const AI_GENERATED_LABEL: DemoLabel = {
  kind: 'AI_GENERATED',
  text: 'AI-GENERATED HYPOTHESIS',
};

export const ILLUSTRATIVE_LABEL: DemoLabel = {
  kind: 'ILLUSTRATIVE',
  text: 'ILLUSTRATIVE',
};

export function demoLabel(kind: DemoLabel['kind']): DemoLabel {
  switch (kind) {
    case 'SYNTHETIC':
      return SYNTHETIC_LABEL;
    case 'AI_GENERATED':
      return AI_GENERATED_LABEL;
    case 'ILLUSTRATIVE':
      return ILLUSTRATIVE_LABEL;
  }
}
