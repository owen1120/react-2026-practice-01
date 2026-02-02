import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductModal({ isOpen, tempProduct, getProducts, closeProductModal, isNew }) {
  const [modalData, setModalData] = useState(tempProduct);

  useEffect(() => {
    if (isOpen) {
      setModalData({
        ...tempProduct,
        imagesUrl: tempProduct.imagesUrl || [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setModalData({
      ...modalData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...modalData.imagesUrl];
    newImages[index] = value;
    setModalData({ ...modalData, imagesUrl: newImages });
  };

  const addImage = () => {
    const newImages = [...modalData.imagesUrl, ""];
    setModalData({ ...modalData, imagesUrl: newImages });
  };

  const removeImage = () => {
    const newImages = [...modalData.imagesUrl];
    newImages.pop();
    setModalData({ ...modalData, imagesUrl: newImages });
  };

  const submit = async () => {
    const dataToSend = {
      ...modalData,
      origin_price: Number(modalData.origin_price),
      price: Number(modalData.price),
    };

    try {
      let api = `${API_BASE}/api/${API_PATH}/admin/product`;
      let method = "post";

      if (!isNew) {
        api = `${API_BASE}/api/${API_PATH}/admin/product/${modalData.id}`;
        method = "put";
      }

      await axios[method](api, { data: dataToSend });
      
      Swal.fire({
        icon: 'success',
        title: isNew ? '新增成功' : '更新成功',
        showConfirmButton: false,
        timer: 1500,
        background: '#1f1f1f',
        color: '#ffffff'
      });

      getProducts();
      closeProductModal();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '操作失敗',
        text: error.response?.data?.message,
        background: '#1f1f1f',
        color: '#ffffff'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-dark-bg-800 border border-dark-bg-700 w-full max-w-4xl rounded-sm shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-5 border-b border-dark-bg-700">
          <h3 className="text-xl font-bold text-white tracking-wide">
            {isNew ? "建立新產品" : "編輯產品"}
          </h3>
          <button onClick={closeProductModal} className="text-dark-text-500 hover:text-white transition">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-bold text-dark-text-300 mb-2">主要圖片網址</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={modalData.imageUrl || ""}
                  onChange={handleInputChange}
                  className="w-full bg-dark-bg-900 border border-dark-bg-700 text-white p-2 rounded-sm focus:border-tech-blue-500 outline-none"
                  placeholder="請輸入圖片連結"
                />
                {modalData.imageUrl && (
                  <img src={modalData.imageUrl} alt="主圖" className="w-full h-40 object-cover mt-2 rounded-sm border border-dark-bg-700" />
                )}
              </div>

              <div className="border-t border-dark-bg-700 pt-4">
                 <label className="block text-sm font-bold text-dark-text-300 mb-2">更多圖片</label>
                 {modalData.imagesUrl?.map((url, index) => (
                   <div key={index} className="mb-3">
                     <input
                        type="text"
                        value={url}
                        onChange={(e) => handleImageChange(e, index)}
                        className="w-full bg-dark-bg-900 border border-dark-bg-700 text-white p-2 rounded-sm focus:border-tech-blue-500 outline-none mb-1"
                        placeholder={`圖片網址 ${index + 1}`}
                      />
                      {url && <img src={url} alt={`圖 ${index+1}`} className="w-full h-24 object-cover rounded-sm" />}
                   </div>
                 ))}
                 
                 <div className="flex gap-2 mt-2">
                   {(!modalData.imagesUrl?.length || modalData.imagesUrl[modalData.imagesUrl.length - 1]) && (
                     <button onClick={addImage} className="flex-1 py-2 border border-tech-blue-500 text-tech-blue-500 rounded-sm hover:bg-tech-blue-500 hover:text-white transition text-sm font-bold">
                       新增圖片
                     </button>
                   )}
                   {modalData.imagesUrl?.length > 0 && (
                     <button onClick={removeImage} className="flex-1 py-2 border border-red-500 text-red-500 rounded-sm hover:bg-red-500 hover:text-white transition text-sm font-bold">
                       刪除最後一張
                     </button>
                   )}
                 </div>
              </div>
            </div>

            <div className="col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-bold text-dark-text-300 mb-2">標題</label>
                <input
                  type="text"
                  name="title"
                  value={modalData.title || ""}
                  onChange={handleInputChange}
                  className="w-full bg-dark-bg-900 border border-dark-bg-700 text-white p-2 rounded-sm focus:border-tech-blue-500 outline-none"
                  placeholder="請輸入產品標題"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-dark-text-300 mb-2">分類</label>
                  <input
                    type="text"
                    name="category"
                    value={modalData.category || ""}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg-900 border border-dark-bg-700 text-white p-2 rounded-sm focus:border-tech-blue-500 outline-none"
                    placeholder="例如：鍵盤"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-dark-text-300 mb-2">單位</label>
                  <input
                    type="text"
                    name="unit"
                    value={modalData.unit || ""}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg-900 border border-dark-bg-700 text-white p-2 rounded-sm focus:border-tech-blue-500 outline-none"
                    placeholder="例如：個、組"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-dark-text-300 mb-2">原價</label>
                  <input
                    type="number"
                    name="origin_price"
                    value={modalData.origin_price || ""}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg-900 border border-dark-bg-700 text-white p-2 rounded-sm focus:border-tech-blue-500 outline-none"
                    placeholder="請輸入原價"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-dark-text-300 mb-2">售價</label>
                  <input
                    type="number"
                    name="price"
                    value={modalData.price || ""}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg-900 border border-dark-bg-700 text-white p-2 rounded-sm focus:border-tech-blue-500 outline-none"
                    placeholder="請輸入售價"
                  />
                </div>
              </div>

              <hr className="border-dark-bg-700 my-4" />

              <div>
                <label className="block text-sm font-bold text-dark-text-300 mb-2">產品描述</label>
                <textarea
                  name="description"
                  value={modalData.description || ""}
                  onChange={handleInputChange}
                  className="w-full bg-dark-bg-900 border border-dark-bg-700 text-white p-2 rounded-sm focus:border-tech-blue-500 outline-none h-20"
                  placeholder="請輸入產品描述"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-dark-text-300 mb-2">說明內容</label>
                <textarea
                  name="content"
                  value={modalData.content || ""}
                  onChange={handleInputChange}
                  className="w-full bg-dark-bg-900 border border-dark-bg-700 text-white p-2 rounded-sm focus:border-tech-blue-500 outline-none h-24"
                  placeholder="請輸入詳細說明內容"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  id="is_enabled"
                  type="checkbox"
                  name="is_enabled"
                  checked={modalData.is_enabled || false}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-tech-blue-500"
                />
                <label htmlFor="is_enabled" className="text-white font-bold cursor-pointer">
                  是否啟用
                </label>
              </div>

            </div>
          </div>
        </div>

        <div className="p-4 border-t border-dark-bg-700 flex justify-end gap-3 bg-dark-bg-900/50 rounded-b-sm">
           <button 
             onClick={closeProductModal}
             className="px-6 py-2 border border-dark-text-500 text-dark-text-300 rounded-sm hover:bg-dark-bg-700 hover:text-white transition font-bold"
           >
             取消
           </button>
           <button 
             onClick={submit}
             className="px-6 py-2 bg-tech-blue-600 text-white rounded-sm hover:bg-tech-blue-500 shadow-lg shadow-tech-blue-900/30 transition font-bold"
           >
             確認儲存
           </button>
        </div>

      </div>
    </div>
  );
}