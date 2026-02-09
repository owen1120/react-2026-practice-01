import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, data);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      axios.defaults.headers.common["Authorization"] = token;
      Swal.fire({
        icon: "success",
        title: "登入成功",
        showConfirmButton: false,
        timer: 1500,
        background: '#1f1f1f',
        color: '#ffffff'
      });
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
    <div className="min-h-screen flex items-center justify-center bg-dark-bg-950 px-4 relative">
      <Link to="/" className="absolute top-6 left-6 text-dark-text-500 hover:text-tech-blue-400 transition flex items-center gap-2 font-bold tracking-wide">
        <span className="text-xl">←</span> 回到前台首頁
      </Link>

      <div className="bg-dark-bg-800 p-8 rounded-sm shadow-2xl border border-dark-bg-700 w-full max-w-md animate-[fadeIn_0.5s_ease-out]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-widest flex justify-center items-center gap-2">
            <span className="bg-tech-blue-500 w-2 h-8 block skew-x-[-15deg]"></span>
            KEYBOARD-TECH
          </h1>
          <p className="text-dark-text-500 text-sm mt-2 uppercase tracking-wide">Admin Control Panel</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-dark-text-300 text-sm font-bold mb-2 uppercase">Email Address</label>
            <input
              id="username"
              type="email" 
              {...register("username", { 
                required: "Email 為必填欄位",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email 格式不正確"
                }
              })}
              className={`w-full bg-dark-bg-900 border text-white p-3 rounded-sm focus:outline-none focus:ring-1 transition
                ${errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-dark-bg-700 focus:border-tech-blue-500 focus:ring-tech-blue-500'}`}
              placeholder="name@example.com"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1 font-bold">{errors.username.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-dark-text-300 text-sm font-bold mb-2 uppercase">Password</label>
            <input
              id="password"
              type="password" 
              {...register("password", { required: "請輸入密碼" })}
              className={`w-full bg-dark-bg-900 border text-white p-3 rounded-sm focus:outline-none focus:ring-1 transition
                ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-dark-bg-700 focus:border-tech-blue-500 focus:ring-tech-blue-500'}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-bold text-white uppercase tracking-widest transition duration-300 rounded-sm shadow-lg
              ${isLoading ? 'bg-dark-bg-700 cursor-not-allowed' : 'bg-tech-blue-600 hover:bg-tech-blue-500 hover:shadow-tech-blue-900/50'}`}
          >
            {isLoading ? "Verifying..." : "Login to System"}
          </button>
        </form>
      </div>
    </div>
  );
}