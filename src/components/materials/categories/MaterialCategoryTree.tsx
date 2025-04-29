import React, { useState } from 'react';
import {
  TreeView,
  TreeItem,
} from '@mui/x-tree-view';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Tooltip,
} from '@mui/material';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import type { MaterialCategory, MaterialCategoryType } from '@/types/materials';
import { useTranslation } from '@/hooks/useTranslation';

interface MaterialCategoryTreeProps {
  categories: MaterialCategory[];
  onAdd: (category: Omit<MaterialCategory, 'id' | 'path' | 'level'>) => Promise<void>;
  onUpdate: (id: string, category: Partial<Omit<MaterialCategory, 'id' | 'path' | 'level'>>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

interface CategoryItemProps {
  category: MaterialCategory;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onAdd, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action: () => void) => {
    handleClose();
    action();
  };

  return (
    <div
      className="relative flex items-center p-2 hover:bg-gray-50"
      onContextMenu={handleContextMenu}
    >
      <Typography variant="body2" className="ml-2 flex-grow">
        {category.name}
      </Typography>

      <div className="flex items-center space-x-1">
        {category.attributes.isHazardous && (
          <Tooltip title="Material Perigoso">
            <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
          </Tooltip>
        )}
        
        <IconButton size="small" onClick={(e) => {
          e.stopPropagation();
          onAdd();
        }}>
          <PlusIcon className="h-4 w-4" />
        </IconButton>
        
        <IconButton size="small" onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}>
          <PencilIcon className="h-4 w-4" />
        </IconButton>
        
        <IconButton size="small" onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}>
          <TrashIcon className="h-4 w-4" />
        </IconButton>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuAction(onAdd)}>
          Adicionar Subcategoria
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction(onEdit)}>
          Editar Categoria
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction(onDelete)}>
          Excluir Categoria
        </MenuItem>
      </Menu>
    </div>
  );
};

interface MaterialCategoryFormData {
  name: string;
  code: string;
  description: string;
  type: MaterialCategoryType;
  attributes: MaterialCategory['attributes'];
  createdAt: string;
  updatedAt: string;
}

const defaultFormData: MaterialCategoryFormData = {
  name: '',
  code: '',
  description: '',
  type: 'raw',
  attributes: {
    requiresTest: false,
    requiresCertification: false,
    isHazardous: false,
    storageConditions: [],
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function MaterialCategoryTree({
  categories,
  onAdd,
  onUpdate,
  onDelete
}: MaterialCategoryTreeProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<MaterialCategoryFormData>(defaultFormData);

  const handleAdd = (parentId?: string) => {
    setSelectedCategory(parentId ? categories.find(c => c.id === parentId) || null : null);
    setIsEditing(false);
    setFormData({
      ...defaultFormData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsFormOpen(true);
  };

  const handleEdit = (category: MaterialCategory) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setFormData({
      name: category.name,
      code: category.code,
      description: category.description || '',
      type: category.type,
      attributes: category.attributes,
      createdAt: category.createdAt,
      updatedAt: new Date().toISOString(),
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && selectedCategory) {
        await onUpdate(selectedCategory.id, formData);
      } else {
        await onAdd({
          ...formData,
          parentId: selectedCategory?.id,
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const renderTree = (nodes: MaterialCategory[]) => {
    const buildTree = (items: MaterialCategory[]): JSX.Element[] => {
      const rootItems = items.filter(item => !item.parentId);
      
      const buildChildren = (parentId: string): JSX.Element[] => {
        const children = items.filter(item => item.parentId === parentId);
        return children.map(child => (
          <TreeItem
            key={child.id}
            nodeId={child.id}
            label={
              <CategoryItem
                category={child}
                onAdd={() => handleAdd(child.id)}
                onEdit={() => handleEdit(child)}
                onDelete={() => onDelete(child.id)}
              />
            }
          >
            {buildChildren(child.id)}
          </TreeItem>
        ));
      };

      return rootItems.map(item => (
        <TreeItem
          key={item.id}
          nodeId={item.id}
          label={
            <CategoryItem
              category={item}
              onAdd={() => handleAdd(item.id)}
              onEdit={() => handleEdit(item)}
              onDelete={() => onDelete(item.id)}
            />
          }
        >
          {buildChildren(item.id)}
        </TreeItem>
      ));
    };

    return buildTree(nodes);
  };

  return (
    <>
      <Box className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6">
            {t('materials.categories.title')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<PlusIcon className="h-5 w-5" />}
            onClick={() => handleAdd()}
          >
            {t('materials.categories.addRoot')}
          </Button>
        </div>

        <TreeView
          defaultCollapseIcon={<ChevronDownIcon className="h-5 w-5" />}
          defaultExpandIcon={<ChevronRightIcon className="h-5 w-5" />}
          className="border rounded-lg"
        >
          {renderTree(categories)}
        </TreeView>
      </Box>

      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? t('materials.categories.edit') : t('materials.categories.add')}
        </DialogTitle>
        
        <DialogContent>
          <Box className="space-y-4 pt-2">
            <TextField
              fullWidth
              label={t('materials.categories.code')}
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              required
            />
            
            <TextField
              fullWidth
              label={t('materials.categories.name')}
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            
            <TextField
              fullWidth
              label={t('materials.categories.description')}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
            />
            
            <Typography variant="subtitle2" className="mt-4">
              {t('materials.categories.attributes')}
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.attributes.requiresTest}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    attributes: {
                      ...prev.attributes,
                      requiresTest: e.target.checked
                    }
                  }))}
                />
              }
              label={t('materials.categories.requiresTest')}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.attributes.requiresCertification}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    attributes: {
                      ...prev.attributes,
                      requiresCertification: e.target.checked
                    }
                  }))}
                />
              }
              label={t('materials.categories.requiresCertification')}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.attributes.isHazardous}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    attributes: {
                      ...prev.attributes,
                      isHazardous: e.target.checked
                    }
                  }))}
                />
              }
              label={t('materials.categories.isHazardous')}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsFormOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.code || !formData.name}
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 