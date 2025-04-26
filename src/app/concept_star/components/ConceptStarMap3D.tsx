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
  const time = useRef(0);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  // 计算星点大小
  const size = concept.size * (selected ? 1.5 : highlighted ? 1.2 : 1);
  
  // 添加动画效果
  useFrame((state, delta) => {
    time.current += delta;
    
    if (meshRef.current) {
      // 脉动效果 - 轻微的大小变化
      const pulseScale = 1 + Math.sin(time.current * 1.5) * 0.05;
      meshRef.current.scale.set(pulseScale, pulseScale, pulseScale);
      
      // 发光效果变化
      if (glowRef.current && glowRef.current.material) {
        // 确保material是MeshStandardMaterial类型
        if ('emissiveIntensity' in glowRef.current.material) {
          const material = glowRef.current.material as THREE.MeshStandardMaterial;
          // 确保 emissiveIntensity 的值在合理范围内
          const baseIntensity = selected ? 1 : highlighted ? 0.7 : 0.5;
          const variation = Math.sin(time.current * 2) * 0.2;
          material.emissiveIntensity = Math.max(0, Math.min(1, baseIntensity + variation));
        }
      }
      
      // 选中时的环效果
      if (selected && ringRef.current) {
        ringRef.current.rotation.x = time.current * 0.5;
        ringRef.current.rotation.y = time.current * 0.3;
      }
    }
  });
  
  // 创建轨道路径 - 用于概念的微小运动
  const orbitRadius = 0.1;
  const orbitPosition = useMemo(() => {
    const basePos = [
      concept.position.x * 10 - 5, 
      concept.position.y * 10 - 5, 
      concept.position.z * 10 - 5
    ];
    return basePos;
  }, [concept.position]);
  
  // 计算当前轨道位置
  const currentPosition = useMemo(() => {
    return [
      orbitPosition[0] + Math.sin(time.current * 0.5) * orbitRadius,
      orbitPosition[1] + Math.cos(time.current * 0.5) * orbitRadius,
      orbitPosition[2] + Math.sin(time.current * 0.7) * orbitRadius
    ] as [number, number, number];
  }, [orbitPosition, time.current]);
  
  return (
    <group position={currentPosition}>
      {/* 主星体 */}
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[size * 0.2, 32, 32]} />
        <meshStandardMaterial 
          ref={glowRef}
          color={color} 
          emissive={color}
          emissiveIntensity={selected ? 1 : highlighted ? 0.7 : 0.5}
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>
      
      {/* 标签 */}
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
      
      {/* 选中效果 */}
      {selected && (
        <group>
          {/* 发光光晕 */}
          <mesh>
            <sphereGeometry args={[size * 0.3, 16, 16]} />
            <meshStandardMaterial 
              color={color} 
              emissive={color}
              emissiveIntensity={0.5}
              transparent={true}
              opacity={0.2}
            />
          </mesh>
          
          {/* 旋转光环 */}
          <mesh ref={ringRef}>
            <ringGeometry args={[size * 0.35, size * 0.37, 32]} />
            <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.7} />
          </mesh>
          
          {/* 额外的粒子效果 */}
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i / 5) * Math.PI * 2;
            const radius = size * 0.4;
            const particleSpeed = 0.5 + i * 0.1;
            const x = Math.cos(time.current * particleSpeed + angle) * radius;
            const y = Math.sin(time.current * particleSpeed + angle) * radius;
            const z = Math.sin(time.current * 0.5 + i) * (radius * 0.3);
            
            return (
              <mesh key={i} position={[x, y, z]} scale={[0.05, 0.05, 0.05]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshBasicMaterial color={color} transparent opacity={0.8} />
              </mesh>
            );
          })}
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
  const curveRef = useRef<THREE.Line>(null);
  const time = useRef(0);
  
  // 创建一条贝塞尔曲线，而不是直线
  const curve = useMemo(() => {
    // 计算中点，并添加一些随机偏移以创建曲线效果
    const midPoint = [
      (start[0] + end[0]) / 2 + (Math.random() - 0.5) * 0.5,
      (start[1] + end[1]) / 2 + (Math.random() - 0.5) * 0.5,
      (start[2] + end[2]) / 2 + (Math.random() - 0.5) * 0.5
    ];
    
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(start[0], start[1], start[2]),
      new THREE.Vector3(midPoint[0], midPoint[1], midPoint[2]),
      new THREE.Vector3(end[0], end[1], end[2])
    );
  }, [start, end]);
  
  // 创建曲线的几何体
  const points = useMemo(() => curve.getPoints(50), [curve]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  
  // 添加动画效果
  useFrame((state, delta) => {
    time.current += delta;
    
    if (curveRef.current && curveRef.current.material) {
      // 确保material是正确的类型
      if ('opacity' in curveRef.current.material) {
        // 使线条产生波动效果
        const material = curveRef.current.material as THREE.MeshBasicMaterial;
        
        // 脉动透明度 - 确保值在有效范围内
        material.opacity = Math.max(0, Math.min(1, 0.2 + Math.sin(time.current * 2) * 0.2));
      }
      
      // 呼吸效果
      if (ref.current) {
        const scale = 0.8 + Math.sin(time.current * 1.5) * 0.2;
        ref.current.scale.x = thickness * scale;
        ref.current.scale.z = thickness * scale;
      }
    }
  });
  
  return (
    <group>
      {/* 主连接线 - 使用曲线 */}
      <line ref={curveRef} geometry={geometry}>
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.4} 
          linewidth={2}
        />
      </line>
      
      {/* 在曲线上添加发光粒子效果 */}
      {[0.2, 0.4, 0.6, 0.8].map((pos, i) => (
        <mesh 
          key={i}
          position={curve.getPoint(pos).toArray()}
          scale={[thickness * 1.5, thickness * 1.5, thickness * 1.5]}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.6 + Math.sin(time.current * 3 + i) * 0.3}
          />
        </mesh>
      ))}
    </group>
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
  const time = useRef(0);
  
  // 创建粒子
  const particles = useMemo(() => {
    const particleCount = intensity;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount); // 粒子移动速度
    const offsets = new Float32Array(particleCount); // 粒子初始偏移
    const amplitudes = new Float32Array(particleCount); // 波动幅度
    
    const colorObj = new THREE.Color(color);
    const colorVariation = 0.2; // 颜色变化范围
    
    for (let i = 0; i < particleCount; i++) {
      // 在维度区域周围随机分布粒子，使用螺旋或漩涡分布
      const radius = 3 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const spiralOffset = Math.random() * 0.5; // 螺旋效果
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta) + spiralOffset;
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + spiralOffset;
      positions[i * 3 + 2] = radius * Math.cos(phi) + spiralOffset;
      
      // 设置颜色 - 添加一些随机变化使颜色更丰富
      colors[i * 3] = colorObj.r + (Math.random() - 0.5) * colorVariation;
      colors[i * 3 + 1] = colorObj.g + (Math.random() - 0.5) * colorVariation;
      colors[i * 3 + 2] = colorObj.b + (Math.random() - 0.5) * colorVariation;
      
      // 设置大小 - 使大小更加多样化
      sizes[i] = 0.03 + Math.random() * 0.08;
      
      // 设置粒子动画参数
      speeds[i] = 0.1 + Math.random() * 0.3; // 随机速度
      offsets[i] = Math.random() * Math.PI * 2; // 随机初始相位
      amplitudes[i] = 0.1 + Math.random() * 0.3; // 随机波动幅度
    }
    
    return { positions, colors, sizes, speeds, offsets, amplitudes };
  }, [color, intensity]);
  
  // 粒子动画
  useFrame((state, delta) => {
    time.current += delta;
    
    if (particlesRef.current) {
      // 旋转整个星云
      particlesRef.current.rotation.y += 0.0005;
      particlesRef.current.rotation.x += 0.0002;
      
      // 更新粒子位置，创造波动效果
      const geometry = particlesRef.current.geometry;
      if (geometry && 
          geometry.attributes.position && 
          geometry.attributes.size) {
        
        const positions = geometry.attributes.position.array as Float32Array;
        const sizes = geometry.attributes.size.array as Float32Array;
        
        if (positions && sizes && 
            positions.length === particles.positions.length && 
            sizes.length === particles.sizes.length) {
          
          for (let i = 0; i < particles.sizes.length; i++) {
            // 波动效果 - 使粒子在原位置附近波动
            const offset = particles.offsets[i];
            const speed = particles.speeds[i];
            const amplitude = particles.amplitudes[i];
            
            // 周期性波动
            const wave = Math.sin(time.current * speed + offset) * amplitude;
            
            // 应用波动到粒子位置
            const baseX = particles.positions[i * 3];
            const baseY = particles.positions[i * 3 + 1];
            const baseZ = particles.positions[i * 3 + 2];
            
            // 创建引力波动效果
            positions[i * 3] = baseX + wave * Math.sin(time.current * 0.2 + i);
            positions[i * 3 + 1] = baseY + wave * Math.cos(time.current * 0.3 + i);
            positions[i * 3 + 2] = baseZ + wave * Math.sin(time.current * 0.1 + i * 0.5);
            
            // 粒子大小呼吸效果
            sizes[i] = particles.sizes[i] * (0.8 + Math.sin(time.current * 0.5 + offset) * 0.2);
          }
          
          // 通知Three.js更新粒子位置和大小
          geometry.attributes.position.needsUpdate = true;
          geometry.attributes.size.needsUpdate = true;
        }
      }
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
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
          args={[particles.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
          args={[particles.sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending} // 添加混合模式，使粒子更加明亮
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
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 01-1 1h-3a1 1 0 110-2h-3V9a1 1 0 011-1h3V6a1 1 0 011-1z" clipRule="evenodd" />
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
