import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/shared-screen`;

const officeDisplayClient = axios.create({
  baseURL: API_BASE_URL, 
});


// GET /api/datavis/get-agents-comparisson
export const getAgentsPositions = async (date: string, timegap: "daily"|"weekly") => {
  const response = await officeDisplayClient.get('/get_agents_positions', {
    ...getAuthHeader(),
    params: { date, timegap, page:1, pageSize:50 },
  });
  return response.data?.data || []
};

// GET /api/datavis/get-agents-comparisson
export const getTeamHeat = async (yymmdd:string) => {
  const response = await officeDisplayClient.get('/get_team_heat', {
    ...getAuthHeader(),
    params: { date:yymmdd },
  });
  return response.data
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