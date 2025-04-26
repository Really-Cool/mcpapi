"use client";

import { Opinion } from "../types";

interface OpinionDetailProps {
  opinion: Opinion | null;
  onClose: () => void;
}

const OpinionDetail: React.FC<OpinionDetailProps> = ({ opinion, onClose }) => {
  if (!opinion) return null;

  // Calculate percentage of support (assuming 100 is max for demo)
  const supportPercentage = Math.min(100, Math.round((opinion.support / 100) * 100));
  
  // Determine the color based on embrace score
  const getColor = (score: number) => {
    if (score < 0.33) return "text-blue-500";
    if (score < 0.66) return "text-green-500";
    return "text-red-500";
  };
  
  // Get label for embrace score
  const getEmbraceLabel = (score: number) => {
    if (score < 0.33) return "超然接受";
    if (score < 0.66) return "平衡态度";
    return "热烈拥抱";
  };
  
  // Get label for perspective score
  const getPerspectiveLabel = (score: number) => {
    if (score < 0.33) return "个体视角";
    if (score < 0.66) return "社会视角";
    return "宇宙视角";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className={`text-xl font-bold ${getColor(opinion.embraceScore)}`}>
              {opinion.title}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-300 whitespace-pre-line">{opinion.content}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded p-3">
              <div className="text-sm text-gray-400 mb-1">作者</div>
              <div className="text-white">{opinion.author}</div>
            </div>
            <div className="bg-gray-800 rounded p-3">
              <div className="text-sm text-gray-400 mb-1">支持度</div>
              <div className="flex items-center">
                <div className="text-white font-medium">{opinion.support}</div>
                <div className="text-gray-400 ml-2 text-sm">({supportPercentage}%)</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">态度倾向</span>
                <span className={`text-sm font-medium ${getColor(opinion.embraceScore)}`}>
                  {getEmbraceLabel(opinion.embraceScore)}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    opinion.embraceScore < 0.33 ? "bg-blue-500" : 
                    opinion.embraceScore < 0.66 ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{ width: `${opinion.embraceScore * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">视角层次</span>
                <span className="text-sm font-medium text-indigo-400">
                  {getPerspectiveLabel(opinion.perspectiveScore)}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-indigo-500"
                  style={{ width: `${opinion.perspectiveScore * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-white font-medium mb-3">相似观点</h4>
            <div className="space-y-2">
              {/* In a real app, we would fetch similar opinions */}
              <div className="bg-gray-800 p-3 rounded text-sm text-gray-300">
                生命的短暂性提醒我们珍惜当下，但也需要保持一定的超然态度，才能看清全局。
              </div>
              <div className="bg-gray-800 p-3 rounded text-sm text-gray-300">
                既要全情投入生活，又要保持哲学的距离感，这种平衡是智慧的体现。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpinionDetail;
