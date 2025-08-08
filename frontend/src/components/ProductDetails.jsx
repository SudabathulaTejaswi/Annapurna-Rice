import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; // ✅ Added useNavigate
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { FaCartPlus, FaArrowLeft } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Initialize navigate
  const { product: stateProduct } = location.state || {};
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (stateProduct) {
      setProduct(stateProduct);
    } else {
      axios.get(`/api/products/${id}`)
        .then(res => setProduct(res.data))
        .catch(err => console.error(err));
    }
  }, [id, stateProduct]);

  if (!product) return <div className="text-center my-5">Loading product details...</div>;

  const {
    name,
    description,
    price,
    discountPrice,
    type,
    unit,
    image
  } = product;

  const imageSrc = image?.data
    ? `data:${image.contentType};base64,${image.data}`
    : image;

  return (
    <div className="container my-5">
      {/* ✅ Back Button */}
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" />
        Back
      </button>

      <div className="row g-4 text-center">
        <div className="col-md-6 text-center">
          <img
            src={imageSrc}
            alt={name}
            className="img-fluid rounded shadow"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold">{name}</h2>
          {type && <p className="text-muted mb-1">Type: {type}</p>}
          {unit && <p className="text-muted">Unit: {unit}</p>}

          <div className="my-3">
            {discountPrice ? (
              <>
                <h4 className="text-success fw-bold">₹{discountPrice}</h4>
                <small className="text-muted text-decoration-line-through">₹{price}</small>
              </>
            ) : (
              <h4 className="text-success fw-bold">₹{price}</h4>
            )}
          </div>

          {description && <p className="mt-3">{description}</p>}

          <button
            className="btn btn-warning mt-4 px-4"
            onClick={() => addToCart(product)}
          >
            <FaCartPlus className="me-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
