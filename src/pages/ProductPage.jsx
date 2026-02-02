import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [],
};

function ProductPage({ handleLogout }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  
  const [detailProduct, setDetailProduct] = useState(null);

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

  const openProductModal = (type, product) => {
    setModalType(type);
    if (type === "create") {
      setTempProduct(defaultModalState);
    } else {
      setTempProduct(product);
    }
    setIsProductModalOpen(true);
  };

  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempProduct({
      ...tempProduct,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleUpdateProduct = async () => {
    try {
      let api = `${API_BASE}/api/${API_PATH}/admin/product`;
      let method = "post";

      if (modalType === "edit") {
        api = `${API_BASE}/api/${API_PATH}/admin/product/${tempProduct.id}`;
        method = "put";
      }

      const payload = {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
        },
      };

      await axios[method](api, payload);

      Swal.fire({
        icon: "success",
        title: modalType === "create" ? "新增成功" : "更新成功",
        timer: 1500,
        showConfirmButton: false,
        background: 'transparent',
        customClass: { popup: 'bg-white/90 backdrop-blur-md rounded-2xl shadow-xl' }
      });

      setIsProductModalOpen(false);
      getProducts();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "操作失敗",
        text: error.response?.data?.message,
      });
    }
  };

  const handleDeleteProduct = async (product) => {
    const result = await Swal.fire({
      title: "確定要刪除嗎？",
      text: `刪除後將無法恢復 [${product.title}]`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "是的，刪除它！",
      cancelButtonText: "取消",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${product.id}`);
        Swal.fire("已刪除!", "產品已成功刪除", "success");
        getProducts();
      } catch (error) {
        console.error(error);
        Swal.fire("錯誤!", "刪除失敗", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white relative">
      
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold drop-shadow-md">後台產品管理</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => openProductModal('create')}
            className="px-6 py-2 bg-green-500/80 hover:bg-green-600 text-white rounded-xl transition shadow-lg backdrop-blur-md font-bold"
          >
            + 建立新商品
          </button>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-white/20 text-white rounded-xl hover:bg-white/40 transition border border-white/30 backdrop-blur-md shadow-lg"
          >
            登出
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 overflow-hidden">
        {isLoading && <div className="text-center py-10 animate-pulse">資料載入中...</div>}

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
                    <td className="p-4"><span className="px-3 py-1 bg-white/20 rounded-full text-sm">{product.category}</span></td>
                    <td className="p-4 font-medium">{product.title}</td>
                    <td className="p-4 text-right opacity-70">NT$ {product.origin_price}</td>
                    <td className="p-4 text-right font-bold text-yellow-300">NT$ {product.price}</td>
                    <td className="p-4 text-center">
                      {product.is_enabled ? (
                        <span className="text-green-400 font-bold drop-shadow-sm">啟用</span>
                      ) : (
                        <span className="text-red-300 font-bold">未啟用</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setDetailProduct(product)} className="text-blue-200 hover:text-white transition">
                          查看
                        </button>
                        <button onClick={() => openProductModal('edit', product)} className="text-yellow-200 hover:text-white transition">
                          編輯
                        </button>
                        <button onClick={() => handleDeleteProduct(product)} className="text-red-300 hover:text-red-500 transition">
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)}></div>
          <div className="relative bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-3xl p-8 text-white overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6">{modalType === 'create' ? '建立新商品' : '編輯商品'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label>主圖網址</label>
                  <input name="imageUrl" value={tempProduct.imageUrl} onChange={handleModalInputChange} className="p-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-blue-500" placeholder="請輸入圖片網址" />
                  {tempProduct.imageUrl && <img src={tempProduct.imageUrl} alt="主圖預覽" className="w-full h-48 object-cover rounded-lg border border-white/10" />}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">標題</label>
                  <input name="title" value={tempProduct.title} onChange={handleModalInputChange} className="w-full p-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-blue-500" placeholder="請輸入產品標題" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">分類</label>
                    <input name="category" value={tempProduct.category} onChange={handleModalInputChange} className="w-full p-2 rounded bg-white/10 border border-white/20" placeholder="例如: 衣服" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">單位</label>
                    <input name="unit" value={tempProduct.unit} onChange={handleModalInputChange} className="w-full p-2 rounded bg-white/10 border border-white/20" placeholder="例如: 件" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">原價</label>
                    <input type="number" name="origin_price" value={tempProduct.origin_price} onChange={handleModalInputChange} className="w-full p-2 rounded bg-white/10 border border-white/20" placeholder="輸入原價" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">售價</label>
                    <input type="number" name="price" value={tempProduct.price} onChange={handleModalInputChange} className="w-full p-2 rounded bg-white/10 border border-white/20" placeholder="輸入售價" />
                  </div>
                </div>
                
                <hr className="border-white/10" />
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">產品描述</label>
                  <textarea name="description" value={tempProduct.description} onChange={handleModalInputChange} className="w-full p-2 rounded bg-white/10 border border-white/20 h-20" placeholder="產品描述"></textarea>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">說明內容</label>
                  <textarea name="content" value={tempProduct.content} onChange={handleModalInputChange} className="w-full p-2 rounded bg-white/10 border border-white/20 h-20" placeholder="產品說明"></textarea>
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="is_enabled" 
                    name="is_enabled" 
                    checked={tempProduct.is_enabled} 
                    onChange={handleModalInputChange}
                    className="w-5 h-5 accent-blue-500"
                  />
                  <label htmlFor="is_enabled" className="cursor-pointer select-none">是否啟用</label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button onClick={() => setIsProductModalOpen(false)} className="px-6 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">取消</button>
              <button onClick={handleUpdateProduct} className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition shadow-lg font-bold">確認儲存</button>
            </div>
          </div>
        </div>
      )}

      {detailProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailProduct(null)}></div>
          <div className="relative bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row text-white p-6 gap-6 animate-fade-in-up">
            <button onClick={() => setDetailProduct(null)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition z-10">✕</button>
            
            <div className="md:w-1/2 aspect-4/3 rounded-2xl overflow-hidden border border-white/10">
              <img src={detailProduct.imageUrl} alt={detailProduct.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="md:w-1/2 flex flex-col">
              <span className="px-3 py-1 bg-purple-500/30 text-purple-200 text-sm w-fit rounded-lg mb-3">{detailProduct.category}</span>
              <h2 className="text-3xl font-bold mb-2">{detailProduct.title}</h2>
              <p className="text-sm text-gray-300 mb-4">{detailProduct.description}</p>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-2xl font-bold text-yellow-400">NT$ {detailProduct.price}</span>
                <span className="text-sm text-gray-400 line-through">NT$ {detailProduct.origin_price}</span>
              </div>
              <div className="mt-auto">
                <h3 className="text-sm font-bold text-white/60 mb-1">詳細說明</h3>
                <p className="text-sm text-gray-400">{detailProduct.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;