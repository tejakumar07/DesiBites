import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { api } from "../Config";
import { ArrowLeft, Printer, ShieldCheck, ShoppingBagOpen, MapPin, Phone, User, Calendar } from "@phosphor-icons/react";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  menuItem: MenuItem;
}

interface Order {
  id: number;
  customerName: string;
  address: string;
  phone: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
  totalPrice: number;
}

export function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid Order ID");
      setLoading(false);
      return;
    }

    async function fetchOrderDetails() {
      try {
        const response = await api.get(`/api/orders/${id}`);
        setOrder(response.data?.order ?? null);
        setError(null);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to retrieve invoice details for this order.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50/50">
        <NavBar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
          <p className="mt-4 text-gray-600 font-semibold animate-pulse">Generating your receipt...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50/50">
        <NavBar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center max-w-md w-full">
            <span className="text-5xl mb-4 block">📄</span>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Invoice Not Found</h2>
            <p className="text-gray-500 mb-6">{error ?? "We could not find matching invoice details."}</p>
            <button
              onClick={() => navigate("/home")}
              className="rounded-xl bg-orange-600 px-6 py-2.5 font-bold text-white shadow-md hover:bg-orange-500 transition-colors cursor-pointer"
            >
              Back to Menu
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Pricing calculations
  const subtotal = order.totalPrice;
  const deliveryFee = subtotal > 499 ? 0 : 40;
  const gst = subtotal * 0.05;
  const grandTotal = subtotal + deliveryFee + gst;

  // Format date
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 print:bg-white print:min-h-0">
      {/* Hide header and footer during printing */}
      <div className="print:hidden">
        <NavBar />
      </div>

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 md:px-8 py-12">
        {/* Navigation Breadcrumb (hidden on print) */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <button
            onClick={() => navigate(`/track-order/${order.id}`)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
            <span>Back to Status Tracker</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2 text-xs font-bold text-gray-700 shadow-sm cursor-pointer"
          >
            <Printer size={16} />
            <span>Print Invoice</span>
          </button>
        </div>

        {/* Invoice Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden print:border-none print:shadow-none print:p-0">
          
          {/* Header section with watermark style logo */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-gray-100 pb-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100">
                <img
                  className="w-9 h-9 object-contain"
                  src="https://gjqfonnmbxvokzokauix.supabase.co/storage/v1/object/public/DesiBites/Logo.png"
                  alt="Desi Bites Logo"
                />
              </div>
              <div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Desi Bites Receipt</span>
                <h1 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                  Order Invoice
                </h1>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Order ID</span>
              <span className="font-extrabold text-gray-900 text-lg">#{String(order.id).padStart(6, "0")}</span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
            {/* Delivery address details */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Delivery Details</h3>
              <div className="space-y-2.5 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-orange-600 shrink-0" />
                  <span className="font-semibold text-gray-800">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-orange-600 shrink-0" />
                  <span className="font-semibold text-gray-800">+91 {order.phone}</span>
                </div>
                <div className="flex items-start gap-2 leading-relaxed">
                  <MapPin size={16} className="text-orange-600 shrink-0 mt-0.5" />
                  <span className="font-semibold text-gray-800">{order.address}</span>
                </div>
              </div>
            </div>

            {/* Order stats */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Order Meta Info</h3>
              <div className="space-y-2.5 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-orange-600 shrink-0" />
                  <span className="font-semibold text-gray-800">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-bold">Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    order.status === "Delivered" 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                      : "bg-orange-50 text-orange-700 border border-orange-100"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-bold">Payment Method:</span>
                  <span className="font-semibold text-gray-800">Cash on Delivery / UPI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="mb-8 overflow-x-auto">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Itemized Bill</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3">Menu Item</th>
                  <th className="pb-3 text-center">Price</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 pr-4">
                      <p className="font-bold text-gray-900">{item.menuItem.name}</p>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{item.menuItem.description}</p>
                    </td>
                    <td className="py-4 text-center">₹{item.menuItem.price.toFixed(2)}</td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right font-bold text-gray-900">
                      ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Checkout pricing sum list */}
          <div className="border-t border-gray-100 pt-6 flex flex-col items-end">
            <div className="w-full sm:w-64 space-y-3.5 text-sm font-semibold text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="text-gray-900">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST / Restaurant Fee (5%)</span>
                <span className="text-gray-900">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Paid Amount</span>
                <span className="text-2xl font-black text-orange-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Verification seal */}
          <div className="mt-10 flex gap-2.5 items-center text-xs text-gray-500 bg-gray-50 p-4 border border-gray-100 rounded-2xl leading-normal">
            <ShieldCheck size={26} className="text-emerald-600 shrink-0" weight="fill" />
            <span>Thank you for dining with Desi Bites! If you have queries about your order, please contact customer support.</span>
          </div>
        </div>

        {/* Back to Home Action Button */}
        <div className="mt-8 flex justify-center print:hidden">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 rounded-2xl bg-orange-600 hover:bg-orange-500 px-8 py-3.5 font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <ShoppingBagOpen size={18} weight="fill" />
            <span>Order Something Else</span>
          </button>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}