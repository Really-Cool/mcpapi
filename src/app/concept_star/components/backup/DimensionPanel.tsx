"use client";

import { PhilosophicalDimension, DimensionPanelProps } from "../types-enhanced";

const DimensionPanel: React.FC<DimensionPanelProps> = ({
  dimensions,
  selectedDimension,
  onSelectDimension,
}) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">哲学维度</h2>
      <p className="text-gray-300 mb-6">
        选择一个哲学维度来探索相关的核心概念，或查看所有维度的概念星图。
      </p>
      
      <div className="space-y-4">
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
          
          {dimensions.map((dimension) => (
            <button
              key={dimension.id}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedDimension === dimension.id
                  ? "bg-indigo-600 text-white"
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
              {dimensions.find(d => d.id === selectedDimension)?.name}
            </h4>
            <p className="text-white font-medium mb-2">
              {dimensions.find(d => d.id === selectedDimension)?.question}
            </p>
            <p className="text-gray-400 text-sm">
              {dimensions.find(d => d.id === selectedDimension)?.description}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-8 border-t border-gray-700 pt-4">
        <h3 className="text-lg font-semibold text-white mb-3">星图指南</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          {dimensions.slice(0, 4).map(dimension => (
            <li key={dimension.id} className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: dimension.color }}
              ></span>
              <span>{dimension.name} - {dimension.question}</span>
            </li>
          ))}
          {dimensions.length > 4 && (
            <li className="text-gray-400 italic">
              还有 {dimensions.length - 4} 个维度...
            </li>
          )}
        </ul>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white mb-3">互动提示</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-center gap-2">
            <span className="text-indigo-400">•</span>
            <span>点击星点查看概念详情</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-indigo-400">•</span>
            <span>拖动鼠标旋转星图视角</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-indigo-400">•</span>
            <span>滚轮缩放查看更多细节</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-indigo-400">•</span>
            <span>右下角控制面板可重置视图</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DimensionPanel;
