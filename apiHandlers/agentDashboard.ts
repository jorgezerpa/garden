import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/agent-dashboard`;
const JWT = 'YOUR_TOKEN_HERE'; 

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${JWT}`,
  },
});


export const getAgentDayInsights = async (date: string) => {
  const response = await client.get('/get-agent-day-insights', {
    ...getAuthHeader(),
    params: { date },
  });
  return response.data;
};

export const getAgentWeeklyGrowth = async (date: string) => {
  const response = await client.get('/get-agent-weekly-growth', {
    ...getAuthHeader(),
    params: { date },
  });
  return response.data;
};

export const getAssignedSchema = async (date: string) => {
  const response = await client.get('/get-assigned-schema', {
    ...getAuthHeader(),
    params: { date },
  });
  return response.data;
};

export const registerAgentState = async (energy: number, focus: number, motivation: number) => {
  const response = await client.post('/register-agent-state', { energy, focus, motivation }, getAuthHeader());
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



/*
Of specific user:
{
    seeds: Number-total seeds of the day,
    leads: number-total leads of the day,
    sales: number-total sales of the day,
    currentStreak: number from 0 to 100 - you check goals assignation table, and then goes like : (currentSeeds/goalSeeds)*100, (currentCallbacks/goalCallabcks)*100...then the average of all % is the streak. If no goal assignation, then return 100. 
    number_of_calls: number , total calls of the day,
    number_of_deep_call: is obvious, a deep call is a +5min call, 
    //
    energy,
    focus,
    motivation,
    talkTime: Sum the total time of all calls for the current day 
}

---------
weekly growth:
- array like [{ day: 'Mon', growth: 40 }]
- We use a weighted summatory to measure growth. So growth = seeds + (leads*2) + (sales*3) + number_of_calls + number_of_deep_calls*2

--------------
*/