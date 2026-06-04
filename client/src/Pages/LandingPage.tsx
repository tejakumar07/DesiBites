import { Footer } from "@/components/Footer";
import { NavBar } from "../components/NavBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto relative">
      <NavBar />
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto object-cover"
      >
        <source
          src="https://gjqfonnmbxvokzokauix.supabase.co/storage/v1/object/public/DesiBites/LandingPage%20Main%20Stream.mp4"
          type="video/mp4"
        />
      </video>

      <div className="bg-white p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-6">
            <h1 className="font-bold text-5xl leading-tight">
              Taste the real India, delivered to your doorstep.
            </h1>
            <p className="text-2xl text-gray-700">
              Experience authentic Indian cuisine with the convenience of modern
              delivery. Fresh ingredients, traditional recipes, and a taste of
              home, right when you crave it.
            </p>
            <div className="flex gap-4 mt-2">
              <Button onClick={() => navigate("/home")}>Order now</Button>
              <Button variant="outline" onClick={() => navigate("/home")}>
                View menu
              </Button>
            </div>
          </div>
          <img
            className="w-full h-400px object-cover rounded-xl shadow-lg"
            src="https://gjqfonnmbxvokzokauix.supabase.co/storage/v1/object/public/DesiBites/LandingPage%20Cover.webp"
            alt="Delicious Indian food"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}