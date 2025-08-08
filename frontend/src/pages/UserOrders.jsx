import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import baseUrl from '../../config';

const UserOrders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`${baseUrl}api/orders/user/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
    fetchOrders();
  }, [user]);

  const handleReorder = async (orderId) => {
    try {
      const order = orders.find((o) => o._id === orderId);
      if (!order) return alert('Order not found');

      const items = order.items.map((i) => ({
        product: i.product?._id || i.product,
        name: i.name || i.product?.name || 'Unnamed',
        quantity: i.quantity,
        price: i.price,
      }));

      const res = await axios.post(`${baseUrl}api/orders/reorder/${orderId}`, { items });
      alert('Reorder placed successfully!');
      console.log("Reordered successfully:", res.data);
    } catch (err) {
      console.error('Error reordering:', err);
      alert('Failed to reorder. Please try again.');
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await axios.put(`${baseUrl}api/orders/cancel/${orderId}`);
      console.log('Order cancelled:', res.data);
      alert('Order cancelled successfully');
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: 'cancelled' } : o))
      );
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">My Orders</h2>
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" />
        Back
      </button>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="list-group">
          {orders.map((order) => (
            <div
              key={order._id}
              className={`list-group-item mb-4 shadow-sm p-3 rounded border border-${order.status === 'cancelled' ? 'danger' : 'light'}`}
            >
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`badge bg-${order.status === 'cancelled' ? 'danger' : 'info'}`}>
                  {order.status}
                </span>
              </p>
              <p><small>{new Date(order.createdAt).toLocaleString()}</small></p>

              <h6 className="mt-3">Items:</h6>
              {order.items?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name || item.product?.name || item.title || 'Unnamed Item'}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price || item.discountPrice}</td>
                          <td>₹{item.price * item.quantity || item.discountPrice * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No item info available.</p>
              )}

              <p className="fw-bold text-end">Final Price: ₹{order.total}</p>

              <div className="d-flex gap-2 flex-wrap mt-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleReorder(order._id)}
                  disabled={order.status === 'cancelled'}
                >
                  Reorder
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleCancel(order._id)}
                  disabled={order.status === 'cancelled'}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
