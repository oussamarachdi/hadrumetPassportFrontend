const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) return {}; 

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};

export { getAuthHeaders };