import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import baseUrl from '../../config';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';

const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  // Fetch initial cart items if user is logged in
  useEffect(() => {
    const fetchCart = async () => {
      if (user?.id) {
        try {
          const res = await axios.get(`${baseUrl}api/cart/${user.id}`);
          setCartItems(res.data.items || []);
        } catch (err) {
          console.error('Error fetching cart:', err);
        }
      }
    };
    fetchCart();
  }, [user]);

  const syncCart = async (updatedCart) => {
    setCartItems(updatedCart);
    if (user?.id) {
      try {
        await axios.post(`${baseUrl}api/cart/${user.id}`, { items: updatedCart });
      } catch (err) {
        console.error('Failed to sync cart:', err);
      }
    }
  };

  const addToCart = (item) => {
    const existing = cartItems.find((i) => i._id === item._id);
    let updatedCart;
    if (existing) {
      updatedCart = cartItems.map((i) =>
        i._id === item._id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
      );
    } else {
      updatedCart = [...cartItems, { ...item, quantity: item.quantity || 1 }];
    }
    syncCart(updatedCart);
  };

  const removeOneFromCart = (id) => {
    const updatedCart = cartItems
      .map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i))
      .filter((i) => i.quantity > 0);
    syncCart(updatedCart);
  };

  const removeItemCompletely = (id) => {
    const updatedCart = cartItems.filter((i) => i._id !== id);
    syncCart(updatedCart);
  };

  const clearCart = () => {
    syncCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeOneFromCart,
        removeItemCompletely,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
