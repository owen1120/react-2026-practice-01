import { useState, useEffect } from 'react';
import axios from 'axios';

import LoginPage from './pages/LoginPage';
import ProductPage from './pages/ProductPage';

const API_BASE = import.meta.env.VITE_API_BASE;

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const getToken = () => {
      return document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1",
      );
    };

    const checkLogin = async (token) => {
      try {
        axios.defaults.headers.common['Authorization'] = token;
        await axios.post(`${API_BASE}/api/user/check`);
        setIsAuth(true);
      } catch (error) {
        console.error(error);
        setIsAuth(false);
      }
    };

    const token = getToken();
    if (token) {
      checkLogin(token);
    }
  }, []);

  const handleLogout = () => {
    delete axios.defaults.headers.common['Authorization'];

    document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    setIsAuth(false);
  };

  return (
    <>
      {isAuth ? (
        <ProductPage handleLogout={handleLogout} />
      ) : (
        <LoginPage setIsAuth={setIsAuth} />
      )}
    </>
  );
}

export default App;