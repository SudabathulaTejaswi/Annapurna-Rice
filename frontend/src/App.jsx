import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AuthModal from './components/AuthModal';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import CartModal from './components/CartModal';
import ProductDetails from './components/ProductDetails';
import UserOrders from './pages/UserOrders';
import CartPage from './pages/CartPage';

import CartProvider from './context/CartProvider';

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const openAuthModal = () => setAuthModalOpen(true);

  const PublicLayout = ({ children }) => (
    <>
      <Header
        onLogin={openAuthModal}
        onLogout={handleLogout}
        user={user}
        onCart={() => setCartModalOpen(true)}
      />
      <main className="flex-grow-1" style={{ minHeight: '100vh' }}>{children}</main>
      <Footer />
      {authModalOpen && (
        <AuthModal closeModal={() => setAuthModalOpen(false)} setUser={setUser} />
      )}
      {cartModalOpen && (
        <CartModal user={user} close={() => setCartModalOpen(false)} />
      )}
    </>
  );

  return (
    <CartProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Routes>
            <Route path="/" element={
              <PublicLayout>
                <Home user={user} openAuthModal={openAuthModal} />
              </PublicLayout>
            } />
            <Route path="/product/:id" element={
              <PublicLayout>
                <ProductDetails />
              </PublicLayout>
            } />
            <Route path="/orders" element={
              <PublicLayout>
                <UserOrders user={user} />
              </PublicLayout>
            } />
            <Route path="/cart" element={
              <PublicLayout>
                <CartPage user={user} />
              </PublicLayout>
            } />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
