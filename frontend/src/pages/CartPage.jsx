import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import baseUrl from '../../config';
import { FaPlus, FaMinus, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';

const CartPage = ({ user }) => {
  const navigate = useNavigate();
  const {
    cartItems,
    addToCart,
    removeOneFromCart,
    removeItemCompletely,
    clearCart,
  } = useContext(CartContext);

  const userId = user?.id;
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [success, setSuccess] = useState('');
  const [err, setErr] = useState('');
  const [backendTotal, setBackendTotal] = useState(0);
  const [orderPlacedSuccessfully, setOrderPlacedSuccessfully] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || item.discountPrice || 0) * (item.quantity || 1),
    0
  );

  const handleOrder = async (e) => {
    e.preventDefault();
    setSuccess('');
    setErr('');

    if (!name || !phone || !address) {
      setErr('Please fill in all delivery details.');
      return;
    }

    if (cartItems.length === 0) {
      setErr('Cannot place an empty order.');
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}api/orders`, {
        userId,
        name,
        phone,
        address,
        items: cartItems,
        total,
      });

      setBackendTotal(response.data.total);
      setSuccess(`Order placed successfully! Order ID: ${response.data._id}`);
      setOrderPlacedSuccessfully(true);
      clearCart();
    } catch (error) {
      if (error.response) {
        setErr(error.response.data.message || 'Server error');
      } else {
        setErr('Order failed. Try again later.');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">My Cart</h2>
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" /> Back
      </button>

      {cartItems.length === 0 && !orderPlacedSuccessfully ? (
        <div className="text-center text-muted py-5">
          <span style={{ fontSize: '2.5rem' }}>🛍️</span>
          <div className="mt-2">No items in cart.</div>
        </div>
      ) : (
        <>
          <div className="list-group mb-4">
            {cartItems.map((item, idx) => (
              <div
                className="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded mb-3"
                key={idx}
              >
                <div>
                  <div className="fw-semibold">{item.name || item.title}</div>
                  <div className="d-flex align-items-center mt-1">
                    <button
                      className="btn btn-sm p-1 me-2"
                      onClick={() =>
                        item.quantity > 1
                          ? removeOneFromCart(item._id)
                          : removeItemCompletely(item._id)
                      }
                    >
                      {item.quantity > 1 ? <FaMinus size={12} /> : <FaTrashAlt size={12} />}
                    </button>
                    <span className="mx-2 small fw-bold">Qty: {item.quantity}</span>
                    <button
                      className="btn btn-sm p-1"
                      onClick={() => addToCart({ ...item, quantity: 1 })}
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>
                <span className="fw-bold text-success">
                  ₹{(item.price || item.discountPrice) * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="mb-3 text-end">
            <span className="fs-5 fw-bold">
              Total: <span className="text-primary">₹{orderPlacedSuccessfully ? backendTotal : total}</span>
            </span>
          </div>

          {success && (
            <div className="alert alert-success py-2" style={{ whiteSpace: 'pre-wrap' }}>
              ✅ {success}
            </div>
          )}

          {err && <div className="alert alert-danger py-2">{err}</div>}

          <form onSubmit={handleOrder} className="p-3 rounded-3 border bg-light">
            <div className="mb-2">
              <label className="form-label fw-semibold">Name</label>
              <input
                className="form-control"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={orderPlacedSuccessfully}
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label fw-semibold">Phone</label>
              <input
                className="form-control"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={orderPlacedSuccessfully}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Address</label>
              <textarea
                className="form-control"
                placeholder="Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={orderPlacedSuccessfully}
                required
              />
            </div>
            <button
              className="btn btn-success w-100 py-2 fs-5"
              type="submit"
              disabled={!cartItems.length || orderPlacedSuccessfully}
            >
              🛵 Confirm Order
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CartPage;
