import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { api } from "../Config";
import { ArrowLeft, Cardholder, ShieldCheck, Spinner } from "@phosphor-icons/react";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Loading & error states
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Pricing calculations
  const deliveryFee = cartTotal > 0 ? (cartTotal > 499 ? 0 : 40) : 0;
  const gst = cartTotal * 0.05;
  const grandTotal = cartTotal + deliveryFee + gst;

  // Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = "Customer name is required.";
    }

    if (!phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      errors.phone = "Please enter a valid 10-digit Indian Mobile Number (starting with 6-9).";
    }

    if (!address.trim()) {
      errors.address = "Delivery address is required.";
    } else if (address.length < 10) {
      errors.address = "Address must be at least 10 characters long.";
    } else if (address.length > 100) {
      errors.address = "Address must not exceed 100 characters.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    if (cart.length === 0) {
      setApiError("Your cart is empty. Please add items to place an order.");
      return;
    }

    setSubmitting(true);

    try {
      const itemsPayload = cart.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
      }));

      const response = await api.post("/api/orders", {
        name,
        address,
        phone,
        items: itemsPayload,
      });

      const placedOrder = response.data?.order;
      if (placedOrder && placedOrder.id) {
        clearCart();
        navigate(`/track-order/${placedOrder.id}`);
      } else {
        throw new Error("Invalid response schema from order creation API.");
      }
    } catch (error: any) {
      console.error("Order placement failed:", error);
      const serverMessage = error.response?.data?.message;
      setApiError(serverMessage ?? "Failed to place your order. Please check your inputs and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50/50">
        <NavBar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center max-w-md w-full">
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Cart is empty</h2>
            <p className="text-gray-500 mb-6">You need to have items in your cart to proceed with checkout.</p>
            <button
              onClick={() => navigate("/home")}
              className="rounded-xl bg-orange-600 px-6 py-2.5 font-bold text-white shadow-md hover:bg-orange-500 transition-colors cursor-pointer"
            >
              Browse Menu
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <NavBar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/cart")}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Checkout</h1>

        {apiError && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 rounded-2xl text-sm font-semibold">
            ⚠️ {apiError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6">Delivery Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-bold text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm ${
                    formErrors.name
                      ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                      : "border-gray-200 focus:ring-orange-500/20 focus:border-orange-500"
                  }`}
                />
                {formErrors.name && (
                  <span className="text-xs text-red-500 font-bold mt-1">{formErrors.name}</span>
                )}
              </div>

              {/* Mobile Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm font-bold text-gray-700">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold select-none">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className={`w-full pl-14 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm font-semibold tracking-wide ${
                      formErrors.phone
                        ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                        : "border-gray-200 focus:ring-orange-500/20 focus:border-orange-500"
                    }`}
                  />
                </div>
                {formErrors.phone && (
                  <span className="text-xs text-red-500 font-bold mt-1">{formErrors.phone}</span>
                )}
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="address" className="text-sm font-bold text-gray-700 flex justify-between">
                  <span>Delivery Address</span>
                  <span className={`text-xs ${address.length >= 10 && address.length <= 100 ? "text-gray-400" : "text-orange-500"}`}>
                    {address.length}/100 chars
                  </span>
                </label>
                <textarea
                  id="address"
                  rows={4}
                  placeholder="Enter house details, building name, street, locality (10-100 characters)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm resize-none ${
                    formErrors.address
                      ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                      : "border-gray-200 focus:ring-orange-500/20 focus:border-orange-500"
                  }`}
                />
                {formErrors.address && (
                  <span className="text-xs text-red-500 font-bold mt-1">{formErrors.address}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-orange-600 py-4 font-bold text-white text-base shadow-md hover:bg-orange-500 active:scale-98 disabled:opacity-75 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Spinner className="animate-spin" size={20} />
                    <span>Placing Your Order...</span>
                  </>
                ) : (
                  <>
                    <Cardholder size={20} weight="fill" />
                    <span>Confirm & Pay Cash on Delivery</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Checkout Item Summary Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-50 pb-3">Order Items</h2>
              
              {/* Mini Item List */}
              <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto no-scrollbar pr-1 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between py-3 items-center text-sm font-semibold">
                    <div className="flex gap-3 items-center">
                      <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded-md font-bold">
                        {item.quantity}x
                      </span>
                      <span className="text-gray-800 text-xs truncate max-w-[140px] md:max-w-none">{item.menuItem.name}</span>
                    </div>
                    <span className="text-gray-900 text-xs">₹{(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3.5 text-xs font-bold text-gray-500 border-b border-gray-50 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-800">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-gray-800">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST/Restaurant Fee (5%)</span>
                  <span className="text-gray-800">₹{gst.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Amount Payable</span>
                <span className="text-2xl font-black text-gray-900">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2 text-[10px] md:text-xs text-gray-500 bg-emerald-50/50 p-4 border border-emerald-100 rounded-2xl">
              <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" weight="fill" />
              <span>We support contactless cash/UPI delivery. Rest assured, your safety and satisfaction are our top priorities.</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
