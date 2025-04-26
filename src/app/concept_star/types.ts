export interface Opinion {
  id: string;
  title: string;
  content: string;
  dimension: string;
  author: string;
  support: number;
  position: {
    x: number;
    y: number;
  };
  embraceScore: number; // 0: fully detached, 1: fully embracing
  perspectiveScore: number; // 0: individual perspective, 1: cosmic perspective
}

export interface TopicDimension {
  id: string;
  name: string;
  question: string;
  description: string;
}

export interface Topic {
  title: string;
  description: string;
  dimensions: TopicDimension[];
}

export interface OpinionDetailProps {
  opinion: Opinion | null;
  onClose: () => void;
}
