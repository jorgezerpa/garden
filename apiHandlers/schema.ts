import axios from 'axios';
import { BlockType, CreateSchemaData, SchemaBlock, UpdateSchemaData } from "@/types/BlockSchemas"

// Assuming this is in the same file or sharing the client from the previous step
const API_BASE_URL = 'http://localhost:3001/api/schema';
const JWT = 'YOUR_TOKEN_HERE'; 

const schemaClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${JWT}`,
  },
});


/**
 * API Calls
 */

// POST /api/admin/schemas/create
export const createSchema = async (data: CreateSchemaData) => {
  const response = await schemaClient.post('/create', data, getAuthHeader());
  return response.data;
};

// GET /api/admin/schemas/list?page=1&limit=10
export const getSchemasList = async (page: number = 1, limit: number = 10) => {
  const response = await schemaClient.get('/list', {
    ...getAuthHeader(),
    params: { page, limit },
  });
  return response.data;
};

// GET /api/admin/schemas/:id
export const getSchemaById = async (id: number) => {
  const response = await schemaClient.get(`/${id}`, getAuthHeader());
  return response.data;
};

// DELETE /api/admin/schemas/:id
export const deleteSchema = async (id: number) => {
  const response = await schemaClient.delete(`/${id}`, getAuthHeader());
  return response.data;
};

// PUT /api/admin/schemas/update/:id
export const updateSchema = async (id: number, data: UpdateSchemaData) => {
  const response = await schemaClient.put(`/update/${id}`, data, getAuthHeader());
  return response.data;
};

// getSchemaAssignations, upsertSchemaAssignation, deleteSchemaAssignationById
export const getSchemaAssignations = async(from: string, to: string) => {
  const response = await schemaClient.get('/assignation', {
    ...getAuthHeader(),
    params: { from, to },
  });
  return response.data;
}

export const upsertSchemaAssignation = async(date: string, id: number) => {
  const response = await schemaClient.post('/upsert-assignation', { date, schemaId:id }, getAuthHeader());
  return response.data;
}

export const deleteSchemaAssignationById = async(id: number) => {
  const response = await schemaClient.delete(`/delete-assignation-by-id/${id}`, getAuthHeader());
  return response.data;
}

///////////////////
///////////////////
function getAuthHeader() {
  const token = localStorage.getItem('jwt');
  if(!token) {
    console.log("error") // @todo make this function an utility
    // throw new Error("Unauthorized")
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};