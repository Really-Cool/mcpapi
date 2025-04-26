"use client";

import { useState, useEffect } from "react";
import { 
  PhilosophicalTopic, 
  PhilosophicalDimension, 
  PhilosophicalConcept, 
  PhilosophicalOpinion 
} from "../types-enhanced";

interface EnhancedOpinionFormProps {
  topic: PhilosophicalTopic;
  dimensions: PhilosophicalDimension[];
  concepts: PhilosophicalConcept[];
  selectedDimension: string | null;
  selectedConcept: string | null;
  onSubmit: (opinion: Omit<PhilosophicalOpinion, 'id' | 'support' | 'createdAt' | 'position'>) => void;
}

const EnhancedOpinionForm: React.FC<EnhancedOpinionFormProps> = ({
  topic,
  dimensions,
  concepts,
  selectedDimension,
  selectedConcept,
  onSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dimensionId, setDimensionId] = useState(selectedDimension || "");
  const [conceptId, setConceptId] = useState(selectedConcept || "");
  const [embraceScore, setEmbraceScore] = useState(0.5);
  const [individualityScore, setIndividualityScore] = useState(0.5);
  const [rationalityScore, setRationalityScore] = useState(0.5);
  
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [dimensionError, setDimensionError] = useState("");
  const [conceptError, setConceptError] = useState("");

  // 当选中的维度或概念变化时，更新表单状态
  useEffect(() => {
    if (selectedDimension) {
      setDimensionId(selectedDimension);
    }
    if (selectedConcept) {
      setConceptId(selectedConcept);
    }
  }, [selectedDimension, selectedConcept]);

  // 根据选中的维度筛选相关概念
  const filteredConcepts = dimensionId
    ? concepts.filter(c => c.dimension === dimensionId && c.relatedTopics?.includes(topic.id))
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证
    let isValid = true;
    
    if (!title.trim()) {
      setTitleError("请输入观点标题");
      isValid = false;
    } else if (title.length > 50) {
      setTitleError("标题不能超过50个字符");
      isValid = false;
    } else {
      setTitleError("");
    }
    
    if (!content.trim()) {
      setContentError("请输入观点内容");
      isValid = false;
    } else if (content.length > 300) {
      setContentError("内容不能超过300个字符");
      isValid = false;
    } else {
      setContentError("");
    }
    
    if (!dimensionId) {
      setDimensionError("请选择哲学维度");
      isValid = false;
    } else {
      setDimensionError("");
    }
    
    if (!conceptId) {
      setConceptError("请选择相关概念");
      isValid = false;
    } else {
      setConceptError("");
    }
    
    if (isValid) {
      onSubmit({
        title,
        content,
        dimensionId,
        conceptId,
        topicId: topic.id,
        author: "当前用户",
        scores: {
          embraceScore,
          individualityScore,
          rationalityScore,
        }
      });
      
      // 重置表单
      setTitle("");
      setContent("");
      setEmbraceScore(0.5);
      setIndividualityScore(0.5);
      setRationalityScore(0.5);
      setIsOpen(false);
    }
  };

  return (
    <div className="mt-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
        >
          分享我的哲学观点
        </button>
      ) : (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">分享你的哲学观点</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="dimension" className="block text-sm font-medium text-gray-300 mb-1">
                选择哲学维度
              </label>
              <select
                id="dimension"
                value={dimensionId}
                onChange={(e) => {
                  setDimensionId(e.target.value);
                  setConceptId(""); // 重置概念选择
                }}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">-- 选择维度 --</option>
                {dimensions
                  .filter(dim => topic.dimensions.includes(dim.id))
                  .map((dim) => (
                    <option key={dim.id} value={dim.id}>
                      {dim.name}: {dim.question}
                    </option>
                  ))}
              </select>
              {dimensionError && <p className="mt-1 text-sm text-red-500">{dimensionError}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="concept" className="block text-sm font-medium text-gray-300 mb-1">
                选择相关概念
              </label>
              <select
                id="concept"
                value={conceptId}
                onChange={(e) => setConceptId(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!dimensionId}
                required
              >
                <option value="">-- 选择概念 --</option>
                {filteredConcepts.map((concept) => (
                  <option key={concept.id} value={concept.id}>
                    {concept.name}: {concept.description.substring(0, 30)}...
                  </option>
                ))}
              </select>
              {conceptError && <p className="mt-1 text-sm text-red-500">{conceptError}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                观点标题 <span className="text-gray-400">(简洁表达核心主张，50字以内)</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="例如：及时行乐是对生命短暂最好的回应"
                maxLength={50}
                required
              />
              {titleError && <p className="mt-1 text-sm text-red-500">{titleError}</p>}
              <div className="mt-1 text-right text-xs text-gray-400">
                {title.length}/50
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                观点阐述 <span className="text-gray-400">(详细说明你的理由，300字以内)</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请详细阐述你的观点和理由..."
                maxLength={300}
                required
              ></textarea>
              {contentError && <p className="mt-1 text-sm text-red-500">{contentError}</p>}
              <div className="mt-1 text-right text-xs text-gray-400">
                {content.length}/300
              </div>
            </div>
            
            <div className="mb-6 space-y-4">
              <h4 className="text-sm font-medium text-gray-300">观点立场</h4>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">超然接受</span>
                  <span className="text-sm text-gray-400">热烈拥抱</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={embraceScore}
                  onChange={(e) => setEmbraceScore(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">个体视角</span>
                  <span className="text-sm text-gray-400">集体视角</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={individualityScore}
                  onChange={(e) => setIndividualityScore(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">感性思考</span>
                  <span className="text-sm text-gray-400">理性思考</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={rationalityScore}
                  onChange={(e) => setRationalityScore(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-400">
                提交后，你的观点将显示在星图中
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
              >
                提交观点
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EnhancedOpinionForm;
