import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductPage({ handleLogout }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [tempProduct, setTempProduct] = useState(null);

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
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white relative">
      
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
                    <td className="p-4 text-right opacity-70">NT$ {product.origin_price}</td>
                    <td className="p-4 text-right font-bold text-yellow-300">NT$ {product.price}</td>
                    <td className="p-4 text-center">
                      {product.is_enabled ? (
                        <span className="text-green-400 font-semibold">啟用</span>
                      ) : (
                        <span className="text-red-300">未啟用</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        type="button" 
                        onClick={() => setTempProduct(product)}
                        className="bg-blue-500/80 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm shadow transition backdrop-blur-sm"
                      >
                        查看細節
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {tempProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setTempProduct(null)}
          ></div>

          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row text-white animate-fade-in-up">
            
            <button 
              onClick={() => setTempProduct(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="md:w-1/2 p-6 flex flex-col gap-4">
              <div className="aspect-4/3 w-full rounded-2xl overflow-hidden border border-white/10 bg-white/5 relative group">
                <img 
                  src={tempProduct.imageUrl} 
                  alt={tempProduct.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-2 left-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-sm">
                  主圖
                </div>
              </div>
              
              {tempProduct.imagesUrl && tempProduct.imagesUrl.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {tempProduct.imagesUrl.map((url, index) => (
                    url && (
                      <div key={index} className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:border-white/50 transition">
                        <img src={url} alt={`細節圖 ${index+1}`} className="w-full h-full object-cover" />
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>

            <div className="md:w-1/2 p-8 flex flex-col bg-white/5">
              <span className="inline-block px-3 py-1 bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-200 text-sm w-fit mb-3">
                {tempProduct.category}
              </span>
              
              <h2 className="text-3xl font-bold mb-2">{tempProduct.title}</h2>
              
              <div className="flex items-end gap-3 mb-6">
                <span className="text-2xl font-bold text-yellow-400">NT$ {tempProduct.price}</span>
                <span className="text-sm text-gray-400 line-through mb-1">NT$ {tempProduct.origin_price}</span>
              </div>

              <div className="h-px w-full bg-white/10 mb-6"></div>

              <div className="space-y-4 text-gray-200 grow">
                <div>
                  <h3 className="text-sm font-semibold text-white/60 mb-1">產品描述</h3>
                  <p className="leading-relaxed text-sm">{tempProduct.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/60 mb-1">說明內容</h3>
                  <p className="leading-relaxed text-sm opacity-80">{tempProduct.content}</p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <span className="text-sm text-gray-400 self-center">
                   {tempProduct.is_enabled ? "✅ 目前已啟用" : "⛔️ 目前未啟用"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;