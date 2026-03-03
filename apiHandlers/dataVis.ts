import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/datavis';
const JWT = 'YOUR_TOKEN_HERE'; 

const visClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${JWT}`,
  },
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('jwt'); // Or your specific key name
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

/**
 * API Calls
 */

// GET /api/datavis/daily-activity
export const getDailyActivity = async (from: string, to: string) => {
  // /api/datavis/daily-activity
  const response = await visClient.get('/daily-activity', {
    ...getAuthHeader(),
    params: { from, to },
  });
  return response.data;
};

// GET /api/datavis/block-performance
export const getBlockPerformance = async (schemaId: number, from: string, to: string) => {
  const response = await visClient.get('/block-performance', {
    ...getAuthHeader(),
    params: { schemaId, from, to },
  });
  return response.data;
};

// GET /api/datavis/block-performance-filtered
export const getBlockPerformanceFiltered = async (
  schemaId: number, 
  from: string, 
  to: string, 
  fromDayIndex: number, 
  toDayIndex: number
) => {
  const response = await visClient.get('/block-performance-filtered', {
    ...getAuthHeader(),
    params: { schemaId, from, to, fromDayIndex, toDayIndex },
  });
  return response.data;
};

// GET /api/datavis/long-call-distribution
export const getLongCallDistribution = async (from: string, to: string) => {
  const response = await visClient.get('/long-call-distribution', {
    ...getAuthHeader(),
    params: { from, to },
  });
  return response.data;
};

// GET /api/datavis/seed-timeline-heatmap
export const getSeedTimelineHeatmap = async (from: string, to: string) => {
  const response = await visClient.get('/seed-timeline-heatmap', {
    ...getAuthHeader(),
    params: { from, to },
  });
  return response.data;
};

// GET /api/datavis/conversion-funnel
export const getConversionFunnel = async (from: string, to: string) => {
  const response = await visClient.get('/conversion-funnel', {
    ...getAuthHeader(),
    params: { from, to },
  });
  return response.data;
};

// GET /api/datavis/consistency-streak
export const getConsistencyStreak = async (goalId: number, from: string, to: string) => {
  const response = await visClient.get('/consistency-streak', {
    ...getAuthHeader(),
    params: { goalId, from, to },
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