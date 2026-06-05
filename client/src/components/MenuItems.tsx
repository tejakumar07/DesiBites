import { api } from "../Config";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
}

// Indian standard food label symbols
function VegSymbol() {
  return (
    <div className="w-4 h-4 border-2 border-emerald-600 flex items-center justify-center bg-white shrink-0">
      <div className="w-2 h-2 rounded-full bg-emerald-600" />
    </div>
  );
}

function NonVegSymbol() {
  return (
    <div className="w-4 h-4 border-2 border-rose-700 flex items-center justify-center bg-white shrink-0">
      <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-rose-700" />
    </div>
  );
}

export function MenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering and searching states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all"); // 'all' | 'veg' | 'non-veg'
  
  // Feedback states for items added to cart
  const [addedItemIds, setAddedItemIds] = useState<Record<number, boolean>>({});

  const { addToCart } = useCart();

  useEffect(() => {
    async function getMenuItems() {
      try {
        const response = await api.get("/api/menu");
        const menuItems = Array.isArray(response.data)
          ? response.data
          : response.data?.menu;

        setItems(menuItems ?? []);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
        setError("Failed to load menu items.");
      } finally {
        setLoading(false);
      }
    }

    getMenuItems();
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    
    // Set feedback state
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    
    // Reset feedback after 1 second
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1000);
  };

  // Filter items based on category and search query
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      activeCategory === "all" ||
      (activeCategory === "veg" && item.isVeg) ||
      (activeCategory === "non-veg" && !item.isVeg);
      
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
        <p className="mt-4 text-gray-600 font-semibold animate-pulse">Delivering delicious options to your screen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-4">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="rounded-lg bg-orange-600 px-4 py-2 text-white font-bold hover:bg-orange-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section id="our-menu" className="py-16 px-4 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <span className="text-orange-600 font-extrabold text-sm uppercase tracking-widest">Our Culinary Offerings</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">Explore Our Menu</h2>
        </div>
        
        {/* Category Selector & Search */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          
          {/* Filter Pills */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveCategory("veg")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCategory === "veg" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              <VegSymbol />
              Veg
            </button>
            <button
              onClick={() => setActiveCategory("non-veg")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCategory === "non-veg" ? "bg-rose-600 text-white shadow-sm" : "text-gray-600 hover:text-rose-600"
              }`}
            >
              <NonVegSymbol />
              Non-Veg
            </button>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 max-w-xl mx-auto">
          <MagnifyingGlass className="mx-auto text-gray-300 mb-4 animate-bounce" size={48} />
          <h3 className="text-lg font-bold text-gray-700 mb-1">No dishes match your criteria</h3>
          <p className="text-gray-500 text-sm">Try tweaking your search keywords or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const isAdded = addedItemIds[item.id];
            
            const imageUrl = item.imageUrl && item.imageUrl !== "https://google.com" 
              ? item.imageUrl 
              : `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600`;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image & Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-50">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {item.isVeg ? (
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-sm">
                        <VegSymbol />
                        Veg
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200 shadow-sm">
                        <NonVegSymbol />
                        Non-Veg
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Content */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2 flex-1">
                    {item.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-2xl font-black text-gray-900">
                      ₹{item.price.toFixed(2)}
                    </span>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`relative overflow-hidden rounded-xl px-5 py-2.5 text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-orange-600 text-white hover:bg-orange-500"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <span>Added</span>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} weight="bold" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
