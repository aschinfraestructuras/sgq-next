import React, { useState, useEffect } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DocumentIcon,
  DocumentArrowDownIcon,
  DocumentPlusIcon,
  DocumentMagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from '@/hooks/useTranslation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Document } from '@/types/documentation';
import { getDocuments } from '@/services/documentation';
import { Badge } from "@/components/ui/badge";

export default function DocumentList() {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: [] as string[],
    status: [] as string[],
    category: '',
    search: '',
  });

  useEffect(() => {
    loadDocuments();
  }, [filters]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await getDocuments({
        type: filters.type.length > 0 ? filters.type : undefined,
        status: filters.status.length > 0 ? filters.status : undefined,
        category: filters.category || undefined,
      });
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      // Implementar notificação de erro
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'published':
        return 'bg-blue-100 text-blue-800';
      case 'obsolete':
        return 'bg-red-100 text-red-800';
      case 'archived':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {t('documentation.title')}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {t('documentation.description')}
          </p>
        </div>
        <Button
          variant="default"
          className="flex items-center"
          onClick={() => {/* Implementar criação */}}
        >
          <DocumentPlusIcon className="h-5 w-5 mr-2" />
          {t('documentation.actions.create')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('documentation.filters.title')}</CardTitle>
          <CardDescription>{t('documentation.filters.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder={t('documentation.filters.search')}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full"
                icon={<DocumentMagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
            <div>
              <Select
                value={filters.type.join(',')}
                onValueChange={(value) => setFilters({ ...filters, type: value.split(',').filter(Boolean) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('documentation.filters.type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="procedure">{t('documentation.types.procedure')}</SelectItem>
                  <SelectItem value="instruction">{t('documentation.types.instruction')}</SelectItem>
                  <SelectItem value="manual">{t('documentation.types.manual')}</SelectItem>
                  <SelectItem value="form">{t('documentation.types.form')}</SelectItem>
                  <SelectItem value="record">{t('documentation.types.record')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={filters.status.join(',')}
                onValueChange={(value) => setFilters({ ...filters, status: value.split(',').filter(Boolean) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('documentation.filters.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t('documentation.status.draft')}</SelectItem>
                  <SelectItem value="review">{t('documentation.status.review')}</SelectItem>
                  <SelectItem value="approved">{t('documentation.status.approved')}</SelectItem>
                  <SelectItem value="published">{t('documentation.status.published')}</SelectItem>
                  <SelectItem value="obsolete">{t('documentation.status.obsolete')}</SelectItem>
                  <SelectItem value="archived">{t('documentation.status.archived')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('documentation.filters.category')} />
                </SelectTrigger>
                <SelectContent>
                  {/* Implementar categorias dinâmicas */}
                  <SelectItem value="quality">{t('documentation.categories.quality')}</SelectItem>
                  <SelectItem value="procedures">{t('documentation.categories.procedures')}</SelectItem>
                  <SelectItem value="forms">{t('documentation.categories.forms')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('documentation.table.code')}</TableHead>
                <TableHead>{t('documentation.table.title')}</TableHead>
                <TableHead>{t('documentation.table.type')}</TableHead>
                <TableHead>{t('documentation.table.category')}</TableHead>
                <TableHead>{t('documentation.table.version')}</TableHead>
                <TableHead>{t('documentation.table.status')}</TableHead>
                <TableHead>{t('documentation.table.updatedAt')}</TableHead>
                <TableHead className="text-right">{t('documentation.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{doc.code}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <DocumentIcon className="h-5 w-5 text-gray-400" />
                      <span>{doc.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {t(`documentation.types.${doc.type}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>{doc.category.name}</TableCell>
                  <TableCell>{doc.currentVersion}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(doc.status)}>
                      {t(`documentation.status.${doc.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(doc.updatedAt.toDate(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* Implementar visualização */}}
                      >
                        <DocumentMagnifyingGlassIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* Implementar download */}}
                      >
                        <DocumentArrowDownIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {documents.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-gray-500">
                      <DocumentIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm">
                        {t('documentation.empty')}
                      </p>
                      <Button
                        variant="link"
                        onClick={() => {/* Implementar criação */}}
                        className="mt-2"
                      >
                        {t('documentation.actions.createFirst')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 