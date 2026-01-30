import React, { useContext, memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import { FaCartPlus, FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = memo(({ product, onAdd }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, addToCart, removeOneFromCart, removeItemCompletely } =
    useContext(CartContext);

  const [selectedQty, setSelectedQty] = useState(
    product.quantities?.[0] || null
  );

  const imageSrc = product.image?.data
    ? `data:${product.image.contentType};base64,${product.image.data}`
    : product.image;

  const priceToShow = selectedQty?.price ?? product.price;

  const inCartItem = cartItems.find(
    item =>
      item._id === product._id &&
      item.quantityLabel === (selectedQty?.label || 'default')
  );

  const quantity = inCartItem?.quantity || 0;

  const handleViewProduct = () => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    const payload = {
      ...product,
      price: priceToShow,
      quantityLabel: selectedQty?.label || 'default',
    };

    if (user) addToCart(payload);
    else onAdd?.(payload);
  };

  return (
    <div className="card product-card h-100 position-relative">
      <div onClick={handleViewProduct} style={{ cursor: 'pointer' }}>
        {imageSrc && (
          <img
            src={imageSrc}
            alt={product.name}
            className="card-img-top product-image"
            loading="lazy"
          />
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h6 className="fw-semibold">{product.name}</h6>
        <p className="text-muted small two-line-truncate">
          {product.description}
        </p>

        {/* Quantity selector */}
        {product.quantities?.length > 0 && (
          <select
            className="form-select form-select-sm mb-2"
            value={selectedQty?.label}
            onChange={(e) =>
              setSelectedQty(
                product.quantities.find(q => q.label === e.target.value)
              )
            }
          >
            {product.quantities.map((q, i) => (
              <option key={i} value={q.label}>
                {q.label} – ₹{q.price}
              </option>
            ))}
          </select>
        )}

        <div className="fw-bold text-success">₹{priceToShow}</div>
      </div>

      {/* Cart controls */}
      {inCartItem ? (
        <div className="position-absolute bottom-0 end-0 m-2 d-flex bg-white rounded shadow-sm">
          <button
            className="btn btn-sm"
            onClick={() =>
              quantity > 1
                ? removeOneFromCart(inCartItem._id, inCartItem.quantityLabel)
                : removeItemCompletely(inCartItem._id, inCartItem.quantityLabel)
            }
          >
            {quantity > 1 ? <FaMinus /> : <FaTrashAlt />}
          </button>
          <span className="px-2">{quantity}</span>
          <button className="btn btn-sm" onClick={handleAdd}>
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          className="btn btn-warning btn-sm position-absolute bottom-0 end-0 m-2"
          onClick={handleAdd}
        >
          <FaCartPlus /> Add
        </button>
      )}
    </div>
  );
});

export default ProductCard;
