import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ScreenLoading from "../../components/ScreenLoading";

import { useDispatch } from "react-redux";
import { createMessage } from "../../store/messageSlice";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch(); 
  
  useEffect(() => {
    const getProduct = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        console.error(error);
        dispatch(createMessage({
          title: "錯誤",
          text: "找不到該產品",
          icon: "error"
        }));
      } finally {
        setIsLoading(false);
      }
    };
    getProduct();
  }, [id, dispatch]);

  const addToCart = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data: { product_id: product.id, qty: Number(qty) }
      });
      
      dispatch(createMessage({
        title: "已加入購物車",
        text: `已將 ${qty} 個 ${product.title} 加入購物車`,
        icon: "success"
      }));

    } catch (error) {
      dispatch(createMessage({
        title: "加入失敗",
        text: error.response?.data?.message || "無法加入購物車",
        icon: "error"
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ScreenLoading isLoading={isLoading} />

      {product ? (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* 左側圖片 */}
            <div className="space-y-4">
              <div className="aspect-4/3 rounded-sm overflow-hidden border border-dark-bg-700">
                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
              </div>
              {product.imagesUrl?.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.imagesUrl.map((url, idx) => (
                    <div key={idx} className="aspect-square rounded-sm overflow-hidden border border-dark-bg-700 cursor-pointer hover:border-tech-blue-500">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 右側資訊 */}
            <div className="flex flex-col justify-center">
              <h2 className="text-tech-blue-500 tracking-widest text-sm font-bold mb-2">{product.category}</h2>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-4">{product.title}</h1>
              <p className="text-dark-text-300 mb-6 leading-relaxed">{product.description}</p>
              
              <div className="flex items-end gap-4 mb-8">
                <span className="text-3xl font-bold text-white">NT$ {product.price}</span>
                <span className="text-dark-text-500 line-through mb-1">NT$ {product.origin_price}</span>
              </div>

              <div className="border-t border-b border-dark-bg-700 py-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <label className="text-white font-bold">數量</label>
                  <select 
                    value={qty} 
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="bg-dark-bg-900 border border-dark-bg-700 text-white px-4 py-2 rounded-sm focus:border-tech-blue-500 outline-none"
                  >
                    {[...Array(10)].map((_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}
                  </select>
                </div>
                
                <button 
                  onClick={addToCart}
                  disabled={isLoading}
                  className="w-full bg-tech-blue-600 text-white font-bold py-4 rounded-sm hover:bg-tech-blue-500 hover:shadow-lg hover:shadow-tech-blue-900/30 transition uppercase tracking-widest"
                >
                  ADD TO CART 加入購物車
                </button>
              </div>

              <div className="bg-dark-bg-900 p-4 rounded-sm border border-dark-bg-700">
                 <h3 className="text-white font-bold mb-2">詳細規格</h3>
                 <p className="text-sm text-dark-text-500 whitespace-pre-line">{product.content}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen"></div>
      )}
    </>
  );
}