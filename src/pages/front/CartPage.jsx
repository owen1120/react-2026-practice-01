import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage() {
  const [cart, setCart] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res.data.data);
    } catch (error) {
      console.error("取得購物車失敗:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const removeCartItem = async (cartItemId) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${cartItemId}`);
      
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "ITEM REMOVED",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });

      getCart();
    } catch (error) {
        console.error(error);
      Swal.fire("錯誤", "刪除失敗", "error");
    }
  };

  const removeAllCart = async () => {
    const result = await Swal.fire({
      title: "CLEAR CART?",
      text: "此動作無法復原 (Cannot be undone)",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "YES, CLEAR IT",
      cancelButtonText: "CANCEL",
      confirmButtonColor: "#d33",
      background: '#1f1f1f',
      color: '#ffffff',
      customClass: {
        popup: 'border border-dark-bg-700'
      }
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "CART CLEARED",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });
        getCart();
      } catch (error) {
        console.error(error);
        Swal.fire("錯誤", "清空失敗", "error");
      }
    }
  };

  const updateCartItem = async (item, newQty) => {
    if (newQty < 1) return;
    try {
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${item.id}`, {
        data: { product_id: item.product_id, qty: Number(newQty) }
      });
      getCart();
    } catch (error) {
        console.error(error);
      Swal.fire("錯誤", "更新失敗", "error");
    }
  };

  return (
    <div className="container mx-auto p-4 py-12">
      {isLoading ? (
         <div className="fixed inset-0 flex items-center justify-center bg-dark-bg-950/80 backdrop-blur-sm z-50">
           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-tech-blue-500"></div>
         </div>
      ) : (
        <div>
          {cart.carts && cart.carts.length > 0 ? (
            <div>
              {/* 標題區 */}
              <div className="flex justify-between items-end mb-8 pb-4 border-b border-dark-bg-700">
                 <div>
                   <h2 className="text-3xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
                     <span className="w-3 h-3 bg-tech-blue-500 inline-block"></span>
                     SHOPPING CART
                   </h2>
                   <p className="text-dark-text-500 mt-2 text-sm font-mono">
                     TOTAL ITEMS: <span className="text-white">{cart.carts.length}</span>
                   </p>
                 </div>
                 
                 <button onClick={removeAllCart} className="text-red-400 border border-red-900/50 bg-red-900/10 px-6 py-2 rounded-sm hover:bg-red-900/30 hover:border-red-500 transition text-xs font-bold uppercase tracking-widest">
                   CLEAR ALL
                 </button>
              </div>

              {/* 購物車表格 */}
              <div className="bg-dark-bg-800 border border-dark-bg-700 rounded-sm overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-dark-bg-900 text-dark-text-300 uppercase text-xs tracking-widest font-bold">
                    <tr>
                      <th className="p-5 pl-8">Product</th>
                      <th className="p-5 text-center">Quantity</th>
                      <th className="p-5 text-right">Price</th>
                      <th className="p-5 text-right">Subtotal</th>
                      <th className="p-5 text-center">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="text-dark-text-100 divide-y divide-dark-bg-700">
                    {cart.carts.map((item) => (
                      <tr key={item.id} className="hover:bg-dark-bg-700/30 transition duration-200">
                        <td className="p-5 pl-8">
                          <div className="flex items-center gap-6">
                             {/* 圖片 */}
                             <div className="w-24 h-24 bg-dark-bg-950 border border-dark-bg-700 p-2 shrink-0">
                                {item.product?.imageUrl ? (
                                    <img src={item.product.imageUrl} alt="" className="w-full h-full object-contain"/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-dark-text-500">NO IMG</div>
                                )}
                             </div>
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-lg tracking-wide">
                                  {item.product ? item.product.title : <span className="text-red-500">已失效商品</span>}
                              </span>
                              <span className="text-xs text-tech-blue-400 font-bold uppercase bg-tech-blue-900/20 px-2 py-0.5 w-fit rounded-sm border border-tech-blue-900/50">
                                {item.product?.category}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center justify-center">
                            <div className="flex border border-dark-bg-600 bg-dark-bg-900 h-10">
                              <button 
                                  onClick={()=>updateCartItem(item, item.qty-1)} 
                                  disabled={item.qty === 1}
                                  className="w-10 flex items-center justify-center text-dark-text-300 hover:text-white hover:bg-dark-bg-700 disabled:opacity-30 transition"
                              >-</button>
                              <span className="w-12 flex items-center justify-center font-bold text-sm border-x border-dark-bg-800">{item.qty}</span>
                              <button 
                                  onClick={()=>updateCartItem(item, item.qty+1)} 
                                  className="w-10 flex items-center justify-center text-dark-text-300 hover:text-white hover:bg-dark-bg-700 transition"
                              >+</button>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-right font-mono text-dark-text-300">
                          ${item.product?.price}
                        </td>
                        <td className="p-5 text-right font-bold text-tech-blue-400 text-lg font-mono tracking-tight">
                          ${item.total}
                        </td>
                        <td className="p-5 text-center">
                          <button onClick={() => removeCartItem(item.id)} className="text-dark-text-500 hover:text-red-400 transition p-2 hover:bg-red-400/10 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-dark-bg-900/50 border-t-2 border-tech-blue-500">
                    <tr>
                      <td colSpan={3} className="p-6 text-right font-bold text-white text-lg uppercase tracking-wider">
                        Estimated Total
                      </td>
                      <td className="p-6 text-right font-bold text-3xl text-white leading-none font-mono tracking-tighter">
                        <span className="text-sm text-dark-text-500 mr-2 font-sans font-normal align-middle">NT$</span>
                        {cart.final_total}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-8 flex justify-between items-center">
                  <Link to="/products" className="text-dark-text-300 hover:text-white flex items-center gap-2 transition text-sm uppercase tracking-wide">
                    ← Continue Shopping
                  </Link>
                  <button className="py-4 px-12 bg-tech-blue-600 text-white font-bold text-lg rounded-sm uppercase tracking-widest hover:bg-tech-blue-500 hover:shadow-[0_0_25px_rgba(0,195,255,0.4)] transition duration-300 relative overflow-hidden">
                    Checkout Now
                  </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-32 bg-dark-bg-800 border border-dark-bg-700 relative overflow-hidden group">
              {/* 背景裝飾字 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] font-black text-dark-bg-900 select-none pointer-events-none">
                EMPTY
              </div>
              
              <div className="relative z-10">
                <p className="text-2xl text-white font-bold mb-8 uppercase tracking-widest">Your cart is empty</p>
                <Link to="/products" className="inline-block px-10 py-4 border border-tech-blue-500 text-tech-blue-400 font-bold hover:bg-tech-blue-600 hover:text-white transition shadow-[0_0_15px_rgba(0,195,255,0.2)] hover:shadow-[0_0_25px_rgba(0,195,255,0.5)] uppercase tracking-widest">
                  Start Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}