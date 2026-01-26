import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductPage({ handleLogout }) {
  const [products, setProducts] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);

  const getProducts = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
      alert("取得產品失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white">
      
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold drop-shadow-md">後台產品管理</h1>
        <button 
          onClick={handleLogout}
          className="px-6 py-2 bg-white/20 text-white rounded-xl hover:bg-white/40 transition border border-white/30 backdrop-blur-md shadow-lg"
        >
          登出
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 overflow-hidden">
        
        {isLoading && (
          <div className="text-center py-10 text-xl font-semibold animate-pulse">
            資料載入中...
          </div>
        )}

        {!isLoading && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/20 text-white/80">
                  <th className="p-4 font-semibold">分類</th>
                  <th className="p-4 font-semibold">產品名稱</th>
                  <th className="p-4 font-semibold text-right">原價</th>
                  <th className="p-4 font-semibold text-right">售價</th>
                  <th className="p-4 font-semibold text-center">狀態</th>
                  <th className="p-4 font-semibold text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors border-b border-white/10 last:border-0">
                    <td className="p-4">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm border border-white/10">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{product.title}</td>
                    <td className="p-4 text-right opacity-70">
                      NT$ {product.origin_price}
                    </td>
                    <td className="p-4 text-right font-bold text-yellow-300">
                      NT$ {product.price}
                    </td>
                    <td className="p-4 text-center">
                      {product.is_enabled ? (
                        <span className="text-green-400 font-semibold drop-shadow-sm">啟用</span>
                      ) : (
                        <span className="text-red-300">未啟用</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        type="button" 
                        className="bg-blue-500/80 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm shadow transition backdrop-blur-sm"
                      >
                        查看細節
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {products.length === 0 && (
              <p className="text-center py-8 text-white/50">
                目前沒有產品資料，請先至後台建立資料。
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;