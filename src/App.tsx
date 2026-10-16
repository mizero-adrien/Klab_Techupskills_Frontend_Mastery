import { Routes, Route } from "react-router";
import MainLayout from "./components/layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import NotFoundPage from "./pages/NotFoundPage";
import CategoriesPage from "./pages/CategoriesPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";



function App() {
  return (
  
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
      
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/cart" element={<CartPage />} />
<Route path="/checkout" element={<CheckoutPage />} />
<Route path="/order-success/:id" element={<OrderSuccessPage />} />
      </Route>
    </Routes>

  );
}

export default App;

