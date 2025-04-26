"use client";

import { useEffect, useRef, useState } from "react";
import { Opinion } from "../types";
import * as d3 from "d3";

interface StarMapProps {
  opinions: Opinion[];
  onSelectOpinion: (opinion: Opinion) => void;
  selectedDimension: string | null;
}

const StarMap: React.FC<StarMapProps> = ({
  opinions,
  onSelectOpinion,
  selectedDimension,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Filter opinions based on selected dimension
  const filteredOpinions = selectedDimension
    ? opinions.filter((o) => o.dimension === selectedDimension)
    : opinions;

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current?.parentElement) {
        const { width, height } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || filteredOpinions.length === 0) return;

    const svg = d3.select(svgRef.current);
    
    // Clear previous elements
    svg.selectAll("*").remove();

    // Create a starry background
    const starsCount = 200;
    const stars = Array.from({ length: starsCount }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      radius: Math.random() * 1.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    svg
      .selectAll(".background-star")
      .data(stars)
      .enter()
      .append("circle")
      .attr("class", "background-star")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.radius)
      .attr("fill", "#ffffff")
      .attr("opacity", (d) => d.opacity);

    // Create scales for positioning stars based on embrace and perspective scores
    const xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([50, dimensions.width - 50]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([50, dimensions.height - 50]);

    // Scale for star size based on support count
    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(filteredOpinions, (d) => d.support) || 100])
      .range([5, 30]);

    // Color scale based on embrace score (from blue to red)
    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, 0.5, 1])
      .range(["#4169E1", "#32CD32", "#FF6347"])
      .interpolate(d3.interpolateRgb.gamma(2.2));

    // Create connections between similar opinions
    const connections = [];
    for (let i = 0; i < filteredOpinions.length; i++) {
      for (let j = i + 1; j < filteredOpinions.length; j++) {
        const a = filteredOpinions[i];
        const b = filteredOpinions[j];
        
        // Calculate similarity based on position in the 2D space
        const distance = Math.sqrt(
          Math.pow(a.embraceScore - b.embraceScore, 2) +
          Math.pow(a.perspectiveScore - b.perspectiveScore, 2)
        );
        
        // Only connect opinions that are somewhat similar
        if (distance < 0.3) {
          connections.push({
            source: a,
            target: b,
            strength: 1 - distance / 0.3,
          });
        }
      }
    }

    // Draw connections
    svg
      .selectAll(".connection")
      .data(connections)
      .enter()
      .append("line")
      .attr("class", "connection")
      .attr("x1", (d) => xScale(d.source.embraceScore))
      .attr("y1", (d) => yScale(d.source.perspectiveScore))
      .attr("x2", (d) => xScale(d.target.embraceScore))
      .attr("y2", (d) => yScale(d.target.perspectiveScore))
      .attr("stroke", "#ffffff")
      .attr("stroke-opacity", (d) => d.strength * 0.2)
      .attr("stroke-width", (d) => d.strength * 2);

    // Create star groups
    const starGroups = svg
      .selectAll(".star-group")
      .data(filteredOpinions)
      .enter()
      .append("g")
      .attr("class", "star-group")
      .attr("transform", (d) => 
        `translate(${xScale(d.embraceScore)}, ${yScale(d.perspectiveScore)})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        onSelectOpinion(d);
      });

    // Add glow effect
    starGroups
      .append("circle")
      .attr("class", "star-glow")
      .attr("r", (d) => sizeScale(d.support) * 1.5)
      .attr("fill", (d) => colorScale(d.embraceScore))
      .attr("opacity", 0.3);

    // Add stars
    starGroups
      .append("circle")
      .attr("class", "star")
      .attr("r", (d) => sizeScale(d.support))
      .attr("fill", (d) => colorScale(d.embraceScore))
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1);

    // Add labels to larger stars
    starGroups
      .filter((d) => d.support > 60) // Only show labels for more supported opinions
      .append("text")
      .attr("class", "star-label")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => sizeScale(d.support) + 15)
      .attr("fill", "#ffffff")
      .attr("font-size", "12px")
      .attr("pointer-events", "none")
      .text((d) => d.title.length > 20 ? d.title.substring(0, 20) + "..." : d.title);

    // Add axis labels
    svg
      .append("text")
      .attr("x", dimensions.width / 2)
      .attr("y", dimensions.height - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "#8899A6")
      .text("热烈拥抱 ←→ 超然接受");

    svg
      .append("text")
      .attr("x", 15)
      .attr("y", dimensions.height / 2)
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90, 15, ${dimensions.height / 2})`)
      .attr("fill", "#8899A6")
      .text("个体视角 ←→ 宇宙视角");

  }, [filteredOpinions, dimensions, onSelectOpinion]);

  return (
    <div className="relative w-full h-full min-h-[600px]">
      <svg
        ref={svgRef}
        className="w-full h-full bg-gradient-to-b from-gray-900 to-black"
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
};

export default StarMap;
