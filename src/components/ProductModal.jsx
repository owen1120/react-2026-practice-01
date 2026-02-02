function ProductModal({ 
  isOpen,
  setIsOpen,
  modalType,
  tempProduct, 
  handleModalInputChange,
  handleUpdateProduct
}) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
      
      <div className="relative bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-3xl p-8 text-white overflow-y-auto max-h-[90vh] animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-6">
          {modalType === 'create' ? '建立新商品' : '編輯商品'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label>主圖網址</label>
              <input 
                name="imageUrl" 
                value={tempProduct.imageUrl} 
                onChange={handleModalInputChange} 
                className="p-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-blue-500" 
                placeholder="請輸入圖片網址" 
              />
              {tempProduct.imageUrl && (
                <img src={tempProduct.imageUrl} alt="主圖預覽" className="w-full h-48 object-cover rounded-lg border border-white/10" />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">標題</label>
              <input 
                name="title" 
                value={tempProduct.title} 
                onChange={handleModalInputChange} 
                className="w-full p-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-blue-500" 
                placeholder="請輸入產品標題" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">分類</label>
                <input 
                  name="category" 
                  value={tempProduct.category} 
                  onChange={handleModalInputChange} 
                  className="w-full p-2 rounded bg-white/10 border border-white/20" 
                  placeholder="例如: 衣服" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">單位</label>
                <input 
                  name="unit" 
                  value={tempProduct.unit} 
                  onChange={handleModalInputChange} 
                  className="w-full p-2 rounded bg-white/10 border border-white/20" 
                  placeholder="例如: 件" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">原價</label>
                <input 
                  type="number" 
                  name="origin_price" 
                  value={tempProduct.origin_price} 
                  onChange={handleModalInputChange} 
                  className="w-full p-2 rounded bg-white/10 border border-white/20" 
                  placeholder="輸入原價" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">售價</label>
                <input 
                  type="number" 
                  name="price" 
                  value={tempProduct.price} 
                  onChange={handleModalInputChange} 
                  className="w-full p-2 rounded bg-white/10 border border-white/20" 
                  placeholder="輸入售價" 
                />
              </div>
            </div>
            
            <hr className="border-white/10" />
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">產品描述</label>
              <textarea 
                name="description" 
                value={tempProduct.description} 
                onChange={handleModalInputChange} 
                className="w-full p-2 rounded bg-white/10 border border-white/20 h-20" 
                placeholder="產品描述"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">說明內容</label>
              <textarea 
                name="content" 
                value={tempProduct.content} 
                onChange={handleModalInputChange} 
                className="w-full p-2 rounded bg-white/10 border border-white/20 h-20" 
                placeholder="產品說明"
              ></textarea>
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
          <button onClick={() => setIsOpen(false)} className="px-6 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">取消</button>
          <button onClick={handleUpdateProduct} className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition shadow-lg font-bold">確認儲存</button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;