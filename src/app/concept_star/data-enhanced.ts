import { PhilosophicalConcept, PhilosophicalDimension } from './types-enhanced';
import { LIFE_TRANSIENCE_TOPIC } from './data-topics';

// 扩展的哲学维度
export const PHILOSOPHICAL_DIMENSIONS: PhilosophicalDimension[] = [
  {
    id: "ontology",
    name: "本体论",
    question: "存在的本质是什么？",
    description: "关注存在本身的性质、结构和基本范畴",
    color: "#4A6FE3", // 蓝色
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id]
  },
  {
    id: "epistemology",
    name: "认识论",
    question: "我们如何获取关于存在的知识？",
    description: "探讨知识的本质、来源、范围和限制",
    color: "#9F58B5", // 紫色
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id]
  },
  {
    id: "ethics",
    name: "伦理学",
    question: "我们应当如何行动？",
    description: "研究道德行为和价值判断的原则",
    color: "#E35D6A", // 红色
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id]
  },
  {
    id: "aesthetics",
    name: "美学",
    question: "美和艺术的本质是什么？",
    description: "探讨审美体验和艺术创造的原理",
    color: "#47C1BF", // 青色
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id]
  },
  {
    id: "metaphysics",
    name: "形而上学",
    question: "超越物理现象的实在是什么？",
    description: "研究超越经验的终极实在和存在的根本原理",
    color: "#F7D154", // 黄色
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id]
  },
  {
    id: "logic",
    name: "逻辑学",
    question: "什么构成有效的推理？",
    description: "研究有效推理的形式原则和方法",
    color: "#62BD7A", // 绿色
    relatedTopics: []
  },
  {
    id: "phenomenology",
    name: "现象学",
    question: "意识经验的结构是什么？",
    description: "研究意识经验的本质结构和意义构成",
    color: "#E39C4A", // 橙色
    relatedTopics: []
  },
  {
    id: "existentialism",
    name: "存在主义",
    question: "个体存在的意义是什么？",
    description: "关注个体存在的独特性、自由和责任",
    color: "#D14B7A", // 深红色
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id]
  },
];

