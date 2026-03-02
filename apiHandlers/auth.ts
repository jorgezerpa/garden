import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/auth';


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
    // { companyId: company.id, userId: user.id, publicKey, secretKey }
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
    // { message: "Login successful", token, user: { id: user.id,role: user.role,companyId: user.companyId}
    const response = await axios.post(`${API_BASE_URL}/login`, data);
    
    const { token } = response.data;

    if (token) {
      // Store the JWT string in the browser's localStorage
      localStorage.setItem('jwt', token);
      
      // Optional: Store user info for quick UI access (non-sensitive)
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Login failed");
  }
};

// Not http req, should be moved to another file like a helper
export const logoutUser = (path: string) => {
  // 1. Remove the specific items from localStorage
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');

  // 2. Optional: Clear EVERYTHING in localStorage (Use with caution)
  // localStorage.clear(); 

  // 3. Redirect the user to the login page
  // If using window.location, it performs a full page refresh which 
  // is great for clearing out any sensitive data left in memory (RAM).
  window.location.href = path; // @todo should receive redirection path as a param, cause is diff for managers or normal users
};
