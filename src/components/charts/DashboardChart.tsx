import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { TrendData } from '@/types/dashboard';
import { useTheme } from 'next-themes';

interface DashboardChartProps {
  data: TrendData;
  title: string;
  type?: 'line' | 'bar' | 'area';
  height?: string;
}

export default function DashboardChart({ data, title, type = 'line', height = '400px' }: DashboardChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const options = useMemo(() => {
    const colors = isDark 
      ? ['#60A5FA', '#34D399', '#F87171', '#A78BFA', '#FBBF24']
      : ['#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B'];

    return {
      title: {
        text: title,
        textStyle: {
          color: isDark ? '#F9FAFB' : '#111827',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark ? '#374151' : '#FFFFFF',
        borderColor: isDark ? '#4B5563' : '#E5E7EB',
        textStyle: {
          color: isDark ? '#F9FAFB' : '#111827'
        }
      },
      legend: {
        data: data.datasets.map(d => d.name),
        textStyle: {
          color: isDark ? '#D1D5DB' : '#4B5563'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.labels,
        axisLabel: {
          color: isDark ? '#D1D5DB' : '#4B5563'
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#4B5563' : '#E5E7EB'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: isDark ? '#D1D5DB' : '#4B5563'
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#374151' : '#F3F4F6'
          }
        }
      },
      series: data.datasets.map((dataset, index) => ({
        name: dataset.name,
        type: type === 'area' ? 'line' : type,
        data: dataset.data,
        smooth: true,
        areaStyle: type === 'area' ? {
          opacity: 0.1
        } : undefined,
        itemStyle: {
          color: colors[index % colors.length]
        }
      }))
    };
  }, [data, title, type, isDark]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <ReactECharts 
        option={options} 
        style={{ height }} 
        theme={isDark ? 'dark' : undefined}
      />
    </div>
  );
} 