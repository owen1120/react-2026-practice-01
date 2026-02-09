import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ScreenLoading from "../../components/ScreenLoading"; 

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`);
        setProducts(res.data.products);
      } catch (error) {
        console.error(error);
        Swal.fire("錯誤", "無法取得產品列表", "error");
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  return (
    <>
      <ScreenLoading isLoading={isLoading} />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-[fadeInDown_1s_ease-out]">
          <h2 className="text-tech-blue-500 font-bold tracking-[0.2em] mb-2 uppercase">Collection</h2>
          <h1 className="text-4xl font-black text-white">全系列產品</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link 
              key={product.id} 
              to={`/product/${product.id}`} 
              className="group block bg-dark-bg-900 border border-dark-bg-700 hover:border-tech-blue-500/50 transition duration-300 rounded-sm overflow-hidden hover:-translate-y-2"
            >
              <div className="aspect-4/3 overflow-hidden relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 border border-tech-blue-500">
                   NT$ {product.price}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1 truncate">{product.title}</h3>
                <p className="text-dark-text-500 text-sm mb-4">{product.category}</p>
                <div className="w-full py-2 border border-dark-bg-600 text-center text-sm font-bold text-dark-text-300 group-hover:bg-tech-blue-600 group-hover:text-white group-hover:border-tech-blue-600 transition">
                  查看詳情
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}