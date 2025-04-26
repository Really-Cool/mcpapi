"use client";

import { useState } from "react";
import { 
  PhilosophicalOpinion, 
  PhilosophicalConcept, 
  PhilosophicalDimension 
} from "../types-enhanced";

interface EnhancedOpinionDetailProps {
  opinion: PhilosophicalOpinion;
  concept: PhilosophicalConcept;
  dimension: PhilosophicalDimension;
  relatedOpinions?: PhilosophicalOpinion[];
  onClose: () => void;
  onSelectRelatedOpinion: (opinionId: string) => void;
}

const EnhancedOpinionDetail: React.FC<EnhancedOpinionDetailProps> = ({
  opinion,
  concept,
  dimension,
  relatedOpinions = [],
  onClose,
  onSelectRelatedOpinion,
}) => {
  const [showRelated, setShowRelated] = useState(false);
  
  // 计算观点立场的文本描述
  const getEmbraceDescription = (score: number | undefined) => {
    if (!score) return "中立";
    if (score < 0.3) return "强烈倾向超然接受";
    if (score < 0.45) return "倾向超然接受";
    if (score < 0.55) return "中立平衡";
    if (score < 0.8) return "倾向热烈拥抱";
    return "强烈倾向热烈拥抱";
  };
  
  const getIndividualityDescription = (score: number | undefined) => {
    if (!score) return "中立";
    if (score < 0.3) return "强调个体视角";
    if (score < 0.45) return "偏向个体视角";
    if (score < 0.55) return "个体与集体平衡";
    if (score < 0.8) return "偏向集体视角";
    return "强调集体视角";
  };
  
  const getRationalityDescription = (score: number | undefined) => {
    if (!score) return "中立";
    if (score < 0.3) return "高度感性思考";
    if (score < 0.45) return "偏向感性思考";
    if (score < 0.55) return "感性与理性平衡";
    if (score < 0.8) return "偏向理性思考";
    return "高度理性思考";
  };
  
  // 获取相关的跨维度观点
  const crossDimensionalOpinions = relatedOpinions.filter(op => 
    op.dimensionId !== opinion.dimensionId && 
    op.topicId === opinion.topicId
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">哲学观点详情</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {/* 观点标题和内容 */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">{opinion.title}</h3>
            <p className="text-gray-300 whitespace-pre-line">{opinion.content}</p>
            
            <div className="flex items-center mt-4 text-sm text-gray-400">
              <span className="mr-4">作者: {opinion.author}</span>
              <span className="mr-4">支持度: {opinion.support}</span>
              <span>
                {new Date(opinion.createdAt || Date.now()).toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
          
          {/* 观点立场 */}
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h4 className="text-lg font-semibold text-white mb-3">观点立场</h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">超然接受</span>
                  <span className="text-sm text-gray-400">热烈拥抱</span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                    <div
                      style={{ width: `${(opinion.scores.embraceScore || 0.5) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                    ></div>
                  </div>
                  <div className="text-right mt-1 text-sm text-indigo-400">
                    {getEmbraceDescription(opinion.scores.embraceScore)}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">个体视角</span>
                  <span className="text-sm text-gray-400">集体视角</span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                    <div
                      style={{ width: `${(opinion.scores.individualityScore || 0.5) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    ></div>
                  </div>
                  <div className="text-right mt-1 text-sm text-green-400">
                    {getIndividualityDescription(opinion.scores.individualityScore)}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">感性思考</span>
                  <span className="text-sm text-gray-400">理性思考</span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                    <div
                      style={{ width: `${(opinion.scores.rationalityScore || 0.5) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                    ></div>
                  </div>
                  <div className="text-right mt-1 text-sm text-purple-400">
                    {getRationalityDescription(opinion.scores.rationalityScore)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 关联信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* 相关概念 */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-white mb-2">相关概念</h4>
              <div className="mb-2">
                <span className="text-indigo-400 font-medium">{concept.name}</span>
                <p className="text-sm text-gray-300 mt-1">{concept.description}</p>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                <div>相关哲学家: {concept.philosophers.join(", ")}</div>
                <div>哲学流派: {concept.schools.join(", ")}</div>
                <div>时代: {concept.era}</div>
              </div>
            </div>
            
            {/* 哲学维度 */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-white mb-2">哲学维度</h4>
              <div>
                <span 
                  className="text-white font-medium px-2 py-1 rounded-full text-sm"
                  style={{ backgroundColor: dimension.color }}
                >
                  {dimension.name}
                </span>
                <p className="text-sm text-gray-300 mt-2">{dimension.question}</p>
                <p className="text-xs text-gray-400 mt-1">{dimension.description}</p>
              </div>
            </div>
          </div>
          
          {/* 跨维度相关观点 */}
          {crossDimensionalOpinions.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-semibold text-white">跨维度相关观点</h4>
                <button 
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                  onClick={() => setShowRelated(!showRelated)}
                >
                  {showRelated ? "收起" : "展开"}
                </button>
              </div>
              
              {showRelated && (
                <div className="space-y-3">
                  {crossDimensionalOpinions.map(op => (
                    <div 
                      key={op.id}
                      className="p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => onSelectRelatedOpinion(op.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-white">{op.title}</h5>
                        <span 
                          className="px-2 py-0.5 text-xs rounded-full"
                          style={{ 
                            backgroundColor: dimension.color,
                            opacity: 0.8 
                          }}
                        >
                          {dimension.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{op.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* 互动区域 */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>支持 ({opinion.support})</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span>评论</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>分享</span>
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOpinionDetail;
