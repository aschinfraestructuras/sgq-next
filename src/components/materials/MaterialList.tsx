import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Material } from '@/types/materials';
import { MaterialModal } from './MaterialModal';
import { toast } from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDownIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface MaterialListProps {
  materials: Material[];
  loading: boolean;
  error: string | null;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
}

export function MaterialList({ materials, loading, error, onEdit, onDelete }: MaterialListProps) {
  const { t } = useTranslation();
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Material>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleDelete = async (id: string) => {
    if (window.confirm(t('materials.confirmDelete'))) {
      onDelete(id);
    }
  };

  const handleEdit = (material: Material) => {
    onEdit(material);
  };

  const handleSort = (field: keyof Material) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredMaterials = materials
    .filter(material => 
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === 'all' || material.status === filterStatus)
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * direction;
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction;
      }
      return 0;
    });

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Input
            type="text"
            placeholder={t('materials.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <FunnelIcon className="h-4 w-4 mr-2" />
                {t('materials.filter')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                {t('materials.status.all')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                {t('materials.status.active')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>
                {t('materials.status.inactive')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                {t('materials.name')}
                {sortField === 'name' && (
                  <ChevronDownIcon className={`h-4 w-4 inline ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('currentStock')}
              >
                {t('materials.stock')}
                {sortField === 'currentStock' && (
                  <ChevronDownIcon className={`h-4 w-4 inline ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                )}
              </TableHead>
              <TableHead>{t('materials.category')}</TableHead>
              <TableHead>{t('materials.status')}</TableHead>
              <TableHead>{t('materials.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterials.map((material) => (
              <TableRow key={material.id}>
                <TableCell>{material.name}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{material.currentStock}</span>
                    <Badge variant={material.currentStock <= material.reorderPoint ? "destructive" : "default"}>
                      {material.unit}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{material.category?.name}</TableCell>
                <TableCell>
                  <Badge variant={
                    material.status === 'active' ? 'default' :
                    material.status === 'inactive' ? 'secondary' :
                    'destructive'
                  }>
                    {t(`materials.status.${material.status}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedMaterial(material)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(material)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(material.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedMaterial && (
        <MaterialModal
          material={selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
        />
      )}
    </div>
  );
} 