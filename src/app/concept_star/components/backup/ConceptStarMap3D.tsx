"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { PhilosophicalConcept, PhilosophicalDimension } from "../types-enhanced";

interface ConceptNodeProps {
  concept: PhilosophicalConcept;
  dimensions: PhilosophicalDimension[];
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
}

// 单个概念节点的渲染组件
const ConceptNode: React.FC<ConceptNodeProps> = ({
  concept,
  dimensions,
  isSelected,
  isHighlighted,
  onClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const dimension = dimensions.find(d => d.id === concept.dimension);
  const color = dimension?.color || "#ffffff";
  
  // 动画效果
  useFrame((state) => {
    if (meshRef.current) {
      // 呼吸效果
      const t = state.clock.getElapsedTime();
      const scale = isSelected 
        ? 1.5 + Math.sin(t * 2) * 0.1 
        : isHighlighted 
          ? 1.2 + Math.sin(t * 2) * 0.05 
          : 1.0;
      
      meshRef.current.scale.setScalar(scale * concept.size);
      
      // 选中时的旋转效果
      if (isSelected) {
        meshRef.current.rotation.y += 0.01;
        meshRef.current.rotation.x += 0.005;
      }
    }
  });

  return (
    <group position={[
      concept.position.x * 20 - 10, 
      concept.position.y * 20 - 10, 
      concept.position.z * 20 - 10
    ]}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        scale={concept.size}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : isHighlighted ? 0.5 : 0.3}
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>
      
      {/* 概念名称标签 */}
      {(isSelected || isHighlighted || concept.size > 0.8) && (
        <Html
          position={[0, 1.5, 0]}
          center
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '4px 8px',
            borderRadius: '4px',
            color: 'white',
            fontSize: isSelected ? '16px' : '12px',
            fontWeight: isSelected ? 'bold' : 'normal',
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          {concept.name}
        </Html>
      )}
    </group>
  );
};

// 概念之间的关系连线
interface ConceptConnectionProps {
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  color: string;
  opacity: number;
}

const ConceptConnection: React.FC<ConceptConnectionProps> = ({
  startPosition,
  endPosition,
  color,
  opacity
}) => {
  const lineRef = useRef<THREE.Line>(null);
  
  useEffect(() => {
    if (lineRef.current) {
      const points = [
        new THREE.Vector3(...startPosition),
        new THREE.Vector3(...endPosition)
      ];
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lineRef.current.geometry = geometry;
    }
  }, [startPosition, endPosition]);

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
};

// 星图背景
const StarBackground: React.FC = () => {
  const { scene } = useThree();
  const starsRef = useRef<THREE.Points>(null);
  
  useEffect(() => {
    // 创建星空背景
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    return () => {
      scene.remove(stars);
      starsGeometry.dispose();
      starsMaterial.dispose();
    };
  }, [scene]);
  
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
    }
  });
  
  return null;
};

// 维度轴标签
const DimensionAxes: React.FC<{ dimensions: PhilosophicalDimension[] }> = ({ dimensions }) => {
  return (
    <>
      {dimensions.slice(0, 3).map((dimension, index) => {
        const position = [
          index === 0 ? 15 : 0,
          index === 1 ? 15 : 0,
          index === 2 ? 15 : 0
        ];
        
        return (
          <Text
            key={dimension.id}
            position={position as [number, number, number]}
            color={dimension.color}
            fontSize={1.5}
            anchorX="center"
            anchorY="middle"
          >
            {dimension.name}
          </Text>
        );
      })}
    </>
  );
};

// 主星图组件
interface ConceptStarMap3DProps {
  concepts: PhilosophicalConcept[];
  dimensions: PhilosophicalDimension[];
  selectedDimension: string | null;
  selectedConcept: string | null;
  onSelectConcept: (conceptId: string) => void;
  highlightedConcepts?: string[];
}

const ConceptStarMap3D: React.FC<ConceptStarMap3DProps> = ({
  concepts,
  dimensions,
  selectedDimension,
  selectedConcept,
  onSelectConcept,
  highlightedConcepts = []
}) => {
  // 根据选中的维度筛选概念
  const filteredConcepts = selectedDimension
    ? concepts.filter(c => c.dimension === selectedDimension)
    : concepts;

  // 获取选中的概念对象
  const selectedConceptObj = selectedConcept
    ? concepts.find(c => c.id === selectedConcept)
    : null;
  
  // 计算概念之间的关系连线
  const connections: {
    start: PhilosophicalConcept;
    end: PhilosophicalConcept;
    strength: number;
  }[] = [];
  
  filteredConcepts.forEach(concept => {
    concept.relatedConcepts.forEach(relatedId => {
      const relatedConcept = filteredConcepts.find(c => c.id === relatedId);
      if (relatedConcept) {
        // 避免重复添加连线
        const existingConnection = connections.find(
          conn => 
            (conn.start.id === concept.id && conn.end.id === relatedConcept.id) ||
            (conn.start.id === relatedConcept.id && conn.end.id === concept.id)
        );
        
        if (!existingConnection) {
          connections.push({
            start: concept,
            end: relatedConcept,
            strength: 0.5, // 连线强度
          });
        }
      }
    });
  });
  
  // 如果有选中的概念，添加与该概念相关的连线
  if (selectedConceptObj) {
    selectedConceptObj.relatedConcepts.forEach(relatedId => {
      const relatedConcept = concepts.find(c => c.id === relatedId);
      if (relatedConcept && !filteredConcepts.includes(relatedConcept)) {
        connections.push({
          start: selectedConceptObj,
          end: relatedConcept,
          strength: 0.3, // 较弱的连线强度
        });
      }
    });
  }

  // 控制相机初始位置
  const cameraPosition: [number, number, number] = [0, 0, 30];

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: cameraPosition, fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <StarBackground />
        <DimensionAxes dimensions={dimensions} />
        
        {/* 概念之间的连线 */}
        {connections.map((connection, index) => {
          const startPos: [number, number, number] = [
            connection.start.position.x * 20 - 10,
            connection.start.position.y * 20 - 10,
            connection.start.position.z * 20 - 10
          ];
          
          const endPos: [number, number, number] = [
            connection.end.position.x * 20 - 10,
            connection.end.position.y * 20 - 10,
            connection.end.position.z * 20 - 10
          ];
          
          const isHighlighted = 
            selectedConcept && 
            (connection.start.id === selectedConcept || connection.end.id === selectedConcept);
          
          return (
            <ConceptConnection
              key={`connection-${index}`}
              startPosition={startPos}
              endPosition={endPos}
              color={isHighlighted ? "#ffffff" : "#555555"}
              opacity={isHighlighted ? 0.8 : connection.strength * 0.5}
            />
          );
        })}
        
        {/* 概念节点 */}
        {filteredConcepts.map(concept => (
          <ConceptNode
            key={concept.id}
            concept={concept}
            dimensions={dimensions}
            isSelected={concept.id === selectedConcept}
            isHighlighted={highlightedConcepts.includes(concept.id)}
            onClick={() => onSelectConcept(concept.id)}
          />
        ))}
        
        {/* 相机控制 */}
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.5}
          rotateSpeed={0.5}
          minDistance={5}
          maxDistance={100}
        />
      </Canvas>
      
      {/* 缩放和旋转控制按钮 */}
      <div className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-70 rounded-lg p-2 flex flex-col gap-2">
        <div className="flex gap-2">
          <button 
            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white"
            onClick={() => {
              // 实际控制会通过 OrbitControls 进行
              // 这里只是UI展示
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button 
            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
        </div>
        <button 
          className="w-full h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ConceptStarMap3D;
