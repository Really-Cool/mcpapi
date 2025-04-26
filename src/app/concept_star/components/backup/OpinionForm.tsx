"use client";

import { useState } from "react";
import { Topic } from "../types";

interface OpinionFormProps {
  topic: Topic;
  onSubmit: (opinion: {
    title: string;
    content: string;
    dimension: string;
  }) => void;
}

const OpinionForm: React.FC<OpinionFormProps> = ({ topic, onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dimension, setDimension] = useState(topic.dimensions[0]?.id || "");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
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
    
    if (isValid) {
      onSubmit({
        title,
        content,
        dimension,
      });
      
      // Reset form
      setTitle("");
      setContent("");
      setDimension(topic.dimensions[0]?.id || "");
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
          分享我的观点
        </button>
      ) : (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">分享你的观点</h3>
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
                选择讨论维度
              </label>
              <select
                id="dimension"
                value={dimension}
                onChange={(e) => setDimension(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                {topic.dimensions.map((dim) => (
                  <option key={dim.id} value={dim.id}>
                    {dim.name}: {dim.question}
                  </option>
                ))}
              </select>
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
                placeholder="例如：生命的短暂要求我们全情投入每一刻"
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

export default OpinionForm;
