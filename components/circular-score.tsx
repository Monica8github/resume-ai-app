"use client"

import { useEffect, useState } from "react"

interface CircularScoreProps {
  score: number
  size?: number
  strokeWidth?: number
}

export function CircularScore({ 
  score, 
  size = 120, 
  strokeWidth = 10 
}: CircularScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    const duration = 1200
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 4)
      setAnimatedScore(Math.round(score * easeOut))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [score])

  const getScoreGradient = () => {
    if (score >= 80) return "url(#scoreGradientHigh)"
    if (score >= 60) return "url(#scoreGradientMid)"
    return "url(#scoreGradientLow)"
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <defs>
          <linearGradient id="scoreGradientHigh" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.65 0.22 280)" />
            <stop offset="100%" stopColor="oklch(0.55 0.25 260)" />
          </linearGradient>
          <linearGradient id="scoreGradientMid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.55 0.25 260)" />
            <stop offset="100%" stopColor="oklch(0.65 0.22 280)" />
          </linearGradient>
          <linearGradient id="scoreGradientLow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.15 60)" />
            <stop offset="100%" stopColor="oklch(0.65 0.2 40)" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          className="stroke-secondary"
          fill="none"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          stroke={getScoreGradient()}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-300 drop-shadow-[0_0_8px_oklch(0.65_0.22_280_/_0.5)]"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{animatedScore}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  )
}
