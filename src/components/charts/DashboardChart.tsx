import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { TrendData } from '@/types/dashboard';
import { useTheme } from 'next-themes';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface DashboardChartProps {
  data: TrendData;
  title: string;
  type?: 'line' | 'bar' | 'area';
  height?: string;
  subtitle?: string;
}

interface TooltipParam {
  axisValue: string;
  color: string;
  seriesName: string;
  value: number;
}

export default function DashboardChart({ 
  data, 
  title, 
  type = 'line', 
  height = '400px',
  subtitle
}: DashboardChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Calcular a variação percentual
  const getPercentageChange = () => {
    if (data.datasets[0]?.data.length < 2) return 0;
    const lastValue = data.datasets[0].data[data.datasets[0].data.length - 1];
    const previousValue = data.datasets[0].data[data.datasets[0].data.length - 2];
    return ((lastValue - previousValue) / previousValue) * 100;
  };

  const percentageChange = getPercentageChange();
  const isPositive = percentageChange >= 0;

  const options = useMemo(() => {
    const colors = [
      'rgb(59, 130, 246)',   // Blue
      'rgb(16, 185, 129)',   // Green
      'rgb(239, 68, 68)',    // Red
      'rgb(139, 92, 246)',   // Purple
      'rgb(245, 158, 11)'    // Orange
    ];

    const gradientColors = colors.map(color => ({
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0,
        color: color.replace(')', ', 0.2)')
      }, {
        offset: 1,
        color: color.replace(')', ', 0.05)')
      }]
    }));

    return {
      title: {
        show: false
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: [8, 12],
        textStyle: {
          color: '#1F2937'
        },
        extraCssText: 'box-shadow: 0 2px 4px rgba(0,0,0,0.1);border-radius: 6px;',
        formatter: (params: TooltipParam[]) => {
          let result = `<div class="font-medium">${params[0].axisValue}</div>`;
          params.forEach((param) => {
            result += `
              <div class="flex items-center mt-2">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:${param.color};margin-right:6px;"></span>
                <span class="text-gray-600">${param.seriesName}: </span>
                <span class="font-medium ml-1">${param.value}</span>
              </div>
            `;
          });
          return result;
        }
      },
      legend: {
        data: data.datasets.map(d => d.name),
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: '#6B7280',
          fontSize: 12
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: type === 'bar',
        data: data.labels,
        axisLabel: {
          color: '#6B7280',
          fontSize: 12
        },
        axisLine: {
          lineStyle: {
            color: '#E5E7EB'
          }
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#6B7280',
          fontSize: 12,
          formatter: (value: number) => {
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'k';
            }
            return value;
          }
        },
        splitLine: {
          lineStyle: {
            color: '#F3F4F6',
            type: 'dashed'
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      series: data.datasets.map((dataset, index) => ({
        name: dataset.name,
        type: type === 'area' ? 'line' : type,
        data: dataset.data,
        smooth: true,
        symbolSize: 6,
        symbol: 'circle',
        areaStyle: type === 'area' ? {
          color: gradientColors[index % gradientColors.length]
        } : undefined,
        itemStyle: {
          color: colors[index % colors.length],
          borderWidth: 2,
          borderColor: '#fff'
        },
        emphasis: {
          itemStyle: {
            borderWidth: 3,
            borderColor: '#fff',
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 8
          }
        },
        lineStyle: {
          width: 3
        },
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }))
    };
  }, [data, type]);

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {percentageChange !== 0 && (
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
              <span>{Math.abs(percentageChange).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
      <ReactECharts 
        option={options} 
        style={{ height }} 
        theme={isDark ? 'dark' : undefined}
        className="transition-opacity duration-300 hover:opacity-95"
      />
    </div>
  );
} 