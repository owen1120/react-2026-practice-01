import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE = import.meta.env.VITE_API_BASE;

function LoginPage({ setIsAuth }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const glassSwal = Swal.mixin({
    customClass: {
      popup: 'bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl',
      title: 'text-white drop-shadow-md',
      htmlContainer: 'text-white/80',
      confirmButton: 'bg-white/80 text-purple-700 px-6 py-2 rounded-xl hover:bg-white font-bold border-0 shadow-lg transition-transform hover:scale-105',
    },
    buttonsStyling: false,
    background: 'transparent',
    color: '#ffffff'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      axios.defaults.headers.common['Authorization'] = token;

      glassSwal.fire({
        icon: 'success',
        title: '登入成功',
        text: '歡迎回到後台管理系統',
        timer: 1500,
        showConfirmButton: false 
      });

      setIsAuth(true);

    } catch (error) {
      glassSwal.fire({
        icon: 'error',
        title: '登入失敗',
        text: error.response?.data?.message || '帳號或密碼錯誤',
        confirmButtonText: '再試一次'
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md p-10 rounded-3xl shadow-2xl bg-white/20 backdrop-blur-xl border border-white/30">
        <h2 className="text-3xl font-extrabold text-center text-white mb-8 drop-shadow-md">
          請先登入
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-2 text-sm font-semibold text-white/90 ml-1">
              Email Address
            </label>
            <input
              id="username"
              name="username"
              type="email"
              className="p-3.5 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-200"
              placeholder="name@example.com"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 text-sm font-semibold text-white/90 ml-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="p-3.5 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-200"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-white/80 text-purple-700 py-3.5 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 font-bold text-lg backdrop-blur-md"
          >
            登入
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm">
            Need help? <a href="#" className="text-white hover:underline font-semibold decoration-white/50 underline-offset-4">Contact Support</a>
          </p>
          <p className="mt-4 text-white/40 text-xs tracking-wider">
            © 2026 六角學院 React 課程練習
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;