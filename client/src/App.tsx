import { CartPage } from "./Pages/CartPage";
import { HomePage } from "./Pages/HomePage";
import { LandingPage } from "./Pages/LandingPage";
import { CheckoutPage } from "./Pages/CheckoutPage";
import { TrackOrder } from "./Pages/TrackOrder";
import { OrderDetails } from "./Pages/OrderDetails";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/track-order/:id" element={<TrackOrder />} />
          <Route path="/order-details/:id" element={<OrderDetails />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

