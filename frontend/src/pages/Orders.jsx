import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/orders/user', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setOrders(r.data));
  }, [token]);

  const cancel = async (id) => {
    await axios.delete(`/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOrders(o => o.map(x => x._id === id ? { ...x, status:'cancelled' } : x));
  };

  return (
    <>
      <h2>My Orders</h2>
      {orders.map(o => (
        <div key={o._id} className="card mb-2 p-2">
          <div>Total: ₹{o.totalPrice}</div>
          <div>Status: {o.status}</div>
          {o.status === 'pending' && <button className="btn btn-danger btn-sm mt-2" onClick={()=>cancel(o._id)}>Cancel</button>}
        </div>
      ))}
    </>
  );
}
