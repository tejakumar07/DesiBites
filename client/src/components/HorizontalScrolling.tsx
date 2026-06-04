import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export function HorizontalScrolling() {
  const railRef = useRef<HTMLDivElement | null>(null);

  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    async function fetchTrendingItems() {
      try {
        const response = await axios.get("/api/menu");

        const menuItems = response.data.menu;

        const randomItems = [...menuItems]
          .sort(() => Math.random() - 0.5)
          .slice(0, 10);

        setItems(randomItems);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTrendingItems();
  }, []);

  const moveRail = (direction: "left" | "right") => {
    const rail = railRef.current;

    if (!rail) return;

    const distance = rail.clientWidth * 0.75;

    rail.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trending Dishes</h2>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => moveRail("left")}>
            Prev
          </Button>

          <Button onClick={() => moveRail("right")}>Next</Button>
        </div>
      </div>

      <div ref={railRef} className="flex gap-4 overflow-x-auto no-scrollbar">
        {items.map((item) => (
          <div
            key={item.id}
            className="w-72 shrink-0 overflow-hidden rounded-xl bg-white shadow"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="font-bold">{item.name}</h3>

              <p className="mt-2 text-sm text-gray-500">{item.description}</p>

              <p className="mt-3 font-bold text-orange-600">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
