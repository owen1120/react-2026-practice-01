import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ProductModal from "../../components/ProductModal";
import DeleteModal from "../../components/DeleteModal";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});

  const [tempProduct, setTempProduct] = useState({});
  const [isNew, setIsNew] = useState(false);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  async function getProducts(page = 1) {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.dir(error);
      Swal.fire({
        icon: "error",
        title: "取得產品失敗",
        text: error.response?.data?.message || "無法連線至伺服器",
        background: '#1f1f1f',
        color: '#ffffff'
      });
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const token = document.cookie.replace(
          /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

        if (token) {
          axios.defaults.headers.common['Authorization'] = token;
          await getProducts();
        } else {
          await Swal.fire({
            icon: "warning",
            title: "請先登入",
            background: '#1f1f1f',
            color: '#ffffff'
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    init(); 
  }, []); 

  // === Modal 控制 ===
  const openProductModal = (status, product) => {
    if (status === "create") {
      setTempProduct({ imagesUrl: [] });
      setIsNew(true);
    } else {
      setTempProduct({ ...product });
      setIsNew(false);
    }
    setIsProductModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setTempProduct(product);
    setIsDeleteModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${tempProduct.id}`);
      
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "產品已刪除",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: '#1f1f1f',
        color: '#ffffff'
      });

      getProducts(); 
      closeDeleteModal(); 
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "刪除失敗",
        text: error.response?.data?.message || error.message,
        background: '#1f1f1f',
        color: '#ffffff'
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-wide border-l-4 border-tech-blue-500 pl-4">
          產品列表管理
        </h2>
        <button
          onClick={() => openProductModal("create")}
          className="bg-tech-blue-600 text-white px-4 py-2 rounded-sm font-bold hover:bg-tech-blue-500 transition shadow-lg shadow-tech-blue-900/20"
        >
          + 建立新產品
        </button>
      </div>

      <div className="bg-dark-bg-800 rounded-sm shadow-xl overflow-hidden border border-dark-bg-700">
        <table className="w-full text-left">
          <thead className="bg-dark-bg-900 text-dark-text-300 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-4 w-32">分類</th>
              <th className="p-4">產品名稱</th>
              <th className="p-4 text-right">原價</th>
              <th className="p-4 text-right">售價</th>
              <th className="p-4 text-center">狀態</th>
              <th className="p-4 text-center">編輯</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-bg-700">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-dark-bg-700/50 transition duration-150">
                <td className="p-4 text-tech-blue-400 font-bold text-sm">
                  {product.category}
                </td>
                <td className="p-4 font-medium text-white">
                  {product.title}
                </td>
                <td className="p-4 text-right text-dark-text-500">
                  {product.origin_price}
                </td>
                <td className="p-4 text-right font-bold text-white">
                  {product.price}
                </td>
                <td className="p-4 text-center">
                  {product.is_enabled ? (
                    <span className="text-green-400 text-xs font-bold border border-green-400/30 bg-green-900/20 px-2 py-1 rounded-sm">
                      啟用中
                    </span>
                  ) : (
                    <span className="text-dark-text-500 text-xs font-bold">
                      未啟用
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openProductModal("edit", product)}
                      className="text-tech-blue-400 hover:text-white border border-tech-blue-400/50 hover:bg-tech-blue-600 hover:border-transparent px-3 py-1 rounded-sm text-sm transition"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => openDeleteModal(product)}
                      className="text-red-400 hover:text-white border border-red-400/50 hover:bg-red-600 hover:border-transparent px-3 py-1 rounded-sm text-sm transition"
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <nav>
           <ul className="flex gap-1">
             <li className={`${!pagination.has_pre && 'opacity-50 pointer-events-none'}`}>
               <button onClick={() => getProducts(pagination.current_page - 1)} className="px-3 py-1 bg-dark-bg-800 border border-dark-bg-700 text-dark-text-300 hover:bg-dark-bg-700 rounded-sm">
                 &lt;
               </button>
             </li>
             {Array.from({ length: pagination.total_pages }).map((_, i) => (
               <li key={i}>
                 <button
                   onClick={() => getProducts(i + 1)}
                   className={`px-3 py-1 border rounded-sm transition ${
                     pagination.current_page === i + 1
                       ? "bg-tech-blue-600 border-tech-blue-600 text-white"
                       : "bg-dark-bg-800 border-dark-bg-700 text-dark-text-300 hover:bg-dark-bg-700"
                   }`}
                 >
                   {i + 1}
                 </button>
               </li>
             ))}
             <li className={`${!pagination.has_next && 'opacity-50 pointer-events-none'}`}>
               <button onClick={() => getProducts(pagination.current_page + 1)} className="px-3 py-1 bg-dark-bg-800 border border-dark-bg-700 text-dark-text-300 hover:bg-dark-bg-700 rounded-sm">
                 &gt;
               </button>
             </li>
           </ul>
        </nav>
      </div>

      <ProductModal 
         isOpen={isProductModalOpen} 
         tempProduct={tempProduct} 
         getProducts={getProducts} 
         closeProductModal={closeProductModal} 
         isNew={isNew}
      />
      
      <DeleteModal 
         isOpen={isDeleteModalOpen} 
         tempProduct={tempProduct} 
         deleteProduct={deleteProduct} 
         closeDeleteModal={closeDeleteModal} 
      />
    </div>
  );
}