import { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductsTab.css';
import baseUrl from '../../config';

const OffersTab = () => {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    originalPrice: '',
    discountPrice: '',
    store: 'rice',
    image: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('rice');
  const [expandedId, setExpandedId] = useState(null);

  const fetchOffers = async () => {
    try {
      const res = await axios.get(`${baseUrl}api/offers`);
      setOffers(res.data);
    } catch (err) {
      console.error('Error fetching offers:', err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      if (files && files[0]) reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      if (editingId) {
        await axios.put(`${baseUrl}api/offers/${editingId}`, form, {
          headers: { Authorization: token },
        });
      } else {
        await axios.post(`${baseUrl}api/offers`, form, {
          headers: { Authorization: token },
        });
      }
      setForm({ title: '', description: '', originalPrice: '', discountPrice: '', store: 'rice', image: '' });
      setEditingId(null);
      setShowForm(false);
      fetchOffers();
    } catch (err) {
      console.error('Error saving offer:', err);
    }
  };

  const handleEdit = (offer) => {
    setForm({
      title: offer.title,
      description: offer.description,
      originalPrice: offer.originalPrice,
      discountPrice: offer.discountPrice,
      store: offer.store,
      image: '',
    });
    setEditingId(offer._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${baseUrl}api/offers/${id}`, {
        headers: { Authorization: token },
      });
      fetchOffers();
    } catch (err) {
      console.error('Error deleting offer:', err);
    }
  };

  const filteredOffers = offers.filter(o => o.store === activeTab);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h3 className="fw-bold mb-2">Manage Offers</h3>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Offer
        </button>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'rice' ? 'active' : ''}`} onClick={() => setActiveTab('rice')}>
            Rice Store
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'grocery' ? 'active' : ''}`} onClick={() => setActiveTab('grocery')}>
            Grocery Store
          </button>
        </li>
      </ul>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-box shadow rounded p-4 bg-white">
            <h5 className="mb-3">{editingId ? 'Edit Offer' : 'Add Offer'}</h5>
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="form-control mb-2" required />
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="form-control mb-2" required />
              <input type="number" name="originalPrice" placeholder="Actual Price" value={form.originalPrice} onChange={handleChange} className="form-control mb-2" />
              <input type="number" name="discountPrice" placeholder="Offer Price" value={form.discountPrice} onChange={handleChange} className="form-control mb-2" />
              <select name="store" value={form.store} onChange={handleChange} className="form-select mb-2">
                <option value="rice">Rice Store</option>
                <option value="grocery">Grocery Store</option>
              </select>
              <input type="file" name="image" accept="image/*" onChange={handleChange} className="form-control mb-3" />
              <div className="d-flex justify-content-end flex-wrap gap-2">
                <button type="submit" className="btn btn-success">{editingId ? 'Update' : 'Add'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offer Cards */}
      <div className="row g-4">
        {filteredOffers.map(offer => (
          <div key={offer._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm border-0">
              {offer.image?.data && (
                <img
                  src={`data:${offer.image.contentType};base64,${offer.image.data}`}
                  alt={offer.title}
                  className="card-img-top img-fluid"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <div className="mt-auto">
                  <h6 className="card-title mb-2">{offer.title}</h6>
                  <div className="mb-1">
                    <span className="text-muted text-decoration-line-through me-2">₹{offer.originalPrice}</span>
                    <span className="fw-bold text-success">₹{offer.discountPrice}</span>
                  </div>
                </div>
                <p className="card-text text-muted mb-1" style={{ fontSize: '0.9rem' }}>
                  {expandedId === offer._id ? offer.description : `${offer.description.slice(0, 60)}... `}
                  {offer.description.length > 60 && (
                    <button className="btn btn-link btn-sm p-0" onClick={() => setExpandedId(prev => prev === offer._id ? null : offer._id)}>
                      {expandedId === offer._id ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </p>
              </div>
              <div className="card-footer bg-white border-0 d-flex justify-content-between">
                <button className="btn btn-outline-warning btn-sm" onClick={() => handleEdit(offer)}>Edit</button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(offer._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersTab;
 