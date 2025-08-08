import { useState } from 'react';
import ProductsTab from '../components/ProductsTab';
import OffersTab from '../components/OffersTab';
import AdminOrders from './AdminOrders';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="bg-dark text-white p-3">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-12 col-md-4 text-center text-md-start mb-2 mb-md-0">
              <h4 className="m-0">Annapurna Rice and General Stores<br></br> Admin Panel </h4>
            </div>
            <div className="col-12 col-md-8 text-center text-md-end">
              <div className="btn-group flex-wrap justify-content-center">
                <button
                  className={`btn btn-${activeTab === 'products' ? 'light' : 'outline-light'} me-2 mb-2`}
                  onClick={() => setActiveTab('products')}
                >
                  Products
                </button>
                <button
                  className={`btn btn-${activeTab === 'offers' ? 'light' : 'outline-light'} me-2 mb-2`}
                  onClick={() => setActiveTab('offers')}
                >
                  Offers
                </button>
                <button
                  className={`btn btn-${activeTab === 'orders' ? 'light' : 'outline-light'} me-3 mb-2`}
                  onClick={() => setActiveTab('orders')}
                >
                  Orders
                </button>
                <button className="btn btn-danger mb-2" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container my-4 flex-grow-1">
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'offers' && <OffersTab />}
        {activeTab === 'orders' && <AdminOrders />}
      </main>

      {/* Footer */}
      <footer className="bg-light p-3 border-top text-center">
        &copy; {new Date().getFullYear()} Annapurna Grocery & Rice Shop. Admin Panel.
      </footer>
    </div>
  );
};

export default AdminDashboard;
