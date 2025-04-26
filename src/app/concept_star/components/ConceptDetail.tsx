"use client";

import { useState } from "react";
import { PhilosophicalConcept, PhilosophicalDimension, ConceptDetailProps } from "../types-enhanced";

const ConceptDetail: React.FC<ConceptDetailProps> = ({
  concept,
  allConcepts,
  dimensions,
  onClose,
  onSelectConcept
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "connections" | "quotes">("overview");
  
  if (!concept) return null;
  
  // 获取当前概念所属的维度
  const dimension = dimensions.find(d => d.id === concept.dimension);
  
  // 获取相关概念的详细信息
  const relatedConceptsData = concept.relatedConcepts
    .map(id => allConcepts.find(c => c.id === id))
    .filter(c => c !== undefined) as PhilosophicalConcept[];
  
  // 获取与该概念相关的哲学家
  const philosophers = concept.philosophers;
  
  // 获取与该概念相关的学派
  const schools = concept.schools;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span 
                  className="inline-block w-4 h-4 rounded-full" 
                  style={{ backgroundColor: dimension?.color || "#ffffff" }}
                ></span>
                {concept.name}
              </h2>
              <p className="text-gray-400 mt-1">{dimension?.name} · {concept.era}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* 标签页导航 */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "overview" 
                  ? "text-indigo-400 border-b-2 border-indigo-400" 
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              概述
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "connections" 
                  ? "text-indigo-400 border-b-2 border-indigo-400" 
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("connections")}
            >
              关联概念
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "quotes" 
                  ? "text-indigo-400 border-b-2 border-indigo-400" 
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("quotes")}
            >
              名言与思想
            </button>
          </div>
          
          {/* 概述标签页 */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">概念描述</h3>
                <p className="text-gray-300 leading-relaxed">{concept.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">相关哲学家</h3>
                  <ul className="space-y-2">
                    {philosophers.map((philosopher, index) => (
                      <li key={index} className="text-gray-300">
                        {philosopher}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">哲学流派</h3>
                  <div className="flex flex-wrap gap-2">
                    {schools.map((school, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                      >
                        {school}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-2">维度背景</h3>
                <p className="text-gray-300 mb-2">{dimension?.question}</p>
                <p className="text-gray-400 text-sm">{dimension?.description}</p>
              </div>
            </div>
          )}
          
          {/* 关联概念标签页 */}
          {activeTab === "connections" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white mb-2">关联概念</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedConceptsData.map((relatedConcept) => {
                  const relatedDimension = dimensions.find(d => d.id === relatedConcept.dimension);
                  
                  return (
                    <div 
                      key={relatedConcept.id}
                      className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => onSelectConcept(relatedConcept.id)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span 
                          className="inline-block w-3 h-3 rounded-full" 
                          style={{ backgroundColor: relatedDimension?.color || "#ffffff" }}
                        ></span>
                        <h4 className="text-white font-medium">{relatedConcept.name}</h4>
                      </div>
                      <p className="text-gray-400 text-sm">{relatedConcept.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* 名言与思想标签页 */}
          {activeTab === "quotes" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <blockquote className="text-xl text-gray-300 italic mb-4">
                  "{concept.quote}"
                </blockquote>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">核心思想</h3>
                <p className="text-gray-300 leading-relaxed">
                  {concept.name === "存在" && "存在是哲学中最基本的概念之一，指事物的实在性或'在场'。海德格尔将存在视为哲学的核心问题，区分了存在者(具体事物)和存在本身。存在主义强调人的存在先于本质，人通过自由选择定义自己。"}
                  {concept.name === "生成" && "生成概念强调变化的永恒性，与静态存在形成对比。赫拉克利特认为'万物流变'，黑格尔则将生成视为辩证法的核心环节，是存在与无的综合。生成思想挑战了传统形而上学对永恒不变实体的追求。"}
                  {concept.name === "有限性" && "有限性是人类存在的根本特征，指向生命的短暂和人类能力的局限。海德格尔认为，正是通过理解自身的有限性，人才能获得本真的存在方式。有限性不仅是一种限制，也是人类存在的可能性条件。"}
                  {concept.name === "自由" && "自由在存在主义中被视为人类的根本特征和负担。萨特认为'人被判决为自由'，意味着我们必须不断做出选择，并为这些选择负责。自由不是一种获得，而是一种无法逃避的存在状态。"}
                  {concept.name === "时间" && "时间不仅是物理现象，更是人类存在的基本结构。海德格尔将时间性视为此在(人的存在)的本质特征，认为过去、现在和未来不是孤立的时间点，而是相互交织的存在维度。"}
                  {concept.name === "及时行乐" && "及时行乐(Carpe Diem)源于古罗马诗人霍拉斯的名言，强调把握当下的重要性。伊壁鸠鲁学派将其发展为一种生活哲学，主张适度的快乐是生活的目标，但这种快乐建立在理性和节制的基础上。"}
                  {concept.name === "心灵平静" && "心灵平静(Ataraxia)是斯多葛派和伊壁鸠鲁派共同追求的理想状态。斯多葛派认为，通过区分可控与不可控的事物，接受命运的必然性，人可以达到内心的平静。这种态度特别适用于面对生命短暂性的思考。"}
                  {concept.name === "荒谬" && "荒谬是加缪哲学的核心概念，指人类追求意义与世界本身无意义之间的矛盾。面对荒谬，加缪提出三种可能的回应：自杀、宗教信仰或接受荒谬并反抗。他主张第三种态度，在承认荒谬的同时坚持生活的热情。"}
                  {concept.name === "永恒轮回" && "永恒轮回是尼采提出的思想实验，假设一切事件将无限重复。这一概念旨在测试一个人对生活的态度：如果你的生活将永远重复，你会如何看待它？尼采认为，真正肯定生命的人会欣然接受这一假设。"}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">历史发展</h3>
                <p className="text-gray-300 leading-relaxed">
                  {concept.name === "存在" && "存在概念的探讨可追溯至古希腊哲学，巴门尼德区分了'是'与'不是'。中世纪托马斯·阿奎那讨论了存在与本质的关系。现代存在主义，特别是海德格尔和萨特，将存在问题重新置于哲学中心，强调人的存在的独特性。"}
                  {concept.name === "生成" && "生成概念始于赫拉克利特的'万物流变'思想，与巴门尼德的静态存在形成对立。亚里士多德试图调和这一对立，引入潜能和现实概念。近代哲学中，黑格尔的辩证法和柏格森的'创造性进化'进一步发展了生成思想。"}
                  {concept.name === "有限性" && "有限性的思考贯穿整个西方哲学史。古希腊悲剧强调人的有限与神的无限对比；基督教传统将有限性视为原罪的结果；康德讨论了人类认识能力的有限性；海德格尔和雅斯贝尔斯则将有限性视为人类存在的核心。"}
                  {concept.name === "自由" && "自由概念从古代的政治自由，发展到中世纪的意志自由，再到现代的存在自由。康德将自由视为道德的前提；黑格尔将自由理解为自我实现的过程；存在主义则强调自由的负担和责任。"}
                  {concept.name === "时间" && "时间概念从亚里士多德的物理时间，到奥古斯丁的心理时间，再到海德格尔的存在论时间，经历了深刻变化。现代物理学的相对论和量子力学进一步挑战了传统的线性时间观。"}
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-8 pt-4 border-t border-gray-700 flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
            >
              关闭
            </button>
            
            <div className="flex gap-2">
              {activeTab === "connections" && (
                <button
                  onClick={() => {
                    // 在星图中高亮显示所有关联概念
                    // 实际实现需要通过父组件状态
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  在星图中查看关联
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptDetail;
