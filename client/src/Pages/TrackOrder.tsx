import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import axios from "axios";
import { 
  ClipboardText, 
  CookingPot, 
  MopedFront, 
  CheckCircle,
  Receipt,
  Phone,
  MapPin,
  Clock
} from "@phosphor-icons/react";

export function TrackOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<string>("Order Received");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid Order Identifier");
      setLoading(false);
      return;
    }

    async function fetchStatus() {
      try {
        const response = await axios.get(`/api/orders/${id}/status`);
        setStatus(response.data?.status ?? "Order Received");
        setError(null);
      } catch (err) {
        console.error("Error fetching order status:", err);
        setError("Could not retrieve status for this order.");
      } finally {
        setLoading(false);
      }
    }

    // Initial fetch
    fetchStatus();

    // Poll every 5 seconds
    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, [id]);

  // Determine stage indexes:
  // 0: Order Placed (Always active)
  // 1: Preparing
  // 2: Out for Delivery
  // 3: Delivered
  const getStageIndex = (currentStatus: string): number => {
    switch (currentStatus) {
      case "Preparing":
        return 1;
      case "Out for the Delivery": // Matches server typo "Out for the Delivery"
      case "Out for Delivery":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0; // "Order Received" or others
    }
  };

  const activeStage = getStageIndex(status);

  // Timeline steps config
  const steps = [
    {
      title: "Order Placed",
      description: "We have received your order request",
      icon: ClipboardText,
    },
    {
      title: "Preparing Food",
      description: "Our top chefs are cooking your fresh meal",
      icon: CookingPot,
    },
    {
      title: "Out for Delivery",
      description: "Our delivery partner is on the way to you",
      icon: MopedFront,
    },
    {
      title: "Delivered",
      description: "Enjoy your delicious hot meal!",
      icon: CheckCircle,
    },
  ];

  const getStatusBannerMessage = (currentStatus: string) => {
    switch (currentStatus) {
      case "Preparing":
        return "Your meal is sizzlin' in the kitchen! 🍳";
      case "Out for the Delivery":
      case "Out for Delivery":
        return "Hot food is on the move! Stay close to your door. 🏍️";
      case "Delivered":
        return "Delivered! Savor the authentic Desi taste. 🍽️";
      default:
        return "Order accepted. We will start preparing shortly! 📋";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50/50">
        <NavBar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
          <p className="mt-4 text-gray-600 font-semibold animate-pulse">Checking order timeline...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !id) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50/50">
        <NavBar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center max-w-md w-full animate-fadeIn">
            <span className="text-5xl mb-4 block">🔍</span>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
            <p className="text-gray-500 mb-6">{error ?? "We couldn't locate this order in our records."}</p>
            <button
              onClick={() => navigate("/home")}
              className="rounded-xl bg-orange-600 px-6 py-2.5 font-bold text-white shadow-md hover:bg-orange-500 transition-colors cursor-pointer"
            >
              Order Something Else
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

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 md:px-8 py-12">
        {/* Main Status Container */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6 mb-8">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Identifier</span>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 mt-0.5">#{id.padStart(6, "0")}</h1>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-2xl font-black text-sm">
              <Clock size={18} weight="bold" />
              <span>
                {status === "Preparing" && "Est: 15-20 Mins"}
                {status === "Out for the Delivery" && "Est: 5-10 Mins"}
                {status === "Delivered" && "Arrived"}
                {status === "Order Received" && "Est: 30 Mins"}
              </span>
            </div>
          </div>

          {/* Banner message */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-5 rounded-2xl text-white font-bold mb-10 shadow-md">
            <p className="text-base md:text-lg">{getStatusBannerMessage(status)}</p>
          </div>

          {/* Vertical/Horizontal Timeline */}
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 md:py-4">
            
            {/* Progress line background (for larger screens) */}
            <div className="absolute left-[24px] top-6 bottom-6 w-0.5 bg-gray-100 md:left-6 md:right-6 md:top-6 md:h-1 md:w-auto -z-0"></div>
            
            {/* Active progress line bar */}
            <div 
              style={{
                height: window.innerWidth >= 768 ? "4px" : `${(activeStage / 3) * 100}%`,
                width: window.innerWidth >= 768 ? `${(activeStage / 3) * 100}%` : "2px"
              }} 
              className="absolute left-[24px] top-6 w-0.5 bg-orange-600 md:left-6 md:top-6 md:h-1 md:w-auto transition-all duration-700 -z-0"
            ></div>

            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = idx <= activeStage;
              const isCurrent = idx === activeStage;

              return (
                <div 
                  key={idx} 
                  className={`relative z-10 flex md:flex-col items-center md:items-center gap-4 md:gap-2.5 flex-1 w-full md:text-center transition-all ${
                    isCompleted ? "text-orange-600" : "text-gray-400"
                  }`}
                >
                  {/* Icon Circle Wrapper */}
                  <div 
                    className={`h-12 w-12 rounded-full border-2 flex items-center justify-center shadow-md transition-all duration-300 ${
                      isCompleted 
                        ? (isCurrent ? "bg-orange-600 border-orange-600 text-white scale-110 ring-4 ring-orange-100" : "bg-orange-50 border-orange-600 text-orange-600") 
                        : "bg-white border-gray-200 text-gray-400"
                    }`}
                  >
                    <StepIcon size={22} weight={isCompleted ? "fill" : "regular"} />
                  </div>

                  {/* Text Details */}
                  <div className="flex flex-col md:items-center text-left md:text-center">
                    <span className={`font-bold text-sm ${isCompleted ? "text-gray-900 font-extrabold" : "text-gray-500"}`}>
                      {step.title}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 max-w-[180px] leading-relaxed hidden sm:inline-block">
                      {step.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating receipt button and delivery card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Quick Details Contact Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <h3 className="text-base font-black text-gray-900 mb-4">Support & Care</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 text-sm text-gray-600">
                <div className="h-9 w-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Phone size={18} weight="fill" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold">Delivery Agent Call</p>
                  <p className="font-bold text-gray-800">+91 99887 76655</p>
                </div>
              </div>
              <div className="flex items-center gap-3.5 text-sm text-gray-600">
                <div className="h-9 w-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <MapPin size={18} weight="fill" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold">Store Location</p>
                  <p className="font-bold text-gray-800">Desi Bites Central Kitchen, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Link CTA Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-base font-black text-gray-900 mb-2">Need an Invoice?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                You can view the full billing items, breakdown of delivery fees, and address credentials from the official receipt.
              </p>
            </div>
            <button
              onClick={() => navigate(`/order-details/${id}`)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-orange-600 hover:bg-orange-50 py-3.5 font-bold text-orange-600 hover:text-orange-700 transition-all cursor-pointer"
            >
              <Receipt size={18} weight="fill" />
              <span>View Order Receipt</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
