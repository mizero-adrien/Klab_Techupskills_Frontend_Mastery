import { Routes, Route, Link } from 'react-router';
import HomePage from './pages/HomePage.tsx';
import ProductsPage from './pages/ProductsPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import CartPage from './pages/CartPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

import './App.css';

function App(){
  return (
    <div>
    <nav className = "flex gap-4 bg-slate-800 p-4 text-2xl text-white">
      <Link to = "/">Home</Link>
      <Link to = "/products">Products</Link>
      <Link to = "/login">Login</Link>
      <Link to = "/cart">Cart</Link>
      
    </nav>

    <Routes>
      <Route path = "/" element = {<HomePage />} />
      <Route path = "/products" element = {<ProductsPage />} />
      <Route path = "/login" element = {<LoginPage />} />
      <Route path = "/cart" element = {<CartPage />} />
      <Route path = "*" element = {<NotFoundPage />} />
    </Routes>
    </div>

  )
}

export default App;


