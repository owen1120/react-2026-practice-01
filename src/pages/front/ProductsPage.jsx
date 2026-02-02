import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState(null);

  const getProducts = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
      setProducts(res.data.products);
    } catch (error) {
      console.error("取得產品失敗:", error);
      Swal.fire("錯誤", "取得產品失敗，請稍後再試", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleAddToCart = async (product_id) => {
    setLoadingItemId(product_id);
    try {
      const data = {
        data: {
          product_id: product_id,
          qty: 1 
        }
      };
      await axios.post(`${API_BASE}/api/${API_PATH}/cart`, data);
      
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "已加入購物車",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });

    } catch (error) {
      console.error("加入購物車失敗:", error);
      Swal.fire("錯誤", "加入購物車失敗", "error");
    } finally {
      setLoadingItemId(null);
    }
  };

  return (
    <div className="container mx-auto p-4 py-12">
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-dark-bg-950/80 backdrop-blur-sm z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-tech-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-8 gap-4">
             <div className="w-2 h-10 bg-tech-blue-500 skew-x-[-15deg]"></div>
             <h2 className="text-3xl font-bold text-white uppercase tracking-wider">
               熱門產品系列 <span className="text-tech-blue-500">/ SERIES</span>
             </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-dark-bg-800 rounded-sm shadow-lg overflow-hidden border border-dark-bg-700 group relative transition-all duration-300 hover:-translate-y-1 hover:shadow-tech-blue-900/20 hover:border-tech-blue-500/50"
              >
                {/* 圖片區域 */}
                <div className="relative h-48 overflow-hidden bg-dark-bg-900">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500 opacity-90 group-hover:opacity-100"
                  />
                  {/* 分類標籤：右上角斜切造型 */}
                  <div className="absolute top-0 right-0 bg-tech-blue-600 text-white text-xs font-bold px-3 py-1 skew-x-[-15deg] origin-top-right translate-x-2">
                    <span className="skew-x-15 block px-1">{product.category}</span>
                  </div>
                </div>

                {/* 內容區域 */}
                <div className="p-5 grow flex flex-col justify-between border-t border-dark-bg-700">
                  <div>
                      <h3 className="text-lg font-bold mb-2 text-white line-clamp-1 group-hover:text-tech-blue-400 transition">
                        {product.title}
                      </h3>
                      <div className="w-10 h-1 bg-dark-bg-700 mt-2 mb-4 group-hover:bg-tech-blue-500 transition-colors"></div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-white font-bold text-xl">
                        NT$ <span className="text-2xl text-tech-blue-400">{product.price}</span>
                      </span>
                      <span className="text-dark-text-500 line-through text-sm">
                        ${product.origin_price}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-bold">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex items-center justify-center border border-dark-text-500 text-dark-text-300 py-2 rounded-sm hover:border-white hover:text-white transition text-sm uppercase"
                      >
                        詳細規格
                      </Link>
                      
                      <button
                        type="button"
                        disabled={loadingItemId === product.id}
                        onClick={() => handleAddToCart(product.id)}
                        className={`flex items-center justify-center py-2 rounded-sm transition text-sm uppercase tracking-wide font-bold
                          ${loadingItemId === product.id 
                            ? 'bg-dark-bg-700 text-dark-text-500 cursor-not-allowed' 
                            : 'bg-tech-blue-600 text-white hover:bg-tech-blue-500 hover:shadow-[0_0_15px_rgba(0,195,255,0.4)]'}`
                        }
                      >
                        {loadingItemId === product.id ? (
                           <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                           "加入購物車"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}