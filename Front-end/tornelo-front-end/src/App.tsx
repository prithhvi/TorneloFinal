import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShopPage from './pages/ShopPage';
import AddProductPage from './pages/AddProductPage';
import ProductCard from './components/ProductCard';
import EditProductPage from './pages/EditProductPage';
import AnalyticPage from './pages/AnalyticPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import EditShippingPage from './pages/EditShippingPage';
import LoginPage from './pages/LoginPage';
import UserShopPage from './pages/UserShopPage';
import Protected from "./services/Protected";

function App() {
  let userRole = sessionStorage.getItem('USER_ROLE')
  return (
    <Router>
      <Routes>
      
        <Route path="/" element={<LoginPage />} />
        <Route path="/shop" element={<UserShopPage />} />
        <Route path="/shop-admin" element={<Protected isLoggedIn={(userRole == "ROLE_ADMIN")}><ShopPage /></Protected>} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/analytic" element={<AnalyticPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/edit-product/:id" element={<EditProductPage />} />
        <Route path="/edit-shipping/:id" element={<EditShippingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
