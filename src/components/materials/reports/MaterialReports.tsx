import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMaterials } from '@/hooks/useMaterials';
import { toast } from 'sonner';
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
  DocumentArrowDownIcon,
  DocumentChartBarIcon,
  DocumentTextIcon,
  PrinterIcon,
  CalendarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface MaterialReportsProps {
  onClose?: () => void;
}

interface Material {
  id: string;
  name: string;
  type: string;
  category: string;
  stock: number;
  supplier: string;
  cost: number;
  status: string;
}

interface Movement {
  id: string;
  materialId: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
}

interface Test {
  id: string;
  materialId: string;
  type: string;
  result: 'pass' | 'fail';
  date: string;
}

interface Certification {
  id: string;
  materialId: string;
  type: string;
  expiryDate: string;
  status: string;
}

export default function MaterialReports({ onClose }: MaterialReportsProps) {
  const { t } = useTranslation();
  const { materials, loading } = useMaterials();
  const [reportType, setReportType] = useState<string>('stock');
  const [materialType, setMaterialType] = useState<string>('all');
  const [category, setCategory] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  const handleGenerateReport = () => {
    try {
      let report;
      switch (reportType) {
        case 'stock':
          report = generateStockReport(materials);
          break;
        case 'movements':
          report = generateMovementsReport(materials);
          break;
        case 'tests':
          report = generateTestsReport(materials);
          break;
        case 'certifications':
          report = generateCertificationsReport(materials);
          break;
        case 'cost':
          report = generateCostReport(materials);
          break;
        default:
          report = generateStockReport(materials);
      }
      setGeneratedReport(report);
      toast(t('reports.success.generated'));
    } catch (error) {
      toast(t('reports.errors.generationFailed'));
    }
  };

  const generateStockReport = (materials: any[]) => {
    const filteredMaterials = materials.filter(material => {
      if (materialType !== 'all' && material.type !== materialType) return false;
      if (category !== 'all' && material.category !== category) return false;
      if (status !== 'all' && material.status !== status) return false;
      return true;
    });

    return {
      title: t('materials.reports.types.stock'),
      date: format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      summary: {
        totalMaterials: filteredMaterials.length,
        totalValue: filteredMaterials.reduce((acc, curr) => acc + (curr.cost * curr.currentStock), 0),
        lowStock: filteredMaterials.filter(m => m.currentStock <= m.reorderPoint).length,
        outOfStock: filteredMaterials.filter(m => m.currentStock === 0).length,
      },
      data: filteredMaterials,
    };
  };

  const generateMovementsReport = (materials: any[]) => {
    // Implementation for movements report
    return {
      title: t('materials.reports.types.movements'),
      date: format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      period: `${format(new Date(dateRange.start), 'dd/MM/yyyy', { locale: ptBR })} - ${format(new Date(dateRange.end), 'dd/MM/yyyy', { locale: ptBR })}`,
      summary: {
        totalMovements: 0,
        entries: 0,
        exits: 0,
        adjustments: 0,
      },
      data: [],
    };
  };

  const generateTestsReport = (materials: any[]) => {
    // Implementation for tests report
    return {
      title: t('materials.reports.types.tests'),
      date: format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      period: `${format(new Date(dateRange.start), 'dd/MM/yyyy', { locale: ptBR })} - ${format(new Date(dateRange.end), 'dd/MM/yyyy', { locale: ptBR })}`,
      summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        pending: 0,
      },
      data: [],
    };
  };

  const generateCertificationsReport = (materials: any[]) => {
    // Implementation for certifications report
    return {
      title: t('materials.reports.types.certifications'),
      date: format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      summary: {
        totalCertifications: 0,
        valid: 0,
        expired: 0,
        expiringSoon: 0,
      },
      data: [],
    };
  };

  const generateCostReport = (materials: any[]) => {
    const filteredMaterials = materials.filter(material => {
      if (materialType !== 'all' && material.type !== materialType) return false;
      if (category !== 'all' && material.category !== category) return false;
      if (status !== 'all' && material.status !== status) return false;
      return true;
    });

    const costs = filteredMaterials.map(m => m.cost * m.currentStock);
    return {
      title: t('materials.reports.types.cost'),
      date: format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      summary: {
        totalMaterials: filteredMaterials.length,
        totalValue: costs.reduce((acc, curr) => acc + curr, 0),
        averageCost: costs.reduce((acc, curr) => acc + curr, 0) / filteredMaterials.length,
        highestValue: Math.max(...costs),
      },
      data: filteredMaterials,
    };
  };

  const handleExportPDF = async () => {
    try {
      // PDF export logic here
      toast.success("Relatório exportado com sucesso")
    } catch (error) {
      toast.error("Erro ao exportar relatório")
    }
  };

  const handleExportExcel = async () => {
    try {
      // Excel export logic here
      toast.success("Relatório exportado com sucesso")
    } catch (error) {
      toast.error("Erro ao exportar relatório")
    }
  };

  const handlePrint = async () => {
    try {
      // Print logic here
      toast.success("Relatório enviado para impressão")
    } catch (error) {
      toast.error("Erro ao imprimir relatório")
    }
  };

  const renderReportContent = () => {
    if (!generatedReport) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-muted-foreground">
            {t('materials.reports.selectAndGenerate')}
          </p>
        </div>
      );
    }

    switch (reportType) {
      case 'stock':
        return renderStockReport();
      case 'movements':
        return renderMovementsReport();
      case 'tests':
        return renderTestsReport();
      case 'certifications':
        return renderCertificationsReport();
      case 'cost':
        return renderCostReport();
      default:
        return renderStockReport();
    }
  };

  const renderStockReport = () => {
    if (!generatedReport) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {t('materials.reports.summary.totalMaterials')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {generatedReport.summary.totalMaterials}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {t('materials.reports.summary.totalValue')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(generatedReport.summary.totalValue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {t('materials.reports.summary.lowStock')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {generatedReport.summary.lowStock}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {t('materials.reports.summary.outOfStock')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {generatedReport.summary.outOfStock}
              </div>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('materials.reports.table.name')}</TableHead>
              <TableHead>{t('materials.reports.table.type')}</TableHead>
              <TableHead>{t('materials.reports.table.category')}</TableHead>
              <TableHead>{t('materials.reports.table.stock')}</TableHead>
              <TableHead>{t('materials.reports.table.minStock')}</TableHead>
              <TableHead>{t('materials.reports.table.maxStock')}</TableHead>
              <TableHead>{t('materials.reports.table.status')}</TableHead>
              <TableHead>{t('materials.reports.table.location')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {generatedReport.data.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{t(`materials.types.${item.type}`)}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <span className={item.currentStock <= item.minStock ? 'text-red-600' : ''}>
                    {item.currentStock} {item.unit}
                  </span>
                </TableCell>
                <TableCell>{item.minStock} {item.unit}</TableCell>
                <TableCell>{item.maxStock} {item.unit}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'active' ? 'bg-green-100 text-green-800' :
                    item.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {t(`materials.status.${item.status}`)}
                  </span>
                </TableCell>
                <TableCell>{item.location || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderMovementsReport = () => {
    if (!generatedReport) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.totalMovements')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold">
                {generatedReport.summary.totalMovements}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.entries')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold text-green-600">
                {generatedReport.summary.entries}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.exits')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold text-red-600">
                {generatedReport.summary.exits}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.adjustments')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold text-blue-600">
                {generatedReport.summary.adjustments}
              </div>
            </CardContent>
          </Card>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>{t('materials.reports.table.date')}</TableHead>
              <TableHead>{t('materials.reports.table.material')}</TableHead>
              <TableHead>{t('materials.reports.table.type')}</TableHead>
              <TableHead>{t('materials.reports.table.quantity')}</TableHead>
              <TableHead>{t('materials.reports.table.document')}</TableHead>
              <TableHead>{t('materials.reports.table.reason')}</TableHead>
              <TableHead>{t('materials.reports.table.responsible')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {generatedReport.data.map((item: any, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  {format(new Date(item.data), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell>{item.materialName}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.tipo === 'entrada' ? 'bg-green-100 text-green-800' :
                    item.tipo === 'saida' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {t(`materials.movements.${item.tipo}`)}
                  </span>
                </TableCell>
                <TableCell>{item.quantidade}</TableCell>
                <TableCell>{item.documento || '-'}</TableCell>
                <TableCell>{item.observacao || '-'}</TableCell>
                <TableCell>{item.responsavel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderTestsReport = () => {
    if (!generatedReport) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.totalTests')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold">
                {generatedReport.summary.totalTests}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.passed')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold text-green-600">
                {generatedReport.summary.passed}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.failed')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold text-red-600">
                {generatedReport.summary.failed}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.pending')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold text-yellow-600">
                {generatedReport.summary.pending}
              </div>
            </CardContent>
          </Card>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>{t('materials.reports.table.date')}</TableHead>
              <TableHead>{t('materials.reports.table.material')}</TableHead>
              <TableHead>{t('materials.reports.table.test')}</TableHead>
              <TableHead>{t('materials.reports.table.result')}</TableHead>
              <TableHead>{t('materials.reports.table.tester')}</TableHead>
              <TableHead>{t('materials.reports.table.notes')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {generatedReport.data.map((item: any, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  {format(new Date(item.data), "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>{item.materialName}</TableCell>
                <TableCell>{item.nome}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'passed' ? 'bg-green-100 text-green-800' :
                    item.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t(`materials.tests.status.${item.status}`)}
                  </span>
                </TableCell>
                <TableCell>{item.responsavel}</TableCell>
                <TableCell>{item.observacoes || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderCertificationsReport = () => {
    if (!generatedReport) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.totalCertifications')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold">
                {generatedReport.summary.totalCertifications}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.valid')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold text-green-600">
                {generatedReport.summary.valid}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.expired')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold text-red-600">
                {generatedReport.summary.expired}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.expiringSoon')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold text-yellow-600">
                {generatedReport.summary.expiringSoon}
              </div>
            </CardContent>
          </Card>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>{t('materials.reports.table.material')}</TableHead>
              <TableHead>{t('materials.reports.table.certification')}</TableHead>
              <TableHead>{t('materials.reports.table.issuer')}</TableHead>
              <TableHead>{t('materials.reports.table.issueDate')}</TableHead>
              <TableHead>{t('materials.reports.table.expiryDate')}</TableHead>
              <TableHead>{t('materials.reports.table.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {generatedReport.data.map((item: any, index: number) => {
              const expiryDate = new Date(item.expiryDate);
              const now = new Date();
              const thirtyDaysFromNow = new Date();
              thirtyDaysFromNow.setDate(now.getDate() + 30);
              
              let status = 'valid';
              if (expiryDate <= now) {
                status = 'expired';
              } else if (expiryDate <= thirtyDaysFromNow) {
                status = 'expiringSoon';
              }
              
              return (
                <TableRow key={index}>
                  <TableCell>{item.materialName}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.emissor}</TableCell>
                  <TableCell>
                    {format(new Date(item.dataEmissao), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {format(expiryDate, "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      status === 'valid' ? 'bg-green-100 text-green-800' :
                      status === 'expired' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {t(`materials.certifications.status.${status}`)}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderCostReport = () => {
    if (!generatedReport) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.totalMaterials')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold">
                {generatedReport.summary.totalMaterials}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.totalValue')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(generatedReport.summary.totalValue)}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.averageCost')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(generatedReport.summary.averageCost)}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-sm font-medium">
              {t('materials.reports.summary.highestValue')}
            </CardTitle>
            <CardContent className="mt-2">
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(generatedReport.summary.highestValue)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>{t('materials.reports.table.name')}</TableHead>
              <TableHead>{t('materials.reports.table.type')}</TableHead>
              <TableHead>{t('materials.reports.table.category')}</TableHead>
              <TableHead>{t('materials.reports.table.cost')}</TableHead>
              <TableHead>{t('materials.reports.table.stock')}</TableHead>
              <TableHead>{t('materials.reports.table.totalValue')}</TableHead>
              <TableHead>{t('materials.reports.table.lastPurchase')}</TableHead>
              <TableHead>{t('materials.reports.table.supplier')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {generatedReport.data.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{t(`materials.types.${item.type}`)}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.cost)}
                </TableCell>
                <TableCell>{item.currentStock}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.totalValue)}
                </TableCell>
                <TableCell>
                  {item.lastPurchaseDate ? format(new Date(item.lastPurchaseDate), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                </TableCell>
                <TableCell>{item.supplier || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {t('materials.reports.title')}
        </h2>
        {generatedReport && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleExportPDF}
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              {t('materials.reports.actions.exportPDF')}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportExcel}
            >
              <DocumentChartBarIcon className="h-5 w-5 mr-2" />
              {t('materials.reports.actions.exportExcel')}
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
            >
              <PrinterIcon className="h-5 w-5 mr-2" />
              {t('materials.reports.actions.print')}
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('materials.reports.filters.reportType')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              value={reportType}
              onValueChange={setReportType}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('materials.reports.types.stock')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stock">{t('materials.reports.types.stock')}</SelectItem>
                <SelectItem value="movements">{t('materials.reports.types.movements')}</SelectItem>
                <SelectItem value="tests">{t('materials.reports.types.tests')}</SelectItem>
                <SelectItem value="certifications">{t('materials.reports.types.certifications')}</SelectItem>
                <SelectItem value="cost">{t('materials.reports.types.cost')}</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={materialType}
              onValueChange={setMaterialType}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('common.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="raw">{t('materials.types.raw')}</SelectItem>
                <SelectItem value="component">{t('materials.types.component')}</SelectItem>
                <SelectItem value="finished">{t('materials.types.finished')}</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('common.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                {/* Add categories dynamically */}
              </SelectContent>
            </Select>

            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('common.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="active">{t('materials.status.active')}</SelectItem>
                <SelectItem value="inactive">{t('materials.status.inactive')}</SelectItem>
                <SelectItem value="discontinued">{t('materials.status.discontinued')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(reportType === 'movements' || reportType === 'tests') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium">
                  {t('materials.reports.filters.startDate')}
                </label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {t('materials.reports.filters.endDate')}
                </label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleGenerateReport}
              disabled={loading}
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              {t('materials.reports.actions.generate')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedReport && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{generatedReport.title}</CardTitle>
              <CardDescription>
                {t('materials.reports.generatedOn')}: {generatedReport.date}
                {generatedReport.period && ` - ${t('materials.reports.period')}: ${generatedReport.period}`}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {renderReportContent()}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 