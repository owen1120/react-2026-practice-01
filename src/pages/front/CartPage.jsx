import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import ScreenLoading from "../../components/ScreenLoading";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage() {
  const [cart, setCart] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // 初始化表單驗證
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      tel: "",
      address: "",
      message: "",
    },
  });

  // 取得購物車資料
  const getCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  // 移除單一商品
  const removeCartItem = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`);
      getCart();
    } catch (error) {
      console.error(error);
      Swal.fire("錯誤", "刪除失敗", "error");
      setIsLoading(false);
    }
  };

  // 更新數量
  const updateCartItem = async (id, productId, newQty) => {
    setIsLoading(true);
    try {
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${id}`, {
        data: { product_id: productId, qty: Number(newQty) }
      });
      getCart();
    } catch (error) {
      console.error(error);
      Swal.fire("錯誤", "更新失敗", "error");
      setIsLoading(false);
    }
  };

  // 清空購物車
  const removeAllCart = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      getCart();
    } catch (error) {
      console.error(error);
      Swal.fire("錯誤", "清空失敗", "error");
      setIsLoading(false);
    }
  };

  // 送出訂單
  const onSubmit = async (data) => {
    const orderData = {
      data: {
        user: {
          name: data.name,
          email: data.email,
          tel: data.tel,
          address: data.address,
        },
        message: data.message,
      },
    };

    setIsLoading(true);
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/order`, orderData);
      
      Swal.fire({
        icon: "success",
        title: "訂單已建立",
        text: "我們將盡快為您出貨！",
        background: '#1f1f1f',
        color: '#ffffff',
        confirmButtonColor: '#06b6d4',
      });
      
      reset(); 
      getCart(); 
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "建立訂單失敗",
        text: error.response?.data?.message,
        background: '#1f1f1f',
        color: '#ffffff'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ScreenLoading isLoading={isLoading} />

      {!isLoading && (!cart.carts || cart.carts.length === 0) ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-4">購物車目前是空的</h2>
          <Link 
            to="/products" 
            className="inline-block px-6 py-3 bg-tech-blue-600 text-white font-bold rounded-sm hover:bg-tech-blue-500 transition"
          >
            前往選購
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-12">
          
          {/* === 購物車列表 === */}
          <h1 className="text-3xl font-black text-white mb-8 border-l-4 border-tech-blue-500 pl-4">
            SHOPPING CART
          </h1>
          
          <div className="bg-dark-bg-800 rounded-sm shadow-xl border border-dark-bg-700 overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-dark-bg-900 text-dark-text-300 uppercase text-xs font-bold">
                  <tr>
                    <th className="p-4">移除</th>
                    <th className="p-4">品名</th>
                    <th className="p-4 w-32">數量</th>
                    <th className="p-4 text-right">單價</th>
                    <th className="p-4 text-right">小計</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-bg-700 text-white">
                  {cart.carts?.map((item) => (
                    <tr key={item.id}>
                      <td className="p-4">
                        <button 
                          onClick={() => removeCartItem(item.id)} 
                          disabled={isLoading} 
                          className="text-red-500 hover:text-white transition"
                        >
                          ✕
                        </button>
                      </td>
                      <td className="p-4 font-bold flex items-center gap-3">
                        <img 
                          src={item.product.imageUrl} 
                          alt="" 
                          className="w-12 h-12 object-cover rounded-sm border border-dark-bg-600" 
                        />
                        {item.product.title}
                      </td>
                      <td className="p-4">
                        <select 
                          value={item.qty} 
                          onChange={(e) => updateCartItem(item.id, item.product_id, e.target.value)}
                          disabled={isLoading}
                          className="bg-dark-bg-900 border border-dark-bg-700 text-white px-2 py-1 rounded-sm focus:border-tech-blue-500 outline-none w-full"
                        >
                           {[...Array(20)].map((_, i) => (
                             <option key={i + 1} value={i + 1}>{i + 1}</option>
                           ))}
                        </select>
                      </td>
                      <td className="p-4 text-right text-dark-text-300">
                        {item.product.price}
                      </td>
                      <td className="p-4 text-right font-bold text-tech-blue-400">
                        {item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-dark-bg-900 border-t border-dark-bg-700">
                  <tr>
                    <td colSpan="4" className="p-4 text-right font-bold text-white">總計 Total</td>
                    <td className="p-4 text-right font-black text-xl text-white">
                      NT$ {cart.final_total}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="p-4 bg-dark-bg-900 flex justify-end">
               <button 
                 onClick={removeAllCart} 
                 disabled={isLoading} 
                 className="px-4 py-2 border border-red-500 text-red-500 font-bold rounded-sm hover:bg-red-500 hover:text-white transition text-xs"
               >
                 清空購物車
               </button>
            </div>
          </div>

          {/* === 訂購人資訊表單 === */}
          <div className="bg-dark-bg-800 rounded-sm shadow-xl border border-dark-bg-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="bg-tech-blue-500 w-1.5 h-6 block skew-x-[-15deg]"></span>
              訂購人資訊 CHECKOUT
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-dark-text-300 text-sm font-bold mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email 為必填",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email 格式不正確"
                      }
                    })}
                    className={`w-full bg-dark-bg-900 border text-white p-3 rounded-sm focus:outline-none focus:ring-1 transition
                      ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-dark-bg-700 focus:border-tech-blue-500 focus:ring-tech-blue-500'}`}
                    placeholder="請輸入 Email"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email.message}</p>}
                </div>

                {/* 姓名 */}
                <div>
                  <label htmlFor="name" className="block text-dark-text-300 text-sm font-bold mb-2">收件人姓名</label>
                  <input
                    id="name"
                    type="text"
                    {...register("name", { required: "姓名為必填" })}
                    className={`w-full bg-dark-bg-900 border text-white p-3 rounded-sm focus:outline-none focus:ring-1 transition
                      ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-dark-bg-700 focus:border-tech-blue-500 focus:ring-tech-blue-500'}`}
                    placeholder="請輸入姓名"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 電話 */}
                <div>
                  <label htmlFor="tel" className="block text-dark-text-300 text-sm font-bold mb-2">收件人電話</label>
                  <input
                    id="tel"
                    type="tel"
                    {...register("tel", {
                      required: "電話為必填",
                      minLength: {
                        value: 8,
                        message: "電話號碼需超過 8 碼"
                      }
                    })}
                    className={`w-full bg-dark-bg-900 border text-white p-3 rounded-sm focus:outline-none focus:ring-1 transition
                      ${errors.tel ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-dark-bg-700 focus:border-tech-blue-500 focus:ring-tech-blue-500'}`}
                    placeholder="請輸入電話號碼"
                  />
                  {errors.tel && <p className="text-red-500 text-xs mt-1 font-bold">{errors.tel.message}</p>}
                </div>

                {/* 地址 */}
                <div>
                  <label htmlFor="address" className="block text-dark-text-300 text-sm font-bold mb-2">收件人地址</label>
                  <input
                    id="address"
                    type="text"
                    {...register("address", { required: "地址為必填" })}
                    className={`w-full bg-dark-bg-900 border text-white p-3 rounded-sm focus:outline-none focus:ring-1 transition
                      ${errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-dark-bg-700 focus:border-tech-blue-500 focus:ring-tech-blue-500'}`}
                    placeholder="請輸入地址"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1 font-bold">{errors.address.message}</p>}
                </div>
              </div>

              {/* 留言 */}
              <div>
                <label htmlFor="message" className="block text-dark-text-300 text-sm font-bold mb-2">留言 (選填)</label>
                <textarea
                  id="message"
                  {...register("message")}
                  className="w-full bg-dark-bg-900 border border-dark-bg-700 text-white p-3 rounded-sm focus:outline-none focus:border-tech-blue-500 focus:ring-1 focus:ring-tech-blue-500 h-24"
                  placeholder="有什麼特殊需求嗎？"
                ></textarea>
              </div>

              {/* 送出按鈕 */}
              <div className="text-right">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-8 py-3 font-bold text-white uppercase tracking-widest rounded-sm shadow-lg transition
                    ${isLoading 
                      ? 'bg-dark-bg-700 cursor-not-allowed' 
                      : 'bg-tech-blue-600 hover:bg-tech-blue-500 hover:shadow-tech-blue-900/50'}`
                  }
                >
                  {isLoading ? "處理中..." : "送出訂單 SUBMIT ORDER"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}