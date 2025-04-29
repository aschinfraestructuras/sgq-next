'use client';

import { NonConformity, NCStatus, NCSeverity, NCAction, NCVerification } from '@/types';
import api from './api';

export class NonConformityService {
  static async getAll(params?: {
    status?: NCStatus;
    severity?: NCSeverity;
    department?: string;
    search?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ nonconformities: NonConformity[]; total: number }> {
    const response = await api.get('/nonconformities', { params });
    return response.data;
  }

  static async getById(id: string): Promise<NonConformity> {
    const response = await api.get(`/nonconformities/${id}`);
    return response.data;
  }

  static async create(data: Omit<NonConformity, 'id' | 'reportedAt'>): Promise<NonConformity> {
    const response = await api.post('/nonconformities', data);
    return response.data;
  }

  static async update(id: string, data: Partial<NonConformity>): Promise<NonConformity> {
    const response = await api.put(`/nonconformities/${id}`, data);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/nonconformities/${id}`);
  }

  static async changeStatus(id: string, status: NCStatus): Promise<NonConformity> {
    const response = await api.put(`/nonconformities/${id}/status`, { status });
    return response.data;
  }

  // Ações Corretivas/Preventivas
  static async addAction(id: string, action: Omit<NCAction, 'id'>): Promise<NCAction> {
    const response = await api.post(`/nonconformities/${id}/actions`, action);
    return response.data;
  }

  static async updateAction(id: string, actionId: string, data: Partial<NCAction>): Promise<NCAction> {
    const response = await api.put(`/nonconformities/${id}/actions/${actionId}`, data);
    return response.data;
  }

  static async deleteAction(id: string, actionId: string): Promise<void> {
    await api.delete(`/nonconformities/${id}/actions/${actionId}`);
  }

  // Verificações
  static async addVerification(id: string, verification: Omit<NCVerification, 'id'>): Promise<NCVerification> {
    const response = await api.post(`/nonconformities/${id}/verifications`, verification);
    return response.data;
  }

  static async updateVerification(id: string, verificationId: string, data: Partial<NCVerification>): Promise<NCVerification> {
    const response = await api.put(`/nonconformities/${id}/verifications/${verificationId}`, data);
    return response.data;
  }

  static async deleteVerification(id: string, verificationId: string): Promise<void> {
    await api.delete(`/nonconformities/${id}/verifications/${verificationId}`);
  }

  // Análise de Causa Raiz
  static async updateRootCause(id: string, rootCause: string): Promise<NonConformity> {
    const response = await api.put(`/nonconformities/${id}/root-cause`, { rootCause });
    return response.data;
  }

  // Anexos
  static async uploadAttachment(id: string, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    await api.post(`/nonconformities/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static async getAttachments(id: string): Promise<Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    uploadedAt: Date;
  }>> {
    const response = await api.get(`/nonconformities/${id}/attachments`);
    return response.data;
  }

  static async deleteAttachment(id: string, attachmentId: string): Promise<void> {
    await api.delete(`/nonconformities/${id}/attachments/${attachmentId}`);
  }

  // Relatórios e Análises
  static async getStatistics(params?: {
    startDate?: Date;
    endDate?: Date;
    department?: string;
  }): Promise<{
    total: number;
    byStatus: Record<NCStatus, number>;
    bySeverity: Record<NCSeverity, number>;
    byDepartment: Record<string, number>;
    averageResolutionTime: number;
    recurrentIssues: Array<{
      issue: string;
      count: number;
    }>;
  }> {
    const response = await api.get('/nonconformities/statistics', { params });
    return response.data;
  }
} 