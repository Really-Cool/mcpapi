export interface PhilosophicalTopic {
  id: string;
  title: string;
  description: string;
  question: string;
  dimensions: string[]; // 关联的哲学维度ID列表
  createdAt?: Date;
}

export interface PhilosophicalDimension {
  id: string;
  name: string;
  question: string;
  description: string;
  color: string;
  relatedTopics?: string[]; // 关联的议题ID列表
}

export interface PhilosophicalConcept {
  id: string;
  name: string;
  description: string;
  dimension: string;
  relatedConcepts: string[];
  relatedTopics?: string[]; // 关联的议题ID列表
  philosophers: string[];
  position: {
    x: number;
    y: number;
    z: number;
  };
  size: number;
  quote: string;
  schools: string[];
  era: string;
}

export interface PhilosophicalOpinion {
  id: string;
  title: string;
  content: string;
  conceptId: string; // 关联的概念ID
  dimensionId: string; // 关联的维度ID
  topicId: string; // 关联的议题ID
  author: string;
  support: number;
  createdAt?: Date;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  // 观点在不同维度上的评分
  scores: {
    embraceScore?: number; // 0: 超然接受, 1: 热烈拥抱
    individualityScore?: number; // 0: 个体视角, 1: 集体视角
    rationalityScore?: number; // 0: 感性, 1: 理性
    practicalityScore?: number; // 0: 理论, 1: 实践
    [key: string]: number | undefined; // 其他可能的评分维度
  };
}

export interface ConceptDetailProps {
  concept: PhilosophicalConcept | null;
  allConcepts: PhilosophicalConcept[];
  dimensions: PhilosophicalDimension[];
  opinions?: PhilosophicalOpinion[];
  onClose: () => void;
  onSelectConcept: (conceptId: string) => void;
}

export interface ConceptMapProps {
  concepts: PhilosophicalConcept[];
  dimensions: PhilosophicalDimension[];
  selectedDimension: string | null;
  selectedConcept: string | null;
  onSelectConcept: (conceptId: string) => void;
  highlightedConcepts?: string[];
}

export interface DimensionPanelProps {
  dimensions: PhilosophicalDimension[];
  selectedDimension: string | null;
  onSelectDimension: (dimensionId: string | null) => void;
  currentTopic?: PhilosophicalTopic;
}

export interface TopicPanelProps {
  topics: PhilosophicalTopic[];
  selectedTopic: string | null;
  onSelectTopic: (topicId: string | null) => void;
}

export interface OpinionDetailProps {
  opinion: PhilosophicalOpinion | null;
  relatedConcept?: PhilosophicalConcept;
  relatedDimension?: PhilosophicalDimension;
  onClose: () => void;
}

export interface OpinionFormProps {
  topicId: string;
  dimensionId: string;
  conceptId: string;
  onSubmit: (opinion: Omit<PhilosophicalOpinion, 'id' | 'support' | 'createdAt' | 'position'>) => void;
}

export interface ZoomControls {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  rotateUp: () => void;
  rotateDown: () => void;
  resetRotation: () => void;
}
