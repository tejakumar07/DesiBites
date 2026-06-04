import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "@phosphor-icons/react";

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  const handleMenuClick = () => {
    if (location.pathname === "/home") {
      const menuSection = document.getElementById("our-menu");
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/home");
      setTimeout(() => {
        const menuSection = document.getElementById("our-menu");
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-3">
        {/* Logo Section */}
        <div 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="relative overflow-hidden rounded-full w-12 h-12 flex items-center justify-center bg-orange-50 border border-orange-100 shadow-inner group-hover:scale-105 transition-transform">
            <img
              className="w-10 h-10 object-contain"
              src="https://gjqfonnmbxvokzokauix.supabase.co/storage/v1/object/public/DesiBites/Logo.png"
              alt="Desi Bites Logo"
            />
          </div>
          <span className="font-extrabold text-xl md:text-2xl bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:to-amber-400 transition-all">
            Desi Bites
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
          <button
            onClick={() => navigate("/")}
            className={`hover:text-orange-600 transition-colors duration-200 cursor-pointer ${
              location.pathname === "/" ? "text-orange-600 font-bold" : ""
            }`}
          >
            Home
          </button>
          <button
            onClick={handleMenuClick}
            className="hover:text-orange-600 transition-colors duration-200 cursor-pointer"
          >
            Menu
          </button>
          <button
            onClick={() => navigate("/about")}
            className="hover:text-orange-600 transition-colors duration-200 cursor-pointer text-gray-400 cursor-not-allowed"
            disabled
          >
            About Us
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="hover:text-orange-600 transition-colors duration-200 cursor-pointer text-gray-400 cursor-not-allowed"
            disabled
          >
            Contact
          </button>
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-4">
          {/* Cart Icon with animated badge */}
          <button
            onClick={() => navigate("/cart")}
            className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all duration-300 cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingCart size={26} weight="regular" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Quick Order Button */}
          <button
            onClick={() => navigate("/home")}
            className="hidden sm:inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Order Now
          </button>
        </div>
      </div>
    </header>
  );
}
