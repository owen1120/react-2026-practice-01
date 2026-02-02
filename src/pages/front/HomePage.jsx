import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
        setFeaturedProducts(res.data.products.slice(0, 4));
      } catch (error) {
        console.error("無法取得產品", error);
      }
    };
    getProducts();
  }, []);

  return (
    <div className="bg-dark-bg-950 min-h-screen text-white overflow-x-hidden font-sans">
      
      {/* === Hero Section === */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-dark-bg-950 via-dark-bg-900 to-dark-bg-950 z-0"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tech-blue-600/20 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]"></div>

        {/* 內容 */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h2 className="text-tech-blue-500 font-bold tracking-[0.2em] mb-4 uppercase animate-[fadeInDown_1s_ease-out]">
            Next Level Typing Experience
          </h2>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            DOMINATE <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-tech-blue-400 to-purple-500">
              THE GAME
            </span>
          </h1>
          <p className="text-dark-text-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            極致手感、炫彩光效、精準觸發。專為電競玩家與程式開發者打造的頂級機械式鍵盤。
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/products"
              className="group relative px-8 py-3 bg-tech-blue-600 text-white font-bold rounded-sm overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
            >
              <span className="relative z-10 group-hover:tracking-widest transition-all duration-300">
                立即選購 SHOP NOW
              </span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-sm transition-all duration-300 group-hover:scale-100 group-hover:bg-tech-blue-500/50"></div>
            </Link>
          </div>
        </div>

        {/* 網格背景圖案 */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-1 pointer-events-none"></div>
      </section>

      {/* === Tech Marquee === */}
      <div className="bg-tech-blue-600 py-3 overflow-hidden -rotate-1 scale-105 border-y-4 border-black">
        <div className="flex gap-8 animate-[marquee_20s_linear_infinite] whitespace-nowrap font-black text-black text-xl italic tracking-widest">
           <span>KEYBOARD-TECH /// ULTIMATE PERFORMANCE</span>
           <span>///</span>
           <span>RGB LIGHTING</span>
           <span>///</span>
           <span>MECHANICAL SWITCHES</span>
           <span>///</span>
           <span>WIRELESS CONNECTIVITY</span>
           <span>///</span>
           <span>KEYBOARD-TECH /// ULTIMATE PERFORMANCE</span>
           <span>///</span>
           <span>RGB LIGHTING</span>
           <span>///</span>
           <span>MECHANICAL SWITCHES</span>
        </div>
      </div>

      {/* === Featured Products === */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-dark-bg-700 pb-4">
          <div>
            <h3 className="text-tech-blue-500 font-bold tracking-widest mb-1">SELECTED GEARS</h3>
            <h2 className="text-3xl font-bold text-white">熱門精選</h2>
          </div>
          <Link to="/products" className="text-dark-text-500 hover:text-white transition flex items-center gap-2 group">
            查看全部 <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* 產品 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group block bg-dark-bg-900 border border-dark-bg-700 hover:border-tech-blue-500/50 transition duration-300 rounded-sm overflow-hidden hover:-translate-y-2">
              <div className="aspect-4/3 overflow-hidden relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                {/* 價格標籤 */}
                <div className="absolute top-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 border border-tech-blue-500">
                   NT$ {product.price}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1 truncate">{product.title}</h3>
                <p className="text-dark-text-500 text-sm mb-3">{product.category}</p>
                <div className="w-full py-2 border border-dark-bg-600 text-center text-sm font-bold text-dark-text-300 group-hover:bg-tech-blue-600 group-hover:text-white group-hover:border-tech-blue-600 transition">
                  查看詳情
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* === Features === */}
      <section className="py-20 bg-dark-bg-900 border-t border-dark-bg-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-6 border border-dark-bg-700 hover:border-tech-blue-500 transition duration-300 rounded-sm group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition">🚀</div>
            <h3 className="text-xl font-bold text-white mb-2">極速出貨</h3>
            <p className="text-dark-text-500">現貨商品 24 小時內快速出貨，讓您無需等待。</p>
          </div>
          <div className="p-6 border border-dark-bg-700 hover:border-purple-500 transition duration-300 rounded-sm group">
             <div className="text-4xl mb-4 group-hover:scale-110 transition">🛡️</div>
            <h3 className="text-xl font-bold text-white mb-2">原廠保固</h3>
            <p className="text-dark-text-500">所有產品皆享有一年原廠保固，售後有保障。</p>
          </div>
          <div className="p-6 border border-dark-bg-700 hover:border-green-500 transition duration-300 rounded-sm group">
             <div className="text-4xl mb-4 group-hover:scale-110 transition">💬</div>
            <h3 className="text-xl font-bold text-white mb-2">專業諮詢</h3>
            <p className="text-dark-text-500">不確定適合哪種軸體？歡迎隨時聯繫線上客服。</p>
          </div>
        </div>
      </section>

    </div>
  );
}