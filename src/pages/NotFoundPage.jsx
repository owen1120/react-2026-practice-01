import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg-950 px-4 relative text-center">
      {/* 頂部裝飾線 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-tech-blue-500"></div>

      <h1 className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-b from-tech-blue-400 to-tech-blue-900 mb-4 animate-pulse">
        404
      </h1>
      
      <h2 className="text-2xl md:text-3xl font-bold text-white tracking-widest mb-2 flex items-center gap-2 justify-center">
        <span className="bg-tech-blue-500 w-2 h-6 block skew-x-[-15deg]"></span>
        PAGE NOT FOUND
      </h2>
      
      <p className="text-dark-text-400 mb-8 max-w-md tracking-wide text-sm md:text-base">
        系統找不到您請求的頁面。它可能已被移除、或是您輸入了錯誤的網址。
      </p>

      <Link 
        to="/" 
        className="px-8 py-3 bg-tech-blue-600 text-white font-bold tracking-widest rounded-sm hover:bg-tech-blue-500 hover:shadow-lg hover:shadow-tech-blue-900/50 transition duration-300 uppercase"
      >
        返回首頁 BACK TO HOME
      </Link>

      <p className="absolute bottom-6 text-dark-text-600 text-xs tracking-widest">
        &copy; 2026 KEYBOARD-TECH SYSTEM
      </p>
    </div>
  );
}