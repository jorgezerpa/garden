import axios from 'axios';

// Assuming this is in the same file or sharing the client from the previous step
const API_BASE_URL = '/api/admin/schemas';
const JWT = 'YOUR_TOKEN_HERE'; 

const schemaClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${JWT}`,
  },
});

/**
 * Interfaces
 */

export interface SchemaDay {
  dayOfWeek: number; // 0-6
  startTime: string;
  endTime: string;
  // Add other specific day properties based on your SchemaController
}

export interface CreateSchemaData {
  name: string;
  type: string;
  days: SchemaDay[];
}

export interface UpdateSchemaData {
  name?: string;
  type?: string;
  days?: SchemaDay[];
}

/**
 * API Calls
 */

// POST /api/admin/schemas/create
export const createSchema = async (data: CreateSchemaData) => {
  const response = await schemaClient.post('/create', data);
  return response.data;
};

// GET /api/admin/schemas/list?page=1&limit=10
export const getSchemasList = async (page: number = 1, limit: number = 10) => {
  const response = await schemaClient.get('/list', {
    params: { page, limit },
  });
  return response.data;
};

// GET /api/admin/schemas/:id
export const getSchemaById = async (id: number) => {
  const response = await schemaClient.get(`/${id}`);
  return response.data;
};

// DELETE /api/admin/schemas/:id
export const deleteSchema = async (id: number) => {
  const response = await schemaClient.delete(`/${id}`);
  return response.data;
};

// PUT /api/admin/schemas/update/:id
export const updateSchema = async (id: number, data: UpdateSchemaData) => {
  const response = await schemaClient.put(`/update/${id}`, data);
  return response.data;
};