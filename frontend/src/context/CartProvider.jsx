import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import baseUrl from '../../config';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';

const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    axios.get(`${baseUrl}api/cart/${user.id}`).then(res => {
      setCartItems(res.data.items || []);
    });
  }, [user]);

  const syncCart = async (updated) => {
    setCartItems(updated);
    if (user?.id) {
      await axios.post(`${baseUrl}api/cart/${user.id}`, { items: updated });
    }
  };

  const addToCart = (item) => {
    const existing = cartItems.find(
      i => i._id === item._id && i.quantityLabel === item.quantityLabel
    );

    let updated;
    if (existing) {
      updated = cartItems.map(i =>
        i._id === item._id && i.quantityLabel === item.quantityLabel
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      updated = [...cartItems, { ...item, quantity: 1 }];
    }
    syncCart(updated);
  };

  const removeOneFromCart = (id, label) => {
    syncCart(
      cartItems
        .map(i =>
          i._id === id && i.quantityLabel === label
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter(i => i.quantity > 0)
    );
  };

  const removeItemCompletely = (id, label) => {
    syncCart(cartItems.filter(i => !(i._id === id && i.quantityLabel === label)));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeOneFromCart,
        removeItemCompletely,
        clearCart: () => syncCart([]),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
