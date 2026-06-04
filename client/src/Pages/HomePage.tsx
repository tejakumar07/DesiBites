import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { HorizontalScrolling } from "@/components/HorizontalScrolling";
import { MenuItems } from "@/components/MenuItems";

export function HomePage() {
  return (
    <div>
      <NavBar />
      <HorizontalScrolling />
      <p></p>
      <MenuItems />
      <Footer />
    </div>
  );
}
