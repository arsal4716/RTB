const TOKEN_KEY = 'token';
const AGENT_NAME_KEY = 'agentName';
const PUBLISHER_NAME_KEY = 'publisherName';

export const saveAuthData = (token, agentName, publisherName) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(AGENT_NAME_KEY, agentName);
  localStorage.setItem(PUBLISHER_NAME_KEY, publisherName);
};


export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getAgentName = () => localStorage.getItem(AGENT_NAME_KEY);
export const getPublisherName = () => localStorage.getItem(PUBLISHER_NAME_KEY);

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AGENT_NAME_KEY);
  localStorage.removeItem(PUBLISHER_NAME_KEY);
};
