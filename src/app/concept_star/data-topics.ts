import { 
  PhilosophicalTopic, 
  PhilosophicalOpinion 
} from './types-enhanced';

// 生命短暂性议题
export const LIFE_TRANSIENCE_TOPIC: PhilosophicalTopic = {
  id: "life-transience",
  title: "生命的短暂本质",
  description: "探讨面对生命短暂性时的哲学态度，涉及存在主义、享乐主义、斯多葛主义等多个哲学流派的思考。",
  question: "生命的短暂本质，究竟要求我们热烈拥抱还是超然接受？",
  dimensions: ["ethics", "ontology", "aesthetics", "metaphysics", "epistemology"],
  createdAt: new Date("2025-04-26")
};

// 其他可能的议题示例
export const OTHER_TOPICS: PhilosophicalTopic[] = [
  {
    id: "technology-humanity",
    title: "技术与人性",
    description: "探讨技术发展对人类本质和社会结构的影响，以及如何在技术进步中保持人性。",
    question: "技术的加速发展是增强还是削弱了我们的人性？",
    dimensions: ["ethics", "epistemology", "political", "aesthetics"],
    createdAt: new Date("2025-04-20")
  },
  {
    id: "consciousness-nature",
    title: "意识的本质",
    description: "探讨意识的来源、性质及其与物质世界的关系，涉及心灵哲学、认知科学和形而上学。",
    question: "意识是物质的涌现属性，还是宇宙的基础构成？",
    dimensions: ["metaphysics", "epistemology", "ontology", "phenomenology"],
    createdAt: new Date("2025-04-15")
  },
  {
    id: "freedom-determinism",
    title: "自由与决定论",
    description: "探讨人类自由意志的可能性，以及我们的选择在多大程度上是自由的。",
    question: "在因果链条的宇宙中，自由意志是否可能存在？",
    dimensions: ["ethics", "metaphysics", "existentialism", "logic"],
    createdAt: new Date("2025-04-10")
  }
];

// 所有议题的集合
export const ALL_TOPICS: PhilosophicalTopic[] = [
  LIFE_TRANSIENCE_TOPIC,
  ...OTHER_TOPICS
];

// 生命短暂性议题下的观点示例
export const LIFE_TRANSIENCE_OPINIONS: PhilosophicalOpinion[] = [
  {
    id: "opinion-1",
    title: "及时行乐是对生命短暂最好的回应",
    content: "面对生命的短暂，我们应当最大化当下的体验和快乐。未来是不确定的，过去已经逝去，只有当下的体验是真实的。因此，及时行乐不是放纵，而是对生命短暂性的理性回应。",
    conceptId: "carpe_diem",
    dimensionId: "ethics",
    topicId: "life-transience",
    author: "用户A",
    support: 78,
    createdAt: new Date("2025-04-25"),
    position: { x: 0.7, y: 0.3, z: 0.2 },
    scores: {
      embraceScore: 0.9,
      individualityScore: 0.8,
      rationalityScore: 0.5,
      practicalityScore: 0.7
    }
  },
  {
    id: "opinion-2",
    title: "有限性是生命意义的基础",
    content: "正是因为生命是有限的，我们的选择才有意义。如果我们拥有无限的时间，任何选择都将变得无关紧要。有限性不是生命的缺陷，而是使生命获得意义和价值的必要条件。",
    conceptId: "finitude",
    dimensionId: "ontology",
    topicId: "life-transience",
    author: "用户B",
    support: 65,
    createdAt: new Date("2025-04-24"),
    position: { x: 0.4, y: 0.6, z: 0.5 },
    scores: {
      embraceScore: 0.5,
      individualityScore: 0.4,
      rationalityScore: 0.8,
      practicalityScore: 0.3
    }
  },
  {
    id: "opinion-3",
    title: "超然接受能让人体验生命的美",
    content: "当我们超然地接受生命的短暂性，不再执着于延长或充实它，反而能够以一种审美的态度欣赏生命的流转。这种态度使我们能够看到生命中转瞬即逝的美，就像欣赏一首音乐或一场日落。",
    conceptId: "ataraxia",
    dimensionId: "aesthetics",
    topicId: "life-transience",
    author: "用户C",
    support: 42,
    createdAt: new Date("2025-04-23"),
    position: { x: 0.2, y: 0.7, z: 0.6 },
    scores: {
      embraceScore: 0.2,
      individualityScore: 0.3,
      rationalityScore: 0.6,
      practicalityScore: 0.4
    }
  },
  {
    id: "opinion-4",
    title: "生命短暂正因其不可重复而宝贵",
    content: "如果尼采的永恒轮回是真的，我们会如何看待自己的生活？正是因为生命不会重复，每一刻都是独特的，这使得我们的选择和体验具有无可替代的价值。",
    conceptId: "eternal_return",
    dimensionId: "metaphysics",
    topicId: "life-transience",
    author: "用户D",
    support: 53,
    createdAt: new Date("2025-04-22"),
    position: { x: 0.5, y: 0.4, z: 0.8 },
    scores: {
      embraceScore: 0.7,
      individualityScore: 0.6,
      rationalityScore: 0.7,
      practicalityScore: 0.5
    }
  },
  {
    id: "opinion-5",
    title: "对死亡的认识塑造了我们的生活态度",
    content: "我们如何理解死亡，决定了我们如何生活。死亡不仅是生物学事实，更是一种认识论视角，它为我们提供了评估生命价值和意义的框架。海德格尔认为，正是死亡的可能性让我们能够过上本真的生活。",
    conceptId: "knowledge",
    dimensionId: "epistemology",
    topicId: "life-transience",
    author: "用户E",
    support: 47,
    createdAt: new Date("2025-04-21"),
    position: { x: 0.6, y: 0.2, z: 0.4 },
    scores: {
      embraceScore: 0.4,
      individualityScore: 0.5,
      rationalityScore: 0.9,
      practicalityScore: 0.6
    }
  }
];

// 所有观点的集合（可以根据需要扩展其他议题的观点）
export const ALL_OPINIONS: PhilosophicalOpinion[] = [
  ...LIFE_TRANSIENCE_OPINIONS
];
