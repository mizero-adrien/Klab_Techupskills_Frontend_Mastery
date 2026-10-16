import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "./index.css";
import App from "./App.tsx";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { OrdersProvider } from "./context/OrdersContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
  <AuthProvider>
    <CartProvider>
      <OrdersProvider>
        <App />
      </OrdersProvider>
    </CartProvider>
  </AuthProvider>
</BrowserRouter>
  </StrictMode>
);