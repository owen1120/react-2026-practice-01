import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createMessage } from "../../store/messageSlice"; 
import axios from "axios";

export default function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    delete axios.defaults.headers.common["Authorization"];

    dispatch(createMessage({
      title: "已登出",
      text: "您已安全登出系統",
      icon: "success"
    }));

    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-dark-bg-950 font-sans text-white">
      {/* === 左側側邊欄 === */}
      <aside className="w-64 bg-dark-bg-900 border-r border-dark-bg-800 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-dark-bg-800">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="bg-tech-blue-500 w-1.5 h-6 block skew-x-[-15deg] group-hover:bg-white transition"></span>
            <span className="font-bold text-lg tracking-widest text-white group-hover:text-tech-blue-400 transition">
              ADMIN PANEL
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <p className="text-xs font-bold text-dark-text-500 uppercase tracking-wider mb-4 px-2">
            Menu
          </p>
          
          {/* 產品列表 */}
          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-sm transition duration-200 font-bold tracking-wide
              ${isActive 
                ? 'bg-tech-blue-600/10 text-tech-blue-400 border-l-2 border-tech-blue-500' 
                : 'text-dark-text-300 hover:bg-dark-bg-800 hover:text-white'}`
            }
          >
            產品管理 Products
          </NavLink>

        </nav>

        <div className="p-4 border-t border-dark-bg-800">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dark-bg-600 rounded-sm text-dark-text-300 hover:border-red-500 hover:text-red-500 transition font-bold tracking-wide"
          >
            登出系統 Logout
          </button>
        </div>
      </aside>

      {/* === 右側內容區 === */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}