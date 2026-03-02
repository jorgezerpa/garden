import axios from 'axios';

const API_BASE_URL = '/api/datavis';
const JWT = 'YOUR_TOKEN_HERE'; 

const visClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${JWT}`,
  },
});

/**
 * API Calls
 */

// GET /api/datavis/daily-activity
export const getDailyActivity = async (from: string, to: string) => {
  const response = await visClient.get('/daily-activity', {
    params: { from, to },
  });
  return response.data;
};

// GET /api/datavis/block-performance
export const getBlockPerformance = async (schemaId: number, from: string, to: string) => {
  const response = await visClient.get('/block-performance', {
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
    params: { schemaId, from, to, fromDayIndex, toDayIndex },
  });
  return response.data;
};

// GET /api/datavis/long-call-distribution
export const getLongCallDistribution = async (from: string, to: string) => {
  const response = await visClient.get('/long-call-distribution', {
    params: { from, to },
  });
  return response.data;
};

// GET /api/datavis/seed-timeline-heatmap
export const getSeedTimelineHeatmap = async (from: string, to: string) => {
  const response = await visClient.get('/seed-timeline-heatmap', {
    params: { from, to },
  });
  return response.data;
};

// GET /api/datavis/conversion-funnel
export const getConversionFunnel = async (from: string, to: string) => {
  const response = await visClient.get('/conversion-funnel', {
    params: { from, to },
  });
  return response.data;
};

// GET /api/datavis/consistency-streak
export const getConsistencyStreak = async (goalId: number, from: string, to: string) => {
  const response = await visClient.get('/consistency-streak', {
    params: { goalId, from, to },
  });
  return response.data;
};