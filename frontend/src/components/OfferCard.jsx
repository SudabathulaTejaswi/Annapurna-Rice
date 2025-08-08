import React, { useState, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

// Utility to generate a random pastel color
const getRandomPastel = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, 95%)`;
};

const MAX_DESCRIPTION_LENGTH = 100;

const OfferCard = ({ offer, onGrab }) => {
  const bgColor = getRandomPastel();
  const [readMore, setReadMore] = useState(false);

  const { user } = useAuth();
  const { addToCart } = useContext(CartContext);

  const isLongText = offer.description.length > MAX_DESCRIPTION_LENGTH;
  const displayedText = readMore
    ? offer.description
    : offer.description.slice(0, MAX_DESCRIPTION_LENGTH) + (isLongText ? '...' : '');

  const handleAdd = (e) => {
    e.stopPropagation();
    if (user) {
      const offerWithDetails = { 
        _id: offer._id,
        title: offer.title || 'Special Offer',
        price: offer.discountPrice,
      };
      addToCart(offerWithDetails); 
    } else {
      onGrab?.({ ...offer, title: offer.title }); // fallback for guest users
    }
  };

  return (
    <div className="container-fluid my-4">
      <div
        className="row align-items-center shadow rounded p-4"
        style={{
          backgroundColor: bgColor,
          minHeight: '550px',
        }}
      >
        {/* Image Section */}
        <div className="col-md-5 text-center mb-3 mb-md-0">
          {offer.image && (
            <img
              src={`data:${offer.image.contentType};base64,${offer.image.data}`}
              alt={offer.title}
              className="img-fluid rounded"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
            />
          )}
        </div>

        {/* Content Section */}
        <div className="col-md-7 text-center text-md-start">
          <h3 className="fw-bold mb-3">{offer.title}</h3>

          <p className="mb-2">
            {displayedText}
            {isLongText && (
              <button
                className="btn btn-link p-0 ms-1"
                style={{ fontSize: '0.9rem' }}
                onClick={() => setReadMore(!readMore)}
              >
                {readMore ? 'Show Less' : 'Read More'}
              </button>
            )}
          </p>

          {offer.originalPrice && offer.discountPrice && (
            <>
              <div className="mb-3">
                <span className="text-muted text-decoration-line-through me-2">
                  ₹{offer.originalPrice}
                </span>
                <span className="fw-bold text-primary fs-5 me-2">
                  ₹{offer.discountPrice}
                </span>
                <span className="text-success fw-semibold">
                  Save ₹{offer.originalPrice - offer.discountPrice}
                </span>
              </div>

              <button
                className="btn btn-primary fw-bold px-4 py-2"
                onClick={handleAdd}
              >
                Grab Offer
              </button>
            </>
          )}  
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
