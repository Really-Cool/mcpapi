"use client";

import { Topic } from "../types";

interface TopicPanelProps {
  topic: Topic;
  selectedDimension: string | null;
  onSelectDimension: (dimensionId: string | null) => void;
}

const TopicPanel: React.FC<TopicPanelProps> = ({
  topic,
  selectedDimension,
  onSelectDimension,
}) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">{topic.title}</h2>
      <p className="text-gray-300 mb-6">{topic.description}</p>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">讨论维度</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              selectedDimension === null
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => onSelectDimension(null)}
          >
            全部
          </button>
          
          {topic.dimensions.map((dimension) => (
            <button
              key={dimension.id}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedDimension === dimension.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => onSelectDimension(dimension.id)}
            >
              {dimension.name}
            </button>
          ))}
        </div>
        
        {selectedDimension && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-indigo-400 mb-2">
              {topic.dimensions.find(d => d.id === selectedDimension)?.name}
            </h4>
            <p className="text-white font-medium mb-2">
              {topic.dimensions.find(d => d.id === selectedDimension)?.question}
            </p>
            <p className="text-gray-400 text-sm">
              {topic.dimensions.find(d => d.id === selectedDimension)?.description}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-8 border-t border-gray-700 pt-4">
        <h3 className="text-lg font-semibold text-white mb-3">星图指南</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>蓝色星点 - 倾向"超然接受"的观点</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>绿色星点 - 整合或中立的观点</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>红色星点 - 倾向"热烈拥抱"的观点</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-3 rounded-full bg-white opacity-30"></span>
            <span>星点大小 - 支持该观点的人数</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TopicPanel;
