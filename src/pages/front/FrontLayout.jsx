import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function FrontLayout() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation(); // 監聽路由變化

  // 檢查是否已登入
  useEffect(() => {
    const checkLoginState = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hexToken="))
        ?.split("=")[1];
      
      // 如果有 token 代表已登入 (這裡只做簡易判斷，嚴謹驗證交給後台路由)
      setIsLoggedIn(!!token);
    };

    checkLoginState();
  }, [location]); // 當路由改變時重新檢查 (例如從登入頁回來)

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg-950 font-sans text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg-900/80 backdrop-blur-md border-b border-dark-bg-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="bg-tech-blue-500 w-1.5 h-6 block skew-x-[-15deg] group-hover:bg-white transition"></span>
              <span className="font-bold text-xl tracking-widest text-white group-hover:text-tech-blue-400 transition">
                KEYBOARD-TECH
              </span>
            </Link>

            {/* Links */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink 
                to="/" 
                className={({isActive}) => `text-sm font-bold tracking-wide transition ${isActive ? 'text-tech-blue-500' : 'text-dark-text-300 hover:text-white'}`}
              >
                首頁 HOME
              </NavLink>
              <NavLink 
                to="/products" 
                className={({isActive}) => `text-sm font-bold tracking-wide transition ${isActive ? 'text-tech-blue-500' : 'text-dark-text-300 hover:text-white'}`}
              >
                產品列表 PRODUCTS
              </NavLink>
            </div>

            {/* Cart & Admin Auth */}
            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative p-2 text-dark-text-300 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-tech-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {isLoggedIn ? (
                <Link 
                  to="/admin/products" 
                  className="text-xs font-bold border border-tech-blue-500 bg-tech-blue-600/10 px-3 py-1 rounded-sm text-tech-blue-400 hover:bg-tech-blue-600 hover:text-white transition"
                >
                  進入後台 ADMIN
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="text-xs font-bold border border-dark-bg-600 px-3 py-1 rounded-sm text-dark-text-500 hover:border-white hover:text-white transition"
                >
                  登入 LOGIN
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="grow pt-16">
        <Outlet context={{ setCartCount }} />
      </div>

      {/* Footer */}
      <footer className="bg-dark-bg-900 border-t border-dark-bg-800 py-8 text-center text-dark-text-500 text-sm">
        <p className="mb-2 tracking-widest font-bold text-white">KEYBOARD-TECH</p>
        <p>&copy; 2026 All Rights Reserved.</p>
      </footer>
    </div>
  );
}