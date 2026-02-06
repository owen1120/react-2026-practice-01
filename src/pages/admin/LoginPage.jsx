import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = res.data;
      
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      axios.defaults.headers.common["Authorization"] = token;
      
      navigate("/admin/products");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: error.response?.data?.message || "請檢查帳號密碼",
        background: '#1f1f1f',
        color: '#ffffff'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg-950 px-4">
      <div className="bg-dark-bg-800 p-8 rounded-sm shadow-2xl border border-dark-bg-700 w-full max-w-md animate-[fadeIn_0.5s_ease-out]">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-widest flex justify-center items-center gap-2">
            <span className="bg-tech-blue-500 w-2 h-8 block skew-x-[-15deg]"></span>
            KEYBOARD-TECH
          </h1>
          <p className="text-dark-text-500 text-sm mt-2 uppercase tracking-wide">Admin Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-dark-text-300 text-sm font-bold mb-2 uppercase">Email Address</label>
            <input
              id="username"
              type="email"
              name="username"
              className="w-full bg-dark-bg-900 border border-dark-bg-700 text-white p-3 rounded-sm focus:outline-none focus:border-tech-blue-500 focus:ring-1 focus:ring-tech-blue-500 transition"
              placeholder="name@example.com"
              value={formData.username}
              onChange={handleInputChange}
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-dark-text-300 text-sm font-bold mb-2 uppercase">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className="w-full bg-dark-bg-900 border border-dark-bg-700 text-white p-3 rounded-sm focus:outline-none focus:border-tech-blue-500 focus:ring-1 focus:ring-tech-blue-500 transition"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-bold text-white uppercase tracking-widest transition duration-300 rounded-sm shadow-lg
              ${isLoading 
                ? 'bg-dark-bg-700 cursor-not-allowed' 
                : 'bg-tech-blue-600 hover:bg-tech-blue-500 hover:shadow-tech-blue-900/50'}`
            }
          >
            {isLoading ? "Verifying..." : "Login to System"}
          </button>
        </form>
        
        <p className="text-center text-dark-text-500 text-xs mt-6">
          &copy; 2026 KEYBOARD-TECH System
        </p>
      </div>
    </div>
  );
}