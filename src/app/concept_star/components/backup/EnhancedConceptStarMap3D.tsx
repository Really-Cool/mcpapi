"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import { 
  PhilosophicalConcept, 
  PhilosophicalDimension, 
  PhilosophicalOpinion,
  PhilosophicalTopic,
  ZoomControls 
} from "../types-enhanced";

// 星点组件 - 表示概念
const ConceptStar = ({ 
  concept, 
  dimensions, 
  selected, 
  highlighted, 
  onClick, 
  showLabels 
}: { 
  concept: PhilosophicalConcept; 
  dimensions: PhilosophicalDimension[];
  selected: boolean; 
  highlighted: boolean;
  onClick: () => void;
  showLabels: boolean;
}) => {
  const dimension = dimensions.find(d => d.id === concept.dimension);
  const color = dimension?.color || "#FFFFFF";
  
  // 计算星点大小
  const size = concept.size * (selected ? 1.5 : highlighted ? 1.2 : 1);
  
  return (
    <group position={[concept.position.x * 10 - 5, concept.position.y * 10 - 5, concept.position.z * 10 - 5]}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[size * 0.2, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={selected ? 1 : highlighted ? 0.7 : 0.5}
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>
      
      {showLabels && (
        <Billboard position={[0, size * 0.3, 0]}>
          <Text
            color="white"
            fontSize={0.2}
            maxWidth={2}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
          >
            {concept.name}
          </Text>
        </Billboard>
      )}
      
      {selected && (
        <group>
          <mesh>
            <sphereGeometry args={[size * 0.3, 16, 16]} />
            <meshStandardMaterial 
              color={color} 
              transparent={true}
              opacity={0.2}
              emissive={color}
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh>
            <ringGeometry args={[size * 0.35, size * 0.37, 32]} />
            <meshBasicMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// 观点星点组件
const OpinionStar = ({
  opinion,
  dimensions,
  selected,
  onClick
}: {
  opinion: PhilosophicalOpinion;
  dimensions: PhilosophicalDimension[];
  selected: boolean;
  onClick: () => void;
}) => {
  const dimension = dimensions.find(d => d.id === opinion.dimensionId);
  const color = dimension?.color || "#FFFFFF";
  
  // 根据观点的拥抱/接受评分计算颜色
  const embraceScore = opinion.scores.embraceScore || 0.5;
  const finalColor = embraceScore < 0.4 
    ? "#4A6FE3" // 蓝色 - 超然接受
    : embraceScore > 0.6 
      ? "#E35D6A" // 红色 - 热烈拥抱
      : "#62BD7A"; // 绿色 - 平衡
  
  // 计算观点在3D空间中的位置
  const position = opinion.position || { 
    x: 0.3 + Math.random() * 0.4, 
    y: 0.3 + Math.random() * 0.4, 
    z: 0.3 + Math.random() * 0.4 
  };
  
  // 根据支持度计算大小
  const size = 0.05 + (opinion.support / 100) * 0.15;
  
  return (
    <group position={[position.x * 10 - 5, position.y * 10 - 5, position.z * 10 - 5]}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={finalColor} 
          emissive={finalColor}
          emissiveIntensity={selected ? 1 : 0.6}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {selected && (
        <group>
          <mesh>
            <sphereGeometry args={[size * 1.3, 16, 16]} />
            <meshStandardMaterial 
              color={finalColor} 
              transparent={true}
              opacity={0.15}
              emissive={finalColor}
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh>
            <ringGeometry args={[size * 1.5, size * 1.55, 32]} />
            <meshBasicMaterial color={finalColor} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// 维度连接线
const DimensionConnection = ({
  start,
  end,
  color,
  thickness = 0.02
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  thickness?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    if (ref.current) {
      const direction = new THREE.Vector3(
        end[0] - start[0],
        end[1] - start[1],
        end[2] - start[2]
      );
      const length = direction.length();
      direction.normalize();
      
      ref.current.position.set(
        start[0] + direction.x * length / 2,
        start[1] + direction.y * length / 2,
        start[2] + direction.z * length / 2
      );
      
      ref.current.scale.set(thickness, length, thickness);
      ref.current.lookAt(end[0], end[1], end[2]);
      ref.current.rotateX(Math.PI / 2);
    }
  }, [start, end, thickness]);
  
  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[1, 1, 1, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
};

// 星云粒子效果
const StarCloud = ({ 
  dimension, 
  intensity = 100 
}: { 
  dimension: PhilosophicalDimension; 
  intensity: number;
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  const { color } = dimension;
  
  // 创建粒子
  const particles = useMemo(() => {
    const particleCount = intensity;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const colorObj = new THREE.Color(color);
    
    for (let i = 0; i < particleCount; i++) {
      // 在维度区域周围随机分布粒子
      const radius = 3 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // 设置颜色
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;
      
      // 设置大小
      sizes[i] = Math.random() * 0.05;
    }
    
    return { positions, colors, sizes };
  }, [color, intensity]);
  
  // 粒子动画
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

// 相机控制
const CameraController = ({ zoomControls }: { zoomControls: ZoomControls }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  
  useEffect(() => {
    if (controlsRef.current) {
      // 将控制器方法暴露给外部
      zoomControls.zoomIn = () => {
        controlsRef.current.dollyIn(1.2);
      };
      
      zoomControls.zoomOut = () => {
        controlsRef.current.dollyOut(1.2);
      };
      
      zoomControls.resetZoom = () => {
        controlsRef.current.reset();
      };
      
      zoomControls.rotateLeft = () => {
        controlsRef.current.rotateLeft(Math.PI / 12);
      };
      
      zoomControls.rotateRight = () => {
        controlsRef.current.rotateRight(Math.PI / 12);
      };
      
      zoomControls.rotateUp = () => {
        controlsRef.current.rotateUp(Math.PI / 12);
      };
      
      zoomControls.rotateDown = () => {
        controlsRef.current.rotateDown(Math.PI / 12);
      };
      
      zoomControls.resetRotation = () => {
        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);
      };
    }
  }, [zoomControls, camera]);
  
  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.5}
      minDistance={3}
      maxDistance={20}
    />
  );
};

// 主星图组件
interface EnhancedConceptStarMap3DProps {
  concepts: PhilosophicalConcept[];
  dimensions: PhilosophicalDimension[];
  opinions: PhilosophicalOpinion[];
  currentTopic: PhilosophicalTopic;
  selectedDimension: string | null;
  selectedConcept: string | null;
  selectedOpinion: string | null;
  onSelectConcept: (conceptId: string | null) => void;
  onSelectOpinion: (opinionId: string | null) => void;
  showLabels?: boolean;
}

const EnhancedConceptStarMap3D: React.FC<EnhancedConceptStarMap3DProps> = ({
  concepts,
  dimensions,
  opinions,
  currentTopic,
  selectedDimension,
  selectedConcept,
  selectedOpinion,
  onSelectConcept,
  onSelectOpinion,
  showLabels = true,
}) => {
  // 创建缩放控制器
  const [zoomControls] = useState<ZoomControls>({
    zoomIn: () => {},
    zoomOut: () => {},
    resetZoom: () => {},
    rotateLeft: () => {},
    rotateRight: () => {},
    rotateUp: () => {},
    rotateDown: () => {},
    resetRotation: () => {},
  });
  
  // 过滤当前议题相关的概念
  const filteredConcepts = useMemo(() => {
    return concepts.filter(concept => {
      // 如果选择了维度，只显示该维度的概念
      if (selectedDimension && concept.dimension !== selectedDimension) {
        return false;
      }
      
      // 只显示与当前议题相关的概念
      return concept.relatedTopics?.includes(currentTopic.id);
    });
  }, [concepts, selectedDimension, currentTopic]);
  
  // 过滤当前议题和维度相关的观点
  const filteredOpinions = useMemo(() => {
    return opinions.filter(opinion => {
      // 如果选择了维度，只显示该维度的观点
      if (selectedDimension && opinion.dimensionId !== selectedDimension) {
        return false;
      }
      
      // 只显示与当前议题相关的观点
      return opinion.topicId === currentTopic.id;
    });
  }, [opinions, selectedDimension, currentTopic]);
  
  // 计算与选中概念相关的概念ID列表
  const relatedConceptIds = useMemo(() => {
    if (!selectedConcept) return [];
    const selectedConceptObj = concepts.find(c => c.id === selectedConcept);
    return selectedConceptObj ? selectedConceptObj.relatedConcepts : [];
  }, [selectedConcept, concepts]);
  
  // 计算概念之间的连接线
  const conceptConnections = useMemo(() => {
    const connections: {
      start: [number, number, number];
      end: [number, number, number];
      color: string;
    }[] = [];
    
    // 如果选中了概念，显示与其相关的连接
    if (selectedConcept) {
      const selectedConceptObj = concepts.find(c => c.id === selectedConcept);
      if (selectedConceptObj) {
        const startPos: [number, number, number] = [
          selectedConceptObj.position.x * 10 - 5,
          selectedConceptObj.position.y * 10 - 5,
          selectedConceptObj.position.z * 10 - 5
        ];
        
        // 找出所有相关概念并创建连接
        selectedConceptObj.relatedConcepts.forEach(relatedId => {
          const relatedConcept = concepts.find(c => c.id === relatedId);
          if (relatedConcept) {
            const endPos: [number, number, number] = [
              relatedConcept.position.x * 10 - 5,
              relatedConcept.position.y * 10 - 5,
              relatedConcept.position.z * 10 - 5
            ];
            
            const dimension = dimensions.find(d => d.id === selectedConceptObj.dimension);
            connections.push({
              start: startPos,
              end: endPos,
              color: dimension?.color || "#FFFFFF",
            });
          }
        });
      }
    }
    
    return connections;
  }, [selectedConcept, concepts, dimensions]);
  
  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <CameraController zoomControls={zoomControls} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* 星云背景 - 为每个相关维度创建星云 */}
        {dimensions
          .filter(d => currentTopic.dimensions.includes(d.id) && (!selectedDimension || d.id === selectedDimension))
          .map(dimension => (
            <StarCloud 
              key={dimension.id} 
              dimension={dimension} 
              intensity={selectedDimension === dimension.id ? 200 : 100} 
            />
          ))
        }
        
        {/* 概念星点 */}
        {filteredConcepts.map(concept => (
          <ConceptStar
            key={concept.id}
            concept={concept}
            dimensions={dimensions}
            selected={concept.id === selectedConcept}
            highlighted={relatedConceptIds.includes(concept.id)}
            onClick={() => onSelectConcept(concept.id === selectedConcept ? null : concept.id)}
            showLabels={showLabels}
          />
        ))}
        
        {/* 观点星点 */}
        {filteredOpinions.map(opinion => (
          <OpinionStar
            key={opinion.id}
            opinion={opinion}
            dimensions={dimensions}
            selected={opinion.id === selectedOpinion}
            onClick={() => onSelectOpinion(opinion.id === selectedOpinion ? null : opinion.id)}
          />
        ))}
        
        {/* 概念连接线 */}
        {conceptConnections.map((connection, index) => (
          <DimensionConnection
            key={index}
            start={connection.start}
            end={connection.end}
            color={connection.color}
          />
        ))}
      </Canvas>
      
      {/* 控制面板 */}
      <div className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-70 rounded-lg p-2 flex flex-col space-y-2">
        <button
          onClick={zoomControls.zoomIn}
          className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg text-white"
          title="放大"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={zoomControls.zoomOut}
          className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg text-white"
          title="缩小"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={zoomControls.resetZoom}
          className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg text-white"
          title="重置视图"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* 图例 */}
      <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-70 rounded-lg p-3">
        <h3 className="text-sm font-medium text-white mb-2">图例</h3>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-white"></span>
            <span className="text-xs text-gray-200">概念</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-xs text-gray-200">超然接受观点</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-xs text-gray-200">平衡观点</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-xs text-gray-200">热烈拥抱观点</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedConceptStarMap3D;
