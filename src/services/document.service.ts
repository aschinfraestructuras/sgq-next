'use client';

import { Document, DocumentStatus, DocumentType } from '@/types';
import api from './api';

export class DocumentService {
  static async getAll(params?: {
    status?: DocumentStatus;
    type?: DocumentType;
    department?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ documents: Document[]; total: number }> {
    const response = await api.get('/documents', { params });
    return response.data;
  }

  static async getById(id: string): Promise<Document> {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  }

  static async create(data: Omit<Document, 'id' | 'createdAt'>): Promise<Document> {
    const response = await api.post('/documents', data);
    return response.data;
  }

  static async update(id: string, data: Partial<Document>): Promise<Document> {
    const response = await api.put(`/documents/${id}`, data);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/documents/${id}`);
  }

  static async changeStatus(id: string, status: DocumentStatus): Promise<Document> {
    const response = await api.put(`/documents/${id}/status`, { status });
    return response.data;
  }

  static async getVersions(id: string): Promise<Document[]> {
    const response = await api.get(`/documents/${id}/versions`);
    return response.data;
  }

  static async createVersion(id: string, data: Partial<Document>): Promise<Document> {
    const response = await api.post(`/documents/${id}/versions`, data);
    return response.data;
  }

  static async addComment(id: string, comment: string): Promise<void> {
    await api.post(`/documents/${id}/comments`, { comment });
  }

  static async getComments(id: string): Promise<Array<{
    id: string;
    text: string;
    createdBy: string;
    createdAt: Date;
  }>> {
    const response = await api.get(`/documents/${id}/comments`);
    return response.data;
  }

  static async uploadAttachment(id: string, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    await api.post(`/documents/${id}/attachments`, formData, {
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
    const response = await api.get(`/documents/${id}/attachments`);
    return response.data;
  }
} 