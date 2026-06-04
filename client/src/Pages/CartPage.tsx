import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { Plus, Minus, Trash, ArrowLeft, ShieldCheck } from "@phosphor-icons/react";

export function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  // Pricing calculations
  const deliveryFee = cartTotal > 0 ? (cartTotal > 499 ? 0 : 40) : 0;
  const gst = cartTotal * 0.05; // 5% GST
  const grandTotal = cartTotal + deliveryFee + gst;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <NavBar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-12">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate("/home")}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
          <span>Back to Menu</span>
        </button>

        <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Your Cart Summary</h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-gray-100 rounded-3xl shadow-sm text-center max-w-2xl mx-auto">
            <div className="h-24 w-24 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 text-5xl mb-6">
              🛒
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Looks like you haven't added anything to your cart yet. Explore our delicious Indian recipes and satisfy your cravings!
            </p>
            <button
              onClick={() => navigate("/home")}
              className="rounded-xl bg-orange-600 px-6 py-3 font-bold text-white shadow-md hover:bg-orange-500 transition-colors cursor-pointer"
            >
              Order Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const imageUrl = item.menuItem.imageUrl && item.menuItem.imageUrl !== "https://google.com"
                  ? item.menuItem.imageUrl
                  : `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600`;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Item Image and Title */}
                    <div className="flex gap-4 items-center flex-1">
                      <img
                        src={imageUrl}
                        alt={item.menuItem.name}
                        className="h-20 w-20 rounded-xl object-cover border border-gray-50 shrink-0"
                      />
                      <div className="space-y-1">
                        <h3 className="font-bold text-gray-900">{item.menuItem.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1 max-w-md">{item.menuItem.description}</p>
                        <span className="text-sm font-bold text-orange-600 block sm:hidden">
                          ₹{item.menuItem.price.toFixed(2)} each
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls & Prices */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                      {/* Price per unit (large screens) */}
                      <span className="hidden sm:inline text-sm font-bold text-gray-500 whitespace-nowrap">
                        ₹{item.menuItem.price.toFixed(2)} each
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1 shrink-0">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm text-gray-600 active:scale-95 transition-all cursor-pointer"
                        >
                          <Minus size={14} weight="bold" />
                        </button>
                        <span className="w-8 text-center text-sm font-extrabold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm text-gray-600 active:scale-95 transition-all cursor-pointer"
                        >
                          <Plus size={14} weight="bold" />
                        </button>
                      </div>

                      {/* Line Item Total & Delete */}
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-black text-gray-900 min-w-[70px] text-right">
                          ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Checkout Card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-6">Payment Summary</h2>

              <div className="space-y-4 text-sm font-semibold text-gray-600 border-b border-gray-100 pb-6">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="text-gray-900">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Charges</span>
                  <span className={deliveryFee === 0 ? "text-emerald-600 font-bold" : "text-gray-900"}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[11px] text-orange-500 bg-orange-50 p-2.5 rounded-lg font-medium leading-relaxed">
                    💡 Add items worth <b>₹{ (500 - cartTotal).toFixed(0) }</b> more for <b>FREE Delivery</b>!
                  </p>
                )}
                <div className="flex justify-between">
                  <span>GST & Restaurant Charges (5%)</span>
                  <span className="text-gray-900">₹{gst.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Price */}
              <div className="flex justify-between items-end py-6">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Grand Total</span>
                  <span className="text-3xl font-black text-gray-900">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Shield */}
              <div className="flex gap-2.5 items-center mb-6 text-xs text-gray-500 bg-gray-50 p-3 rounded-2xl border border-gray-100 leading-normal">
                <ShieldCheck size={28} className="text-emerald-600 shrink-0" weight="fill" />
                <span>Secure payment and sanitation standard protocols applied for safe dining experience.</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full rounded-2xl bg-orange-600 py-4 font-bold text-white text-base shadow-md hover:bg-orange-500 hover:shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
