import axios from 'axios';

const API_BASE_URL = '/api/auth';

/**
 * Interface for Register Request Body
 */
export interface RegisterData {
  companyName: string;
  admin_email: string;
  admin_name: string;
  password: string;
}

/**
 * Interface for Login Request Body
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Calls POST /api/auth/register
 * Creates a new company, admin user, and initial key pair.
 */
export const registerCompany = async (data: RegisterData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Registration failed");
  }
};

/**
 * Calls POST /api/auth/login
 * Authenticates user and returns a JWT token.
 */
export const loginUser = async (data: LoginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Login failed");
  }
};