// 哲学概念数据
export const PHILOSOPHICAL_CONCEPTS: PhilosophicalConcept[] = [
  // 本体论概念
  {
    id: "being",
    name: "存在",
    description: "一切存在物的基本状态，是与'无'相对的概念",
    dimension: "ontology",
    relatedConcepts: ["becoming", "substance", "essence"],
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id],
    philosophers: ["巴门尼德", "海德格尔", "萨特"],
    position: { x: 0.2, y: 0.3, z: 0.1 },
    size: 0.9,
    quote: "存在先于本质。 - 萨特",
    schools: ["存在主义", "现象学"],
    era: "古希腊至现代",
  },
  {
    id: "becoming",
    name: "生成",
    description: "存在的动态过程，强调变化而非静态存在",
    dimension: "ontology",
    relatedConcepts: ["being", "time", "process"],
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id],
    philosophers: ["赫拉克利特", "黑格尔", "柏格森"],
    position: { x: 0.3, y: 0.4, z: 0.2 },
    size: 0.8,
    quote: "人不能两次踏入同一条河流。 - 赫拉克利特",
    schools: ["辩证法", "过程哲学"],
    era: "古希腊至现代",
  },
  {
    id: "substance",
    name: "实体",
    description: "独立存在的基本实在，是属性的承载者",
    dimension: "ontology",
    relatedConcepts: ["being", "essence", "attribute"],
    relatedTopics: [],
    philosophers: ["亚里士多德", "笛卡尔", "斯宾诺莎"],
    position: { x: 0.1, y: 0.2, z: 0.3 },
    size: 0.85,
    quote: "实体是自因的，即其本质包含存在。 - 斯宾诺莎",
    schools: ["唯理论", "实体形而上学"],
    era: "古希腊至近代",
  },
  
  // 认识论概念
  {
    id: "knowledge",
    name: "知识",
    description: "被证明为真的信念，关于认识论的核心概念",
    dimension: "epistemology",
    relatedConcepts: ["truth", "belief", "justification"],
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id],
    philosophers: ["柏拉图", "洛克", "康德"],
    position: { x: 0.6, y: 0.2, z: 0.1 },
    size: 0.95,
    quote: "知识是被证明为真的信念。 - 柏拉图",
    schools: ["理性主义", "经验主义"],
    era: "古希腊至现代",
  },
  {
    id: "truth",
    name: "真理",
    description: "与现实相符合的陈述或命题",
    dimension: "epistemology",
    relatedConcepts: ["knowledge", "correspondence", "coherence"],
    relatedTopics: [],
    philosophers: ["亚里士多德", "塔尔斯基", "詹姆斯"],
    position: { x: 0.7, y: 0.3, z: 0.2 },
    size: 0.9,
    quote: "说一个事物是的，如果它是的；说一个事物不是，如果它不是的，就是说真话。 - 亚里士多德",
    schools: ["分析哲学", "实用主义"],
    era: "古希腊至现代",
  },
  {
    id: "a_priori",
    name: "先验知识",
    description: "独立于经验的知识，通过纯粹理性获得",
    dimension: "epistemology",
    relatedConcepts: ["a_posteriori", "rationalism", "intuition"],
    relatedTopics: [],
    philosophers: ["笛卡尔", "莱布尼茨", "康德"],
    position: { x: 0.8, y: 0.1, z: 0.3 },
    size: 0.75,
    quote: "先验知识是独立于一切经验之前的知识。 - 康德",
    schools: ["理性主义", "先验哲学"],
    era: "近代至现代",
  },
  
  // 伦理学概念
  {
    id: "good",
    name: "善",
    description: "道德价值的核心概念，指向应当追求的目标",
    dimension: "ethics",
    relatedConcepts: ["virtue", "duty", "happiness"],
    relatedTopics: [],
    philosophers: ["柏拉图", "亚里士多德", "摩尔"],
    position: { x: 0.3, y: 0.7, z: 0.1 },
    size: 0.9,
    quote: "善是一切事物所追求的。 - 亚里士多德",
    schools: ["德性伦理学", "功利主义"],
    era: "古希腊至现代",
  },
  {
    id: "duty",
    name: "义务",
    description: "道德行为的必要性，基于理性的道德要求",
    dimension: "ethics",
    relatedConcepts: ["categorical_imperative", "responsibility", "good"],
    relatedTopics: [],
    philosophers: ["康德", "罗斯", "普费弗"],
    position: { x: 0.2, y: 0.8, z: 0.2 },
    size: 0.8,
    quote: "行为的道德价值不在于行为的结果，而在于产生行为的意志的原则。 - 康德",
    schools: ["义务论", "康德主义"],
    era: "近代至现代",
  },
  {
    id: "happiness",
    name: "幸福",
    description: "人类行为的终极目标，完满的生活状态",
    dimension: "ethics",
    relatedConcepts: ["eudaimonia", "pleasure", "good"],
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id],
    philosophers: ["亚里士多德", "穆勒", "罗尔斯"],
    position: { x: 0.4, y: 0.9, z: 0.3 },
    size: 0.85,
    quote: "幸福是灵魂按照德性的活动。 - 亚里士多德",
    schools: ["功利主义", "德性伦理学"],
    era: "古希腊至现代",
  },
  
  // 美学概念
  {
    id: "beauty",
    name: "美",
    description: "引起审美愉悦的特质，艺术和自然的价值",
    dimension: "aesthetics",
    relatedConcepts: ["sublime", "taste", "art"],
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id],
    philosophers: ["柏拉图", "康德", "黑格尔"],
    position: { x: 0.7, y: 0.7, z: 0.1 },
    size: 0.85,
    quote: "美是真理的光辉。 - 柏拉图",
    schools: ["理想主义", "形式主义"],
    era: "古希腊至现代",
  },
  
  // 形而上学概念
  {
    id: "reality",
    name: "实在",
    description: "独立于意识的客观存在，终极的存在基础",
    dimension: "metaphysics",
    relatedConcepts: ["appearance", "noumenon", "being"],
    relatedTopics: [],
    philosophers: ["柏拉图", "康德", "黑格尔"],
    position: { x: 0.1, y: 0.5, z: 0.7 },
    size: 0.95,
    quote: "实在是理性的，理性是实在的。 - 黑格尔",
    schools: ["理想主义", "实在论"],
    era: "古希腊至现代",
  },
  {
    id: "time",
    name: "时间",
    description: "事件发生的维度，存在的基本结构",
    dimension: "metaphysics",
    relatedConcepts: ["space", "duration", "becoming"],
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id],
    philosophers: ["亚里士多德", "康德", "海德格尔"],
    position: { x: 0.2, y: 0.4, z: 0.8 },
    size: 0.9,
    quote: "时间是内在感官的形式。 - 康德",
    schools: ["现象学", "存在主义"],
    era: "古希腊至现代",
  },
  
  // 逻辑学概念
  {
    id: "contradiction",
    name: "矛盾律",
    description: "同一命题不能既真又假的逻辑原则",
    dimension: "logic",
    relatedConcepts: ["identity", "excluded_middle", "consistency"],
    relatedTopics: [],
    philosophers: ["亚里士多德", "莱布尼茨", "弗雷格"],
    position: { x: 0.8, y: 0.5, z: 0.7 },
    size: 0.8,
    quote: "同一事物不能在同一时间、同一关系上既是又不是。 - 亚里士多德",
    schools: ["形式逻辑", "分析哲学"],
    era: "古希腊至现代",
  },
  
  // 现象学概念
  {
    id: "intentionality",
    name: "意向性",
    description: "意识总是关于某物的特性",
    dimension: "phenomenology",
    relatedConcepts: ["consciousness", "noema", "reduction"],
    relatedTopics: [],
    philosophers: ["布伦塔诺", "胡塞尔", "梅洛-庞蒂"],
    position: { x: 0.5, y: 0.6, z: 0.5 },
    size: 0.75,
    quote: "意识总是关于某物的意识。 - 胡塞尔",
    schools: ["现象学", "存在主义"],
    era: "近代至现代",
  },
  
  // 存在主义概念
  {
    id: "freedom",
    name: "自由",
    description: "人类存在的基本特征，选择的能力和责任",
    dimension: "existentialism",
    relatedConcepts: ["responsibility", "authenticity", "choice"],
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id],
    philosophers: ["萨特", "海德格尔", "加缪"],
    position: { x: 0.4, y: 0.3, z: 0.6 },
    size: 0.85,
    quote: "人被判决为自由。 - 萨特",
    schools: ["存在主义", "人本主义"],
    era: "现代",
  },
  {
    id: "authenticity",
    name: "本真性",
    description: "符合自身本质的存在方式，对抗异化的状态",
    dimension: "existentialism",
    relatedConcepts: ["freedom", "bad_faith", "being"],
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id],
    philosophers: ["海德格尔", "萨特", "基尔凯郭尔"],
    position: { x: 0.5, y: 0.2, z: 0.7 },
    size: 0.8,
    quote: "本真的存在是向死亡的存在。 - 海德格尔",
    schools: ["存在主义", "现象学"],
    era: "现代",
  },
  
  // 生命哲学相关概念（针对当前话题）
  {
    id: "finitude",
    name: "有限性",
    description: "人类存在的时间限制，生命的短暂本质",
    dimension: "existentialism",
    relatedConcepts: ["death", "time", "being"],
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id],
    philosophers: ["海德格尔", "雅斯贝尔斯", "列维纳斯"],
    position: { x: 0.6, y: 0.4, z: 0.5 },
    size: 0.9,
    quote: "有限性是人类存在的基本结构。 - 海德格尔",
    schools: ["存在主义", "现象学"],
    era: "现代",
  },
  {
    id: "carpe_diem",
    name: "及时行乐",
    description: "把握当下的生活态度，源于对生命短暂性的认识",
    dimension: "ethics",
    relatedConcepts: ["hedonism", "pleasure", "present"],
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id],
    philosophers: ["伊壁鸠鲁", "霍拉斯", "尼采"],
    position: { x: 0.5, y: 0.8, z: 0.4 },
    size: 0.8,
    quote: "及时行乐，因为我们终将死去。 - 霍拉斯",
    schools: ["享乐主义", "实用主义"],
    era: "古希腊至现代",
  },
  {
    id: "ataraxia",
    name: "心灵平静",
    description: "斯多葛派追求的无扰动心灵状态，面对生命短暂的超然态度",
    dimension: "ethics",
    relatedConcepts: ["apatheia", "stoicism", "acceptance"],
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id],
    philosophers: ["埃皮克提图", "塞内卡", "马可·奥勒留"],
    position: { x: 0.3, y: 0.6, z: 0.6 },
    size: 0.75,
    quote: "不要为无法控制的事物而烦恼。 - 埃皮克提图",
    schools: ["斯多葛主义", "怀疑主义"],
    era: "古希腊罗马",
  },
  {
    id: "absurd",
    name: "荒谬",
    description: "人类追求意义与世界无意义之间的矛盾",
    dimension: "existentialism",
    relatedConcepts: ["meaning", "suicide", "revolt"],
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id],
    philosophers: ["加缪", "萨特", "尼采"],
    position: { x: 0.7, y: 0.5, z: 0.3 },
    size: 0.85,
    quote: "荒谬是人类理性与世界不合理性之间的对抗。 - 加缪",
    schools: ["存在主义", "虚无主义"],
    era: "现代",
  },
  {
    id: "eternal_return",
    name: "永恒轮回",
    description: "尼采的思想实验，假设生命将无限重复",
    dimension: "metaphysics",
    relatedConcepts: ["amor_fati", "will_to_power", "time"],
    relatedTopics: [LIFE_TRANSIENCE_TOPIC.id],
    philosophers: ["尼采", "德勒兹", "古希腊哲学家"],
    position: { x: 0.4, y: 0.5, z: 0.8 },
    size: 0.8,
    quote: "如果这生命将无限重复，你会如何活？ - 尼采",
    schools: ["存在主义", "生命哲学"],
    era: "现代",
  },
];

// 生命短暂性话题的核心概念
export const CORE_LIFE_CONCEPTS = [
  "finitude",    // 有限性
  "carpe_diem",  // 及时行乐
  "ataraxia",    // 心灵平静
  "absurd",      // 荒谬
  "freedom",     // 自由
  "authenticity", // 本真性
  "time",        // 时间
  "being",       // 存在
  "becoming",    // 生成
  "eternal_return" // 永恒轮回
];
