// ─── Presentational Component Props ──────────────────────────────────────────

export interface MotivationItem {
  text: string;
}

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  content: string[];
}

// ─── SideBySideComparisonCard ────────────────────────────────────────────────

export interface ComparisonCardData {
  header: string;
  icon: 'ShieldCheck' | 'Key';
  description: string;
  analogy: string;
}

export interface SideBySideComparisonCardProps {
  title: string;
  leftCard: ComparisonCardData;
  rightCard: ComparisonCardData;
}

// ─── GridList ────────────────────────────────────────────────────────────────

export interface GridListItem {
  title: string;
  desc: string;
}

export interface GridListProps {
  title: string;
  items: GridListItem[];
}

// ─── InteractiveDiagram ──────────────────────────────────────────────────────

export interface DiagramStep {
  step: string;
  boxLabel: string;
  detail: string;
  color: string;
}

export interface InteractiveDiagramProps {
  title: string;
  description: string;
  diagramSteps: DiagramStep[];
}

// ─── SequenceDiagramList ─────────────────────────────────────────────────────

export interface SecurityFlow {
  flowName: string;
  steps: string[];
}

export interface SequenceDiagramListProps {
  title: string;
  flows: SecurityFlow[];
}

// ─── ProsConsTable ───────────────────────────────────────────────────────────

export interface ProsConsTableProps {
  title: string;
  pros: string[];
  cons: string[];
}

// ─── CallOutBlock ────────────────────────────────────────────────────────────

export interface CallOutBlockProps {
  title: string;
  content: string;
}
