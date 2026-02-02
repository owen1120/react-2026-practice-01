import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const getProduct = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
      const productData = res.data.product;
      setProduct(productData);

      if (productData.imagesUrl && productData.imagesUrl.length > 0) {
        setMainImage(productData.imagesUrl[0]);
      } else {
        setMainImage(productData.imageUrl);
      }
      
    } catch (error) {
      console.error("取得產品失敗:", error);
      Swal.fire("錯誤", "取得產品失敗，請稍後再試", "error");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const data = {
        data: {
          product_id: product.id,
          qty: Number(qty)
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
      setIsAdding(false);
    }
  };

  return (
    <div className="container mx-auto p-4 py-12">
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-dark-bg-950/80 backdrop-blur-sm z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-tech-blue-500"></div>
        </div>
      ) : (
        product && (
          <div className="flex flex-col md:flex-row gap-12 mt-8">
            {/* 左側：圖片區 */}
            <div className="md:w-3/5">
              {/* 麵包屑導航 */}
              <nav className="text-sm text-dark-text-500 mb-6 font-medium flex items-center gap-2">
                 <Link to="/" className="hover:text-tech-blue-400 transition">首頁</Link> 
                 <span className="text-dark-bg-700">/</span>
                 <Link to="/products" className="hover:text-tech-blue-400 transition">產品列表</Link> 
                 <span className="text-dark-bg-700">/</span>
                 <span className="text-tech-blue-400 border-b border-tech-blue-400 pb-0.5">{product.title}</span>
              </nav>
              
              {/* 主圖：科技感邊框與陰影 */}
              <div className="aspect-16/10 bg-dark-bg-900 border border-dark-bg-700 rounded-sm overflow-hidden relative group">
                {/* 裝飾線條 */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-tech-blue-500/50 z-10"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-tech-blue-500/50 z-10"></div>
                
                <img 
                  src={mainImage} 
                  alt={product.title} 
                  className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              
              {/* 縮圖列表 */}
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {(product.imagesUrl || []).map((url, index) => {
                   if (!url) return null;
                   const isSelected = mainImage === url;
                   return (
                       <div 
                         key={index}
                         onClick={() => setMainImage(url)}
                         className={`w-24 h-24 p-1 bg-dark-bg-900 border-2 cursor-pointer transition-all duration-300 relative
                           ${isSelected ? 'border-tech-blue-500 opacity-100 shadow-[0_0_10px_rgba(0,195,255,0.3)]' : 'border-dark-bg-700 opacity-60 hover:opacity-100 hover:border-dark-text-500'}`
                         }
                       >
                         <img src={url} className="w-full h-full object-cover" />
                       </div>
                   )
                })}
              </div>
            </div>

            {/* 右側：詳細資訊與購買區 */}
            <div className="md:w-2/5 flex flex-col">
              {/* 分類標籤 */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-tech-blue-600 text-white text-xs font-bold px-3 py-1 skew-x-[-15deg] uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="h-px bg-dark-bg-700 grow"></span>
              </div>

              <h1 className="text-4xl font-bold text-white mb-6 tracking-tight leading-tight">{product.title}</h1>
              
              <div className="mb-8 pb-8 border-b border-dark-bg-700 border-dashed">
                <p className="text-dark-text-300 leading-relaxed text-lg font-light">
                  {product.description}
                </p>
              </div>
              
              {/* 規格區塊 */}
              <div className="mb-8 bg-dark-bg-800/50 p-6 border-l-4 border-tech-blue-500">
                 <h3 className="font-bold text-white mb-3 uppercase tracking-wider text-sm">SPECIFICATION</h3>
                 <p className="text-sm text-dark-text-300 whitespace-pre-line leading-7 font-mono">
                    {product.content}
                 </p>
              </div>

              {/* 購買操作區 */}
              <div className="mt-auto p-6 bg-dark-bg-800 border border-dark-bg-700 shadow-xl">
                <div className="flex items-baseline justify-between mb-8">
                  <div className="flex flex-col">
                    <span className="text-xs text-dark-text-500 uppercase mb-1">Price</span>
                    <span className="text-5xl font-bold text-tech-blue-400 leading-none">
                      NT$ {product.price}
                    </span>
                  </div>
                  <span className="text-dark-text-500 line-through text-lg font-medium">
                    NT$ {product.origin_price}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  {/* 數量選擇器 */}
                  <div className="flex items-center border border-dark-bg-600 bg-dark-bg-900 h-12">
                    <button 
                      onClick={() => setQty((pre) => pre > 1 ? pre - 1 : 1)}
                      className="px-4 h-full text-dark-text-300 hover:text-white hover:bg-dark-bg-700 transition"
                    >-</button>
                    <input 
                      type="number" 
                      value={qty} 
                      readOnly
                      className="w-16 text-center h-full bg-transparent text-white font-bold focus:outline-none" 
                    />
                    <button 
                      onClick={() => setQty((pre) => pre + 1)}
                      className="px-4 h-full text-dark-text-300 hover:text-white hover:bg-dark-bg-700 transition"
                    >+</button>
                  </div>
                  <span className="text-dark-text-500 font-medium uppercase text-sm">{product.unit}</span>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`w-full py-4 font-bold text-lg uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group
                    ${isAdding 
                      ? 'bg-dark-bg-700 text-dark-text-500 cursor-not-allowed' 
                      : 'bg-tech-blue-600 text-white hover:bg-tech-blue-500 shadow-lg shadow-tech-blue-900/50 hover:shadow-tech-blue-500/40'}`
                  }
                >
                  {!isAdding && <div className="absolute top-0 -left-full w-1/2 h-full bg-white/20 skew-x-[-20deg] group-hover:animate-[shine_0.75s_infinite]"></div>}
                  
                  {isAdding ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      PROCESSING...
                    </>
                  ) : (
                    "ADD TO CART"
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}