import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import type { MaterialTest } from '@/types/materials';

interface MaterialTestsChartsProps {
  tests: MaterialTest[];
  stats: {
    total: number;
    byStatus: Record<MaterialTest['status'], number>;
    latestTest: MaterialTest | null;
    failureRate: number;
  };
}

const STATUS_COLORS = {
  passed: '#10B981', // verde
  failed: '#EF4444', // vermelho
  in_progress: '#F59E0B', // amarelo
  pending: '#6B7280', // cinza
};

const CHART_HEIGHT = 300;

export default function MaterialTestsCharts({ tests, stats }: MaterialTestsChartsProps) {
  // Prepara dados para o gráfico de status
  const statusData = Object.entries(stats.byStatus).map(([status, count]) => ({
    name: status === 'passed' ? 'Aprovado' :
          status === 'failed' ? 'Reprovado' :
          status === 'in_progress' ? 'Em Progresso' : 'Pendente',
    value: count,
    color: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
  }));

  // Prepara dados para o gráfico de tendência
  const trendData = tests
    .slice()
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .map(test => ({
      date: new Date(test.dueDate).toLocaleDateString('pt-BR'),
      status: test.status,
      result: test.status === 'passed' ? 100 :
              test.status === 'failed' ? 0 :
              test.status === 'in_progress' ? 50 : 25,
    }));

  // Calcula métricas de qualidade
  const qualityScore = (stats.byStatus.passed / stats.total) * 100 || 0;
  const pendingRate = (stats.byStatus.pending / stats.total) * 100 || 0;
  const inProgressRate = (stats.byStatus.in_progress / stats.total) * 100 || 0;

  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
      {/* Cartões de Métricas */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Taxa de Aprovação
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={qualityScore}
                color={qualityScore >= 70 ? 'success' : qualityScore >= 50 ? 'warning' : 'error'}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {qualityScore.toFixed(1)}%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {stats.byStatus.passed} de {stats.total} testes aprovados
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Testes Pendentes
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={pendingRate}
                color="warning"
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {pendingRate.toFixed(1)}%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {stats.byStatus.pending} testes aguardando execução
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Em Progresso
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={inProgressRate}
                color="info"
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {inProgressRate.toFixed(1)}%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {stats.byStatus.in_progress} testes em andamento
          </Typography>
        </CardContent>
      </Card>

      {/* Gráficos em uma nova linha */}
      <Box sx={{ gridColumn: { xs: '1', md: '1 / span 2' } }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Distribuição de Status
            </Typography>
            <Box sx={{ width: '100%', height: CHART_HEIGHT }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ gridColumn: { xs: '1', md: '3' } }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Histórico de Status
            </Typography>
            <Box sx={{ width: '100%', height: CHART_HEIGHT }}>
              <ResponsiveContainer>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Quantidade">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Gráfico de linha em largura total */}
      <Box sx={{ gridColumn: { xs: '1', md: '1 / span 3' } }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tendência de Resultados
            </Typography>
            <Box sx={{ width: '100%', height: CHART_HEIGHT }}>
              <ResponsiveContainer>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="result"
                    name="Resultado"
                    stroke="#2563EB"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
} 