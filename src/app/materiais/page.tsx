'use client';

import React, { useState, useEffect } from 'react';
import MaterialDashboard from '@/components/materials/MaterialDashboard';
import { getMaterials, getMaterialStats } from '@/services/materials';
import type { Material, MaterialStats } from '@/types/material';
import {
  Card,
  Typography,
  Button,
  IconButton,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  PlusIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

// Interface para o dashboard
interface DashboardStats {
  total: number;
  porCategoria: { [key: string]: number };
  porStatus: {
    ativo: number;
    inativo: number;
    em_analise: number;
  };
  valorTotal: number;
  quantidadeTotal: number;
  mediaConsumoMensal: number;
  totalCost: number;
  movimentacoes: Array<{
    data: string;
    tipo: string;
    quantidade: number;
    material: string;
  }>;
  consumoMedioMensal: Array<{
    mes: string;
    consumo: number;
  }>;
}

// Base props para os componentes do Material Tailwind
const baseProps = {
  placeholder: "",
  onPointerEnterCapture: () => {},
  onPointerLeaveCapture: () => {},
  crossOrigin: undefined as any,
};

// Mock stats adaptado para o novo formato
const mockStats: DashboardStats = {
  total: 3,
  porCategoria: {
    'Materiais de Construção': 2,
    'Acabamentos': 1
  },
  porStatus: {
    ativo: 2,
    inativo: 0,
    em_analise: 1
  },
  valorTotal: 15000,
  quantidadeTotal: 1550,
  mediaConsumoMensal: 250,
  totalCost: 15000,
  movimentacoes: [
    {
      data: '2024-02-20T10:00:00',
      tipo: 'entrada',
      quantidade: 500,
      material: 'Material A'
    },
    {
      data: '2024-02-19T15:30:00',
      tipo: 'saida',
      quantidade: 200,
      material: 'Material B'
    }
  ],
  consumoMedioMensal: [
    { mes: 'Janeiro', consumo: 250 },
    { mes: 'Fevereiro', consumo: 300 }
  ]
};

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const [materialsData, statsData] = await Promise.all([
        getMaterials(),
        getMaterialStats()
      ]);
      setMaterials(materialsData);
      
      // Adaptar os dados do backend para o formato do dashboard
      const adaptedStats: DashboardStats = {
        ...statsData,
        totalCost: statsData.valorTotal,
        movimentacoes: (statsData.ultimasMovimentacoes || []).map(m => ({
          ...m,
          material: materialsData.find(mat => 
            mat.historico?.some(h => 
              h.data === m.data && h.tipo === m.tipo && h.quantidade === m.quantidade
            )
          )?.nome || 'Material'
        })),
        consumoMedioMensal: [{ mes: 'Total', consumo: statsData.mediaConsumoMensal }],
        porCategoria: statsData.porCategoria || {},
      };

      setStats(adaptedStats);
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'todos' || material.status === selectedStatus;
    const matchesCategory = selectedCategory === 'todas' || material.categoria === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Typography {...baseProps} variant="h5" color="blue-gray">
            Gestão de Materiais
          </Typography>
          <Typography {...baseProps} color="gray" className="mt-1 font-normal">
            Controle e rastreamento de materiais
          </Typography>
        </div>
        <div className="flex gap-4">
          <Button {...baseProps} className="flex items-center gap-2" color="blue">
            <ArrowDownTrayIcon className="h-4 w-4" /> Exportar
          </Button>
          <Button
            {...baseProps}
            className="flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusIcon className="h-4 w-4" /> Adicionar Material
          </Button>
        </div>
      </div>

      {/* Dashboard */}
      <MaterialDashboard stats={stats} />

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Input
          {...baseProps}
          label="Buscar material"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="!border-t-blue-gray-200 focus:!border-t-gray-900"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
        <Select
          {...baseProps}
          label="Status"
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value || 'todos')}
        >
          <Option value="todos">Todos</Option>
          <Option value="ativo">Ativo</Option>
          <Option value="inativo">Inativo</Option>
          <Option value="em_analise">Em Análise</Option>
        </Select>
        <Select
          {...baseProps}
          label="Categoria"
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value || 'todas')}
        >
          <Option value="todas">Todas</Option>
          <Option value="Materiais de Construção">Materiais de Construção</Option>
          <Option value="Acabamentos">Acabamentos</Option>
        </Select>
      </div>

      {/* Tabela */}
      <Card {...baseProps} className="overflow-scroll h-full w-full">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {['Código', 'Nome', 'Categoria', 'Quantidade', 'Status', 'Ações'].map((head) => (
                <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    {...baseProps}
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.map((material) => (
              <tr key={material.id} className="even:bg-blue-gray-50/50">
                <td className="p-4">
                  <Typography {...baseProps} variant="small" color="blue-gray" className="font-normal">
                    {material.codigo}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography {...baseProps} variant="small" color="blue-gray" className="font-normal">
                    {material.nome}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography {...baseProps} variant="small" color="blue-gray" className="font-normal">
                    {material.categoria}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography {...baseProps} variant="small" color="blue-gray" className="font-normal">
                    {material.quantidade} {material.unidade}
                  </Typography>
                </td>
                <td className="p-4">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    material.status === 'ativo' ? 'bg-green-100 text-green-800' :
                    material.status === 'inativo' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {material.status === 'em_analise' ? 'Em Análise' : 
                     material.status.charAt(0).toUpperCase() + material.status.slice(1)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <IconButton {...baseProps} variant="text" color="blue-gray">
                      <ChevronDownIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}