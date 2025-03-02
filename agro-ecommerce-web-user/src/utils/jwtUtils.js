export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const exp = payload.exp * 1000; 
      return Date.now() > exp;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return true; 
    }
  };
  
  export const getToken = () => {
    return localStorage.getItem('token'); 
  };