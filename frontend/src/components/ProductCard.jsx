import React, { useContext, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import { FaCartPlus, FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 

// ✅ memoized to prevent unnecessary re-renders
const ProductCard = memo(({ product, onAdd }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, addToCart, removeOneFromCart, removeItemCompletely } = useContext(CartContext);

  const imageSrc = product.image?.data
    ? `data:${product.image.contentType};base64,${product.image.data}`
    : product.image;

  const inCartItem = cartItems.find(item => item._id === product._id);
  const quantity = inCartItem?.quantity || 0;

  const handleViewProduct = () => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    if (user) {
      addToCart(product);     
    } else {
      onAdd?.(product);      
    }
  };

  return (
    <div className="card product-card h-100 position-relative">
      <div className="position-relative" onClick={handleViewProduct} style={{ cursor: 'pointer' }}>
        {imageSrc && (
          <img
            src={imageSrc}
            alt={product.name}
            className="card-img-top product-image"
            loading="lazy" // ✅ lazy load for faster render
          />
        )}

        {inCartItem && (
          <div className="position-relative m-2 d-flex align-items-center bg-white rounded px-2 py-1 shadow-sm">
            <button
              className="btn btn-sm p-1"
              onClick={(e) => {
                e.stopPropagation();
                quantity > 1
                  ? removeOneFromCart(product._id)
                  : removeItemCompletely(product._id);
              }}
            >
              {quantity > 1 ? <FaMinus size={12} /> : <FaTrashAlt size={12} />}
            </button>
            <span className="mx-2 small fw-bold">Qty: {quantity}</span>
            <button
              className="btn btn-sm p-1"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
            >
              <FaPlus size={12} />
            </button>
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h6 className="card-title fw-semibold">{product.name}</h6>
          <p className="card-text text-muted small two-line-truncate">{product.description}</p>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className="text-success fw-bold">₹{product.price}</span>
        </div>
      </div>

      {!inCartItem && (
        <div className="position-absolute bottom-0 end-0 m-2">
          <button className="btn btn-sm btn-warning shadow" onClick={handleAdd}>
            <FaCartPlus /> Add
          </button>
        </div>
      )}
    </div>
  );
});

export default ProductCard;
