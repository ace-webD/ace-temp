"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const updateMaskPosition = () => {
      const rect = svgElement.getBoundingClientRect();
      const svgX = cursor.x - rect.left;
      const svgY = cursor.y - rect.top;
      const viewBoxWidth = 300;
      const viewBoxHeight = 100;
      const cxPercent = (svgX / rect.width) * 100;
      const cyPercent = (svgY / rect.height) * 100;

      setMaskPosition({ cx: `${cxPercent}%`, cy: `${cyPercent}%` });
    };

    if (hovered) {
      updateMaskPosition();
    } else {
      setMaskPosition({ cx: "50%", cy: "50%" });
    }
  }, [cursor, hovered]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none", className)}
    >
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#003973", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#4FC3F7", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#003973", stopOpacity: 1 }} />
        </linearGradient>

        <mask id="textMask">
          <circle
            cx={maskPosition.cx}
            cy={maskPosition.cy}
            r={hovered ? "40" : "0"}
            fill="white"
            style={{ transition: "r 0.3s ease-out" }}
          />
        </mask>
      </defs>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.5"
        className="fill-transparent stroke-neutral-200/50 text-7xl font-bold dark:stroke-neutral-800/50"
        style={{ opacity: hovered ? 0 : 0.7, transition: "opacity 0.3s" }}
      >
        {text}
      </text>

      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.5"
        className="fill-transparent stroke-neutral-200/50 text-7xl font-bold dark:stroke-neutral-800/50"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
        style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.3s" }}
      >
        {text}
      </motion.text>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.5"
        mask="url(#textMask)"
        className="fill-transparent text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};