"use client";

import { useState, useEffect } from "react";
import { 
  PHILOSOPHICAL_DIMENSIONS, 
  PHILOSOPHICAL_CONCEPTS 
} from "./data-enhanced";
import { 
  ALL_TOPICS, 
  LIFE_TRANSIENCE_TOPIC, 
  ALL_OPINIONS 
} from "./data-topics";
import dynamic from "next/dynamic";
import { PhilosophicalOpinion } from "./types-enhanced";

// 动态导入组件，避免 SSR 问题
const DynamicTopicPanel = dynamic(
  () => import("./components/TopicPanel"),
  { ssr: false }
);

const DynamicConceptStarMap3D = dynamic(
  () => import("./components/ConceptStarMap3D"),
  { ssr: false }
);

const DynamicOpinionForm = dynamic(
  () => import("./components/OpinionForm"),
  { ssr: false }
);

const DynamicOpinionDetail = dynamic(
  () => import("./components/OpinionDetail"),
  { ssr: false }
);

const DynamicConceptDetail = dynamic(
  () => import("./components/ConceptDetail"),
  { ssr: false }
);

export default function ConceptStarPage() {
  // 状态管理
  const [selectedTopic, setSelectedTopic] = useState<string>(LIFE_TRANSIENCE_TOPIC.id);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [selectedOpinion, setSelectedOpinion] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [opinions, setOpinions] = useState<PhilosophicalOpinion[]>(ALL_OPINIONS);
  const [isClient, setIsClient] = useState(false);
  
  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // 获取当前选中的议题
  const currentTopic = ALL_TOPICS.find(t => t.id === selectedTopic) || LIFE_TRANSIENCE_TOPIC;
  
  // 获取当前选中的概念
  const currentConcept = selectedConcept 
    ? PHILOSOPHICAL_CONCEPTS.find(c => c.id === selectedConcept) 
    : null;
  
  // 获取当前选中的观点
  const currentOpinion = selectedOpinion 
    ? opinions.find(o => o.id === selectedOpinion) 
    : null;
  
  // 获取当前选中观点的相关概念和维度
  const opinionConcept = currentOpinion 
    ? PHILOSOPHICAL_CONCEPTS.find(c => c.id === currentOpinion.conceptId) 
    : null;
  
  const opinionDimension = currentOpinion 
    ? PHILOSOPHICAL_DIMENSIONS.find(d => d.id === currentOpinion.dimensionId) 
    : null;
  
  // 处理观点提交
  const handleOpinionSubmit = (newOpinion: Omit<PhilosophicalOpinion, 'id' | 'support' | 'createdAt' | 'position'>) => {
    const opinionToAdd: PhilosophicalOpinion = {
      ...newOpinion,
      id: `opinion-${Date.now()}`,
      support: 1,
      createdAt: new Date(),
      position: {
        x: 0.3 + Math.random() * 0.4,
        y: 0.3 + Math.random() * 0.4,
        z: 0.3 + Math.random() * 0.4
      }
    };
    
    setOpinions(prev => [...prev, opinionToAdd]);
  };
  
  // 处理相关观点选择
  const handleRelatedOpinionSelect = (opinionId: string) => {
    setSelectedOpinion(opinionId);
  };
  
  // 处理议题选择
  const handleSelectTopic = (topicId: string | null) => {
    if (topicId) {
      setSelectedTopic(topicId);
    }
  };
  
  // 如果在服务器端或客户端尚未初始化，显示加载状态
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">共识星图 - 打造人与人相互理解的宇宙</h1>
          <p className="text-gray-400 text-center max-w-3xl mx-auto">
            探索本质的维度、概念与观点之间的关联，理解不同视角下的思考方式，促进深度互相理解。
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧面板 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 议题和维度选择面板 */}
            <DynamicTopicPanel
              topics={ALL_TOPICS}
              selectedTopic={selectedTopic}
              selectedDimension={selectedDimension}
              onSelectTopic={handleSelectTopic}
              onSelectDimension={setSelectedDimension}
            />
            
            {/* 观点提交表单 */}
            <DynamicOpinionForm
              topic={currentTopic}
              dimensions={PHILOSOPHICAL_DIMENSIONS}
              concepts={PHILOSOPHICAL_CONCEPTS}
              selectedDimension={selectedDimension}
              selectedConcept={selectedConcept}
              onSubmit={handleOpinionSubmit}
            />
            
            {/* 显示控制 */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-3">显示设置</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">显示概念标签</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={showLabels}
                      onChange={() => setShowLabels(!showLabels)}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* 中央星图 */}
          <div className="lg:col-span-3 bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden" style={{ height: '70vh' }}>
            <DynamicConceptStarMap3D
              concepts={PHILOSOPHICAL_CONCEPTS}
              dimensions={PHILOSOPHICAL_DIMENSIONS}
              opinions={opinions}
              currentTopic={currentTopic}
              selectedDimension={selectedDimension}
              selectedConcept={selectedConcept}
              selectedOpinion={selectedOpinion}
              onSelectConcept={setSelectedConcept}
              onSelectOpinion={setSelectedOpinion}
              showLabels={showLabels}
            />
          </div>
        </div>
        
        {/* 概念详情弹窗 */}
        {selectedConcept && currentConcept && (
          <DynamicConceptDetail
            concept={currentConcept}
            allConcepts={PHILOSOPHICAL_CONCEPTS}
            dimensions={PHILOSOPHICAL_DIMENSIONS}
            opinions={opinions.filter(o => o.conceptId === selectedConcept)}
            onClose={() => setSelectedConcept(null)}
            onSelectConcept={setSelectedConcept}
          />
        )}
        
        {/* 观点详情弹窗 */}
        {selectedOpinion && currentOpinion && opinionConcept && opinionDimension && (
          <DynamicOpinionDetail
            opinion={currentOpinion}
            concept={opinionConcept}
            dimension={opinionDimension}
            relatedOpinions={opinions.filter(o => 
              o.id !== currentOpinion.id && 
              (o.conceptId === currentOpinion.conceptId || o.dimensionId === currentOpinion.dimensionId)
            )}
            onClose={() => setSelectedOpinion(null)}
            onSelectRelatedOpinion={handleRelatedOpinionSelect}
          />
        )}
      </div>
    </main>
  );
}
