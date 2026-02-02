import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// === 前台頁面 ===
import FrontLayout from "./pages/front/FrontLayout";
import HomePage from "./pages/front/HomePage";
import ProductsPage from "./pages/front/ProductsPage";
import ProductDetailPage from "./pages/front/ProductDetailPage";
import CartPage from "./pages/front/CartPage";

// === 後台頁面 ===
import LoginPage from "./pages/admin/LoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProductsPage from "./pages/admin/AdminProductsPage";

const router = createHashRouter([
  {
    path: "/",
    element: <FrontLayout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />, 
    children: [
      {
        path: "products",
        element: <AdminProductsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)