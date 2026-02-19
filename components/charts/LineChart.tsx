'use client'

import React from 'react'
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { useTheme } from 'next-themes'

// Mock Data
const data = [
  { day: 'Mon', growth: 40 },
  { day: 'Tue', growth: 35 },
  { day: 'Wed', growth: 55 },
  { day: 'Thu', growth: 45 },
  { day: 'Fri', growth: 70 },
  { day: 'Sat', growth: 65 },
  { day: 'Sun', growth: 85 },
]

export function LineChart() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Dynamic colors based on theme
  const strokeColor = '#22c55e' // green-500
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'

  return (
    <div className="w-full h-[150px] md:h-full min-h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop 
                offset="5%" 
                stopColor={strokeColor} 
                stopOpacity={isDark ? 0.3 : 0.2} 
              />
              <stop 
                offset="95%" 
                stopColor={strokeColor} 
                stopOpacity={0} 
              />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            vertical={false} 
            stroke={gridColor} 
            strokeDasharray="3 3" 
          />
          
            <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ 
                fontSize: 9, 
                fill: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                fontWeight: 600
            }}
            dy={10} // Offset to give it some breathing room
            />

            <YAxis 
            domain={['dataMin - 10', 'dataMax + 10']}
            axisLine={false}
            tickLine={false}
            tick={{ 
                fontSize: 9, 
                fill: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                fontWeight: 600
            }}
            width={25} // Keeps the chart from shifting too much
            />
          
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1e2330' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
            itemStyle={{ color: strokeColor }}
            cursor={{ stroke: strokeColor, strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          
          <Area
            type="monotone"
            dataKey="growth"
            stroke={strokeColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorGrowth)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}