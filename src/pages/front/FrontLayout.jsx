import { Outlet, Link, useLocation } from "react-router-dom";

export default function FrontLayout() {
  const location = useLocation();
  const routes = [
    { path: "/", name: "首頁" },
    { path: "/products", name: "產品列表" },
    { path: "/cart", name: "購物車" },
    { path: "/admin", name: "前往後台" },
  ];

  return (
    <>
      <nav className="bg-dark-bg-800 text-white p-4 sticky top-0 z-50 border-b border-dark-bg-700 shadow-lg shadow-tech-blue-900/20">
        <div className="container mx-auto flex justify-between items-center">
          {/* LOGO 區塊 */}
          <Link to="/" className="text-2xl font-bold tracking-wider hover:text-tech-blue-400 transition duration-300 flex items-center gap-2">
            <span className="bg-tech-blue-500 w-2 h-8 block skew-x-[-15deg]"></span>
            KEYBOARD-TECH
          </Link>
          
          {/* 選單連結 */}
          <ul className="flex gap-6 font-medium">
            {routes.map((route) => {
               const isActive = location.pathname === route.path;
               return (
                <li key={route.path}>
                  <Link 
                    to={route.path} 
                    className={`relative px-2 py-1 transition duration-300 tracking-wide
                      ${isActive 
                        ? 'text-tech-blue-400' 
                        : 'text-dark-text-300 hover:text-white'
                      }
                      after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 
                      after:bg-tech-blue-500 after:transition-transform after:duration-300
                      ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}
                    `}
                  >
                    {route.name}
                  </Link>
                </li>
               )
            })}
          </ul>
        </div>
      </nav>

      {/* 頁面內容渲染區 */}
      <Outlet />
    </>
  );
}