/**
 * 四层结构（议题-维度-概念-观点）测试用例
 * 
 * 这个文件包含用于测试共识星图四层结构功能的测试用例
 */

import { 
  PHILOSOPHICAL_DIMENSIONS, 
  PHILOSOPHICAL_CONCEPTS 
} from '../data-enhanced';
import { 
  ALL_TOPICS, 
  LIFE_TRANSIENCE_TOPIC, 
  ALL_OPINIONS 
} from '../data-topics';
import { 
  PhilosophicalTopic, 
  PhilosophicalDimension, 
  PhilosophicalConcept, 
  PhilosophicalOpinion 
} from '../types-enhanced';

describe('四层结构数据模型测试', () => {
  // 测试议题数据
  test('议题数据应包含必要字段和关联维度', () => {
    const topic = LIFE_TRANSIENCE_TOPIC;
    
    // 验证必要字段
    expect(topic.id).toBeDefined();
    expect(topic.title).toBeDefined();
    expect(topic.question).toBeDefined();
    expect(topic.dimensions).toBeDefined();
    
    // 验证维度关联
    expect(topic.dimensions.length).toBeGreaterThan(0);
    topic.dimensions.forEach(dimensionId => {
      const dimension = PHILOSOPHICAL_DIMENSIONS.find(d => d.id === dimensionId);
      expect(dimension).toBeDefined();
    });
  });
  
  // 测试维度数据
  test('维度数据应包含必要字段和关联议题', () => {
    PHILOSOPHICAL_DIMENSIONS.forEach(dimension => {
      // 验证必要字段
      expect(dimension.id).toBeDefined();
      expect(dimension.name).toBeDefined();
      expect(dimension.question).toBeDefined();
      expect(dimension.color).toBeDefined();
      
      // 验证议题关联（如果有）
      if (dimension.relatedTopics) {
        dimension.relatedTopics.forEach(topicId => {
          const topic = ALL_TOPICS.find(t => t.id === topicId);
          expect(topic).toBeDefined();
        });
      }
    });
  });
  
  // 测试概念数据
  test('概念数据应包含必要字段和关联维度', () => {
    PHILOSOPHICAL_CONCEPTS.forEach(concept => {
      // 验证必要字段
      expect(concept.id).toBeDefined();
      expect(concept.name).toBeDefined();
      expect(concept.description).toBeDefined();
      expect(concept.dimension).toBeDefined();
      expect(concept.position).toBeDefined();
      
      // 验证维度关联
      const dimension = PHILOSOPHICAL_DIMENSIONS.find(d => d.id === concept.dimension);
      expect(dimension).toBeDefined();
      
      // 验证议题关联（如果有）
      if (concept.relatedTopics) {
        concept.relatedTopics.forEach(topicId => {
          const topic = ALL_TOPICS.find(t => t.id === topicId);
          expect(topic).toBeDefined();
        });
      }
      
      // 验证相关概念
      concept.relatedConcepts.forEach(relatedId => {
        const relatedConcept = PHILOSOPHICAL_CONCEPTS.find(c => c.id === relatedId);
        expect(relatedConcept).toBeDefined();
      });
    });
  });
  
  // 测试观点数据
  test('观点数据应包含必要字段和关联概念、维度、议题', () => {
    ALL_OPINIONS.forEach(opinion => {
      // 验证必要字段
      expect(opinion.id).toBeDefined();
      expect(opinion.title).toBeDefined();
      expect(opinion.content).toBeDefined();
      expect(opinion.conceptId).toBeDefined();
      expect(opinion.dimensionId).toBeDefined();
      expect(opinion.topicId).toBeDefined();
      expect(opinion.scores).toBeDefined();
      
      // 验证概念关联
      const concept = PHILOSOPHICAL_CONCEPTS.find(c => c.id === opinion.conceptId);
      expect(concept).toBeDefined();
      
      // 验证维度关联
      const dimension = PHILOSOPHICAL_DIMENSIONS.find(d => d.id === opinion.dimensionId);
      expect(dimension).toBeDefined();
      
      // 验证议题关联
      const topic = ALL_TOPICS.find(t => t.id === opinion.topicId);
      expect(topic).toBeDefined();
      
      // 验证评分字段
      expect(opinion.scores.embraceScore).toBeDefined();
    });
  });
});

