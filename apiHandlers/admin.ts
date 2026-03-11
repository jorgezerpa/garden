import axios from 'axios';
import { GoalData } from '@/types/Goals';

// http://localhost:3001/api...
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/admin`;
const JWT = 'YOUR_TOKEN_HERE'; // Temporary placeholder for your token logic

// Configure axios defaults for this file
const adminClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${JWT}`,
  },
});

/**
 * MANAGERS
 */

export interface CreateManagerData {
  email: string;
  name: string;
  password: string;
}

export interface UpdateManagerData {
  name?: string;
  email?: string;
  password?: string
}

export interface CreateAgentData {
  email: string;
  name: string;
  password: string;
  leadDeskId: string
}

export interface UpdateAgentData {
  name?: string;
  email?: string;
  password?: string;
  leadDeskId?: string
}

export const saveLeadDeskAuthString = async (authString: string) => {
  const response = await adminClient.post('/upsertLeadDeskAPIAuthString', { authString },getAuthHeader());
  return response.data;
};

// check if a auth string was already registered
export const getLeadDeskAuthString = async () => {
  const response = await adminClient.get('/getLeadDeskAPIAuthString', getAuthHeader());
  return response.data;
};

export const addManager = async (data: CreateManagerData) => {
  const response = await adminClient.post('/addManager', data,getAuthHeader());
  return response.data;
};

export const editManager = async (id: number, data: UpdateManagerData) => {
  const response = await adminClient.put(`/editManager/${id}`, data, getAuthHeader());
  return response.data;
};

export const getManager = async (id: number) => {
  const response = await adminClient.get(`/getManager/${id}`, getAuthHeader());
  return response.data;
};

export const getManagersList = async (page: number = 1, limit: number = 10) => {
  const response = await adminClient.get('/getManagersList', {
    ...getAuthHeader(),
    params: { page, limit },
  });
  return response.data;
};

export const removeManager = async (id: number) => {
  const response = await adminClient.delete(`/removeManagers/${id}`, getAuthHeader());
  return response.data;
};

/**
 * AGENTS
 */

export const addAgent = async (data: CreateAgentData) => {
  const response = await adminClient.post('/addAgent', data, getAuthHeader());
  return response.data;
};

export const editAgent = async (id: number, data: UpdateAgentData) => {
  const response = await adminClient.put(`/editAgent/${id}`, data, getAuthHeader());
  return response.data;
};

export const getAgent = async (id: number) => {
  const response = await adminClient.get(`/getAgent/${id}`, getAuthHeader());
  return response.data;
};

export const getAgentsList = async (page: number = 1, limit: number = 10) => {
  const response = await adminClient.get('/getAgentsList', {
    ...getAuthHeader(),
    params: { page, limit },
  });
  return response.data;
};

export const removeAgent = async (id: number) => {
  const response = await adminClient.delete(`/removeAgent/${id}`, getAuthHeader());
  return response.data;
};

/**
 * GOALS
 */



export const createGoal = async (data: GoalData) => {
  const response = await adminClient.post('/goals/create', data, getAuthHeader());
  return response.data;
};

export const getCompanyGoals = async () => {
  const response = await adminClient.get('/goals/company', {
    ...getAuthHeader(),
  });
  return response.data;
};

export const updateGoal = async (id: number, data: Partial<GoalData>) => {
  const response = await adminClient.put(`/goals/update/${id}`, data, getAuthHeader());
  return response.data;
};

export const deleteGoal = async (id: number) => {
  const response = await adminClient.delete(`/goals/delete/${id}`, getAuthHeader());
  return response.data;
};

/**
 * GOAL ASSIGNATIONS
 */

export const getAssignations = async (from: string, to: string) => {
  const response = await adminClient.get('/assignation', {
    ...getAuthHeader(),
    params: { from, to },
  });
  return response.data;
};

export const upsertAssignation = async (date: string, goalId: number) => {
  const response = await adminClient.post('/upsert-assignation', { date, goalId }, getAuthHeader());
  return response.data;
};

export const deleteAssignationById = async (id: number) => {
  const response = await adminClient.delete(`/delete-assignation-by-id/${id}`, getAuthHeader());
  return response.data;
};

export const deleteAssignationByDate = async (date: string) => {
  const response = await adminClient.delete('/delete-assignation-by-date', {
    ...getAuthHeader(),
    params: { date },
  });
  return response.data;
};

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