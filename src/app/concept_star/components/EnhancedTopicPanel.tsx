"use client";

import { useState } from "react";
import { PhilosophicalTopic, PhilosophicalDimension } from "../types-enhanced";
import { PHILOSOPHICAL_DIMENSIONS } from "../data-enhanced";

interface EnhancedTopicPanelProps {
  topics: PhilosophicalTopic[];
  selectedTopic: string | null;
  selectedDimension: string | null;
  onSelectTopic: (topicId: string | null) => void;
  onSelectDimension: (dimensionId: string | null) => void;
}

const EnhancedTopicPanel: React.FC<EnhancedTopicPanelProps> = ({
  topics,
  selectedTopic,
  selectedDimension,
  onSelectTopic,
  onSelectDimension,
}) => {
  const [showAllTopics, setShowAllTopics] = useState(false);
  
  // 获取当前选中的议题
  const currentTopic = selectedTopic 
    ? topics.find(t => t.id === selectedTopic) 
    : topics[0];
  
  // 获取当前议题相关的维度
  const relevantDimensions = currentTopic
    ? PHILOSOPHICAL_DIMENSIONS.filter(d => 
        currentTopic.dimensions.includes(d.id)
      )
    : [];
  
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg">
      {/* 议题选择区域 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">话题</h2>
          <button 
            className="text-sm text-indigo-400 hover:text-indigo-300"
            onClick={() => setShowAllTopics(!showAllTopics)}
          >
            {showAllTopics ? "收起" : "查看全部"}
          </button>
        </div>
        
        {showAllTopics ? (
          <div className="space-y-3 mb-4">
            {topics.map(topic => (
              <div 
                key={topic.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedTopic === topic.id 
                    ? "bg-indigo-900 border-l-4 border-indigo-500" 
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => onSelectTopic(topic.id)}
              >
                <h3 className="font-medium text-white">{topic.title}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{topic.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-white">{currentTopic?.title}</h3>
            <p className="text-gray-300 text-sm mt-2">{currentTopic?.description}</p>
            <div className="mt-3 p-3 bg-gray-700 rounded-lg">
              <p className="text-white font-medium">{currentTopic?.question}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* 维度选择区域 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">哲学维度</h3>
        <p className="text-gray-400 text-sm">
          选择一个哲学维度来探索相关的核心概念，或查看所有维度的概念星图。
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              selectedDimension === null
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => onSelectDimension(null)}
          >
            全部维度
          </button>
          
          {relevantDimensions.map((dimension) => (
            <button
              key={dimension.id}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedDimension === dimension.id
                  ? "text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              style={{
                backgroundColor: selectedDimension === dimension.id ? dimension.color : undefined,
              }}
              onClick={() => onSelectDimension(dimension.id)}
            >
              {dimension.name}
            </button>
          ))}
        </div>
        
        {selectedDimension && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-indigo-400 mb-2">
              {relevantDimensions.find(d => d.id === selectedDimension)?.name}
            </h4>
            <p className="text-white font-medium mb-2">
              {relevantDimensions.find(d => d.id === selectedDimension)?.question}
            </p>
            <p className="text-gray-400 text-sm">
              {relevantDimensions.find(d => d.id === selectedDimension)?.description}
            </p>
          </div>
        )}
      </div>
      
      {/* 四层结构说明 */}
      <div className="mt-8 border-t border-gray-700 pt-4">
        <h3 className="text-lg font-semibold text-white mb-3">共识星图层次结构</h3>
        <ul className="space-y-3 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs mt-0.5">1</span>
            <div>
              <span className="text-white font-medium">议题</span>
              <p className="text-gray-400 mt-1">探讨的核心问题，如"生命的短暂本质"</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs mt-0.5">2</span>
            <div>
              <span className="text-white font-medium">哲学维度</span>
              <p className="text-gray-400 mt-1">思考议题的不同角度，如伦理学、存在论等</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs mt-0.5">3</span>
            <div>
              <span className="text-white font-medium">核心概念</span>
              <p className="text-gray-400 mt-1">维度下的关键哲学概念，如"有限性"、"自由"等</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs mt-0.5">4</span>
            <div>
              <span className="text-white font-medium">具体观点</span>
              <p className="text-gray-400 mt-1">用户对概念的具体看法，如"及时行乐是对生命短暂最好的回应"</p>
            </div>
          </li>
        </ul>
      </div>
      
      {/* 星图指南 */}
      <div className="mt-6 border-t border-gray-700 pt-4">
        <h3 className="text-lg font-semibold text-white mb-3">星图指南</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          {relevantDimensions.slice(0, 3).map(dimension => (
            <li key={dimension.id} className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: dimension.color }}
              ></span>
              <span>{dimension.name} - {dimension.question}</span>
            </li>
          ))}
          <li className="flex items-center gap-2">
            <span className="w-5 h-3 rounded-full bg-white opacity-30"></span>
            <span>星点大小 - 概念的重要性和关联度</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EnhancedTopicPanel;
