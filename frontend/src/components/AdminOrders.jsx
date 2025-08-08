import React, { useEffect, useState } from 'react';
import axios from 'axios';
import baseUrl from '../../config';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('pending');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${baseUrl}api/orders`);
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch {
      setOrders([]);
    }
  };

  const updateStatus = async (id, status) => {
    const confirmed = window.confirm(`Are you sure to mark this order as ${status}?`);
    if (!confirmed) return;
    try {
      await axios.put(`${baseUrl}api/orders/${id}`, { status });
      fetchOrders();
    } catch {
      alert('Failed to update status');
    }
  };

  const deleteOrder = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this order?');
    if (!confirmed) return;
    try {
      await axios.delete(`${baseUrl}api/orders/${id}`);
      fetchOrders();
    } catch {
      alert('Delete failed');
    }
  };

  const sendWhatsApp = (order) => {
    let phone = prompt('Enter WhatsApp number (with country code, e.g. 919876543210):', order.phone);
    if (!phone) return;

    const itemList = order.items.map(i => `${i.name} x1`).join('\n');
    const msg =
      `Hello,\n` +
      `Order Details:\n` +
      `Name: ${order.name}\n` +
      `Phone: ${order.phone}\n` +
      `Address: ${order.address}\n` +
      `Items:\n${itemList}\n` +
      `Total: ₹${order.total}\n` +
      `Status: ${order.status}\n` +
      `Please proceed with delivery.`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const filtered = orders.filter(o => o.status === tab);
  const totalRevenue = orders.filter(o => o.status === 'completed')
                              .reduce((sum, o) => sum + o.total, 0);

  const btnStyle = {
    borderRadius: '0.4rem',
    fontWeight: 600,
    minWidth: '10px',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3 text-center">Admin Orders Panel</h3>

      <ul className="nav nav-tabs justify-content-left mb-3">
        {['pending', 'completed', 'rejected'].map(t => (
          <li className="nav-item" key={t}>
            <button
              className={`nav-link ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
              style={{ cursor: 'pointer' }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {tab === 'completed' && (
        <div className="text-center mb-3 fw-bold">Total Revenue: ₹{totalRevenue}</div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o._id}>
                <td>{o.name}</td>
                <td>{o.phone}</td>
                <td>{o.address}</td>
                <td className="text-start">
                  <ul className="list-unstyled mb-0">
                    {Array.isArray(o.items) && o.items.map((i, idx) => (
                      <li key={idx}>
                        {i.name} x{i.quantity || 1}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>₹{o.total}</td>
                <td className={`fw-bold text-capitalize ${
                  o.status === 'completed' ? 'text-success' :
                  o.status === 'rejected' ? 'text-danger' :
                  'text-warning'
                }`}>{o.status}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>
                  {tab === 'pending' && (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2 mb-2"
                        style={btnStyle}
                        onClick={() => updateStatus(o._id, 'completed')}
                      >
                        Completed
                      </button>
                      <button
                        className="btn btn-danger btn-sm me-2 mb-2"
                        style={{ ...btnStyle, minWidth: '90px' }}
                        onClick={() => updateStatus(o._id, 'rejected')}
                      >
                        Reject
                      </button>
                      <button
                        className="btn btn-info btn-sm mb-2"
                        style={{ ...btnStyle, minWidth: '110px', color: 'white' }}
                        onClick={() => sendWhatsApp(o)}
                      >
                        WhatsApp
                      </button>
                    </>
                  )}
                  {tab === 'rejected' && (
                    <>
                      <button
                        className="btn btn-warning btn-sm me-2 mb-2"
                        style={{ ...btnStyle, minWidth: '110px' }}
                        onClick={() => updateStatus(o._id, 'pending')}
                      >
                        Move to Pending
                      </button>
                      <button
                        className="btn btn-success btn-sm me-2 mb-2"
                        style={btnStyle}
                        onClick={() => updateStatus(o._id, 'completed')}
                      >
                        Mark Completed
                      </button>
                    </>
                  )}
                  <button
                    className="btn btn-sm"
                    style={{
                      ...btnStyle,
                      color: 'red',
                      backgroundColor: 'transparent',
                      border: '1px solid red',
                      boxShadow: 'none',
                      padding: '0.2rem 0.4rem',
                      marginLeft: '0.5rem'
                    }}
                    onClick={() => deleteOrder(o._id)}
                    title="Delete order"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="9" className="text-muted fst-italic">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
