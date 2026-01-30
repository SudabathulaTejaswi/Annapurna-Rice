import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AuthModal from "./components/AuthModal";
import AdminLogin from "./components/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import CartModal from "./components/CartModal";
import CartProvider from "./context/CartProvider";
import ProductsProvider from "./context/ProductsContext";

// Lazy loaded components
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const ProductDetails = lazy(() => import("./components/ProductDetails"));
const UserOrders = lazy(() => import("./pages/UserOrders"));
const CartPage = lazy(() => import("./pages/CartPage"));

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
      <main className="flex-grow-1" style={{ minHeight: "100vh" }}>
        {children}
      </main>
      <Footer />
      {authModalOpen && <AuthModal closeModal={() => setAuthModalOpen(false)} setUser={setUser} />}
      {cartModalOpen && <CartModal user={user} close={() => setCartModalOpen(false)} />}
    </>
  );

  return (
    <ProductsProvider>
      <CartProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Suspense fallback={<div className="text-center my-5">Loading...</div>}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <PublicLayout>
                      <Home onGrabOffer={openAuthModal} user={user} openAuthModal={openAuthModal} />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/product/:id"
                  element={
                    <PublicLayout>
                      <ProductDetails />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <PublicLayout>
                      <UserOrders user={user} />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <PublicLayout>
                      <CartPage user={user} />
                    </PublicLayout>
                  }
                />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </CartProvider>
    </ProductsProvider>
  );
}

export default App;