describe('四层结构关系测试', () => {
  test('议题应与正确的维度关联', () => {
    const topic = LIFE_TRANSIENCE_TOPIC;
    const topicDimensions = PHILOSOPHICAL_DIMENSIONS.filter(d => 
      topic.dimensions.includes(d.id)
    );
    
    // 验证议题关联了正确数量的维度
    expect(topicDimensions.length).toBe(topic.dimensions.length);
    
    // 验证每个维度都关联回议题
    topicDimensions.forEach(dimension => {
      expect(dimension.relatedTopics).toBeDefined();
      if (dimension.relatedTopics) {
        expect(dimension.relatedTopics.includes(topic.id)).toBe(true);
      }
    });
  });
  
  test('维度应包含与议题相关的概念', () => {
    const topic = LIFE_TRANSIENCE_TOPIC;
    
    topic.dimensions.forEach(dimensionId => {
      const dimensionConcepts = PHILOSOPHICAL_CONCEPTS.filter(c => 
        c.dimension === dimensionId && 
        c.relatedTopics?.includes(topic.id)
      );
      
      // 验证每个维度至少有一个与议题相关的概念
      expect(dimensionConcepts.length).toBeGreaterThan(0);
    });
  });
  
  test('观点应正确关联到概念、维度和议题', () => {
    ALL_OPINIONS.forEach(opinion => {
      // 获取关联的概念
      const concept = PHILOSOPHICAL_CONCEPTS.find(c => c.id === opinion.conceptId);
      expect(concept).toBeDefined();
      
      // 验证概念的维度与观点的维度一致
      expect(concept?.dimension).toBe(opinion.dimensionId);
      
      // 验证概念关联的议题包含观点的议题
      expect(concept?.relatedTopics?.includes(opinion.topicId)).toBe(true);
    });
  });
  
  test('生命短暂性议题应有覆盖多个维度的观点', () => {
    const topicId = LIFE_TRANSIENCE_TOPIC.id;
    const topicOpinions = ALL_OPINIONS.filter(o => o.topicId === topicId);
    
    // 获取这些观点涉及的维度
    const opinionDimensions = [...new Set(topicOpinions.map(o => o.dimensionId))];
    
    // 验证观点覆盖了多个维度
    expect(opinionDimensions.length).toBeGreaterThan(1);
    
    // 验证这些维度都是议题关联的维度
    opinionDimensions.forEach(dimensionId => {
      expect(LIFE_TRANSIENCE_TOPIC.dimensions.includes(dimensionId)).toBe(true);
    });
  });
});

// 模拟用户交互测试
describe('用户交互流程测试', () => {
  test('模拟用户选择议题、维度、概念和查看观点的流程', () => {
    // 步骤1: 用户选择议题
    const selectedTopic = LIFE_TRANSIENCE_TOPIC;
    expect(selectedTopic).toBeDefined();
    
    // 步骤2: 用户选择维度
    const selectedDimensionId = "ethics"; // 伦理学维度
    const selectedDimension = PHILOSOPHICAL_DIMENSIONS.find(d => d.id === selectedDimensionId);
    expect(selectedDimension).toBeDefined();
    expect(selectedTopic.dimensions.includes(selectedDimensionId)).toBe(true);
    
    // 步骤3: 用户查看该维度下的概念
    const dimensionConcepts = PHILOSOPHICAL_CONCEPTS.filter(c => 
      c.dimension === selectedDimensionId && 
      c.relatedTopics?.includes(selectedTopic.id)
    );
    expect(dimensionConcepts.length).toBeGreaterThan(0);
    
    // 步骤4: 用户选择一个概念
    const selectedConcept = dimensionConcepts[0];
    expect(selectedConcept).toBeDefined();
    
    // 步骤5: 用户查看该概念下的观点
    const conceptOpinions = ALL_OPINIONS.filter(o => 
      o.conceptId === selectedConcept.id && 
      o.dimensionId === selectedDimensionId && 
      o.topicId === selectedTopic.id
    );
    
    // 验证是否有相关观点
    if (conceptOpinions.length > 0) {
      const selectedOpinion = conceptOpinions[0];
      expect(selectedOpinion).toBeDefined();
      expect(selectedOpinion.conceptId).toBe(selectedConcept.id);
      expect(selectedOpinion.dimensionId).toBe(selectedDimensionId);
      expect(selectedOpinion.topicId).toBe(selectedTopic.id);
    }
    
    // 步骤6: 模拟用户添加新观点
    const newOpinion: Omit<PhilosophicalOpinion, 'id' | 'support' | 'createdAt' | 'position'> = {
      title: "测试观点标题",
      content: "这是一个测试观点内容，用于验证四层结构的功能。",
      conceptId: selectedConcept.id,
      dimensionId: selectedDimensionId,
      topicId: selectedTopic.id,
      author: "测试用户",
      scores: {
        embraceScore: 0.7,
        individualityScore: 0.4,
        rationalityScore: 0.6
      }
    };
    
    // 验证新观点的数据结构是否正确
    expect(newOpinion.title).toBeDefined();
    expect(newOpinion.content).toBeDefined();
    expect(newOpinion.conceptId).toBe(selectedConcept.id);
    expect(newOpinion.dimensionId).toBe(selectedDimensionId);
    expect(newOpinion.topicId).toBe(selectedTopic.id);
    expect(newOpinion.scores.embraceScore).toBeDefined();
  });
});
