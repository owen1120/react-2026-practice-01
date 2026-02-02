export default function DeleteModal({ isOpen, tempProduct, deleteProduct, closeDeleteModal }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      
      <div className="bg-dark-bg-800 border border-dark-bg-700 shadow-2xl rounded-sm w-full max-w-md overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-dark-bg-700">
          <h3 className="text-xl font-bold text-white tracking-wide">
            確認刪除產品
          </h3>
          {/* 自製關閉按鈕 */}
          <button 
            onClick={closeDeleteModal}
            className="text-dark-text-500 hover:text-white transition p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-dark-text-300">
          <p className="mb-2 text-lg">
            您確定要刪除 <span className="text-red-400 font-bold mx-1">{tempProduct.title}</span> 嗎？
          </p>
          <p className="text-sm text-dark-text-500 flex items-center gap-2 mt-4 bg-dark-bg-900 p-3 rounded-sm border border-dark-bg-700">
            <span className="text-red-500 text-xl">⚠️</span>
            此動作無法復原 (Cannot be undone)
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-dark-bg-700 bg-dark-bg-900/50">
          <button
            type="button"
            className="px-4 py-2 border border-dark-text-500 text-dark-text-300 rounded-sm hover:bg-dark-bg-700 hover:text-white transition font-medium text-sm"
            onClick={closeDeleteModal}
          >
            取消 Cancel
          </button>
          
          <button
            type="button"
            className="px-6 py-2 bg-red-600 text-white font-bold rounded-sm hover:bg-red-500 shadow-lg shadow-red-900/30 transition text-sm tracking-wide"
            onClick={deleteProduct}
          >
            確認刪除 Delete
          </button>
        </div>
      </div>
    </div>
  );
}