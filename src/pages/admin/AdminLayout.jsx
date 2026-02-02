import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("hexToken="))
          ?.split("=")[1];
        
        if (!token) throw new Error("找不到憑證，請重新登入");
        
        axios.defaults.headers.common["Authorization"] = token;
        await axios.post(`${API_BASE}/api/user/check`);
        
      } catch (error) {
        console.error(error);
        
        if (!location.pathname.includes("/login")) {
             
             Swal.fire({
               icon: "error",
               title: "驗證失敗",
               text: error.response?.data?.message || "憑證過期或無效，請重新登入",
               background: '#1f1f1f',
               color: '#ffffff',
               confirmButtonColor: '#00c3ff', 
               timer: 3000,
               timerProgressBar: true
             });

             navigate("/login");
        }
      }
    };

    checkLogin();
  }, [navigate, location]); 

  const handleLogout = () => {
    document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // 登出時也給個提示
    Swal.fire({
      icon: "success",
      title: "已登出",
      text: "您已安全登出系統",
      background: '#1f1f1f',
      color: '#ffffff',
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      position: 'top-end'
    });

    navigate("/login");
  };

  const menuItems = [
    { name: "產品管理 Products", path: "/admin/products" },
    { name: "訂單管理 Orders", path: "/admin/orders" }, 
  ];

  return (
    <div className="flex min-h-screen bg-dark-bg-950 text-dark-text-300 font-sans">
      {/* 側邊欄 */}
      <aside className="w-64 bg-dark-bg-900 border-r border-dark-bg-700 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-dark-bg-700">
           <h2 className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
             <span className="bg-tech-blue-500 w-1.5 h-6 block skew-x-[-15deg]"></span>
             ADMIN PANEL
           </h2>
        </div>
        
        <nav className="grow p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-sm transition duration-200 border-l-4 
                  ${isActive 
                    ? "border-tech-blue-500 bg-dark-bg-800 text-white font-bold" 
                    : "border-transparent text-dark-text-500 hover:text-white hover:bg-dark-bg-800"
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dark-bg-700">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-sm transition flex items-center gap-2"
          >
            <span>➜</span> 登出系統 Logout
          </button>
        </div>
      </aside>

      {/* 主內容區域 */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}