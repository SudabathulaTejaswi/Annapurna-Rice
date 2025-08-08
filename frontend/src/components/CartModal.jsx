import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { FaPlus, FaMinus, FaTrashAlt } from 'react-icons/fa';
import baseUrl from '../../config';


export default function CartModal({ user, close }) {
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
      setErr('Please fill in all delivery details (Name, Phone, Address).');
      return;
    }

    if (cartItems.length === 0) {
      setErr('Cannot place an empty order. Please add items to your cart.');
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}api/orders`, {
        userId: userId,
        name,
        phone,
        address,
        items: cartItems,
        total,
      });

      const orderIdFromBackend = response.data._id;
      const totalFromBackend = response.data.total;
      setBackendTotal(totalFromBackend);

      setSuccess(`Order placed successfully!\nOrder ID: ${orderIdFromBackend || 'N/A'}\nTotal: ₹${totalFromBackend}`);
      setOrderPlacedSuccessfully(true);
      clearCart();
    } catch (error) {
      if (error.response) {
        setErr(`Order failed: ${error.response.data.message || 'Server error. Please try again.'}`);
      } else if (error.request) {
        setErr('Order failed: No response from server. Please check your network connection.');
      } else {
        setErr('Order failed: An unexpected error occurred.');
      }
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="cartModalLabel"
      aria-hidden="true"
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content rounded-4 shadow-lg border-0">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold" id="cartModalLabel">
              <span role="img" aria-label="cart" className="me-2">🛒</span>
              Your Cart & Delivery
            </h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={close}></button>
          </div>
          <div className="modal-body">
            {cartItems.length === 0 && !orderPlacedSuccessfully ? (
              <div className="text-center text-muted py-5">
                <span style={{ fontSize: '2.5rem' }}>🛍️</span>
                <div className="mt-2">No items in cart.</div>
              </div>
            ) : (
              <>
                <ul className="list-group mb-3">
                  {cartItems.map((item, idx) => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom"
                      key={idx}
                      style={{ background: 'transparent' }}
                    >
                      <div>
                        <div className="fw-semibold">{item.name || item.description}</div>
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
                    </li>
                  ))}
                </ul>

                <div className="mb-3 text-end">
                  <span className="fs-5 fw-bold">
                    Total: <span className="text-primary">₹{orderPlacedSuccessfully ? backendTotal : total}</span>
                  </span>
                </div>

                {success && (
                  <div className="alert alert-success py-2 animate__animated animate__fadeInDown" style={{ whiteSpace: 'pre-wrap' }}>
                    <span role="img" aria-label="success" style={{ fontSize: '1.5rem' }}>✅</span>
                    <span className="ms-2">{success}</span>
                  </div>
                )}

                <form onSubmit={handleOrder} className="p-3 rounded-3" style={{ background: '#f8f9fa' }}>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Name</label>
                    <input
                      className="form-control"
                      placeholder="Name"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      disabled={orderPlacedSuccessfully}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Phone</label>
                    <input
                      className="form-control"
                      placeholder="Phone"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      disabled={orderPlacedSuccessfully}
                    />
                    
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Address</label>
                    <textarea
                      className="form-control"
                      placeholder="Address"
                      required
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      disabled={orderPlacedSuccessfully}
                    />
                  </div>
                  {err && <div className="alert alert-danger py-2">{err}</div>}
                  <button
                    className="btn btn-success w-100 py-2 fs-5"
                    type="submit"
                    disabled={!cartItems.length || success || orderPlacedSuccessfully}
                  >
                    <span role="img" aria-label="confirm" className="me-2">🛵</span>
                    Confirm Order
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
