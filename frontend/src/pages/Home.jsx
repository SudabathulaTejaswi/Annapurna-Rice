import React, { useContext, useEffect, useState } from 'react';
import API from '../api';
import OfferCard from '../components/OfferCard';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { BeatLoader } from 'react-spinners';

SwiperCore.use([Navigation, Pagination, Autoplay]);

const Home = ({ user, openAuthModal }) => {
  const { addToCart } = useContext(CartContext);

  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('rice');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch products/offers & cache in localStorage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedProducts = localStorage.getItem('products');
        const cachedOffers = localStorage.getItem('offers');

        if (cachedProducts && cachedOffers) {
          setProducts(JSON.parse(cachedProducts));
          setOffers(JSON.parse(cachedOffers));
        }

        const offersRes = await API.get('/offers');
        const productsRes = await API.get('/products');

        const offersData = Array.isArray(offersRes.data) ? offersRes.data : [];
        const productsData = Array.isArray(productsRes.data) ? productsRes.data : [];

        setOffers(offersData);
        setProducts(productsData);

        localStorage.setItem('offers', JSON.stringify(offersData));
        localStorage.setItem('products', JSON.stringify(productsData));

        // Preload images asynchronously (won't block render)
        offersData.forEach(o => {
          if (typeof o.image === 'string') new Image().src = o.image;
        });
        productsData.forEach(p => {
          if (typeof p.image === 'string') new Image().src = p.image;
        });

      } catch (error) {
        console.error('API fetch error:', error);
        setOffers([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGrabOffer = (offer) => {
    if (!user) return openAuthModal();
    addToCart(offer);
    alert('Offer added to cart!');
  };

  const handleAddToCart = (product) => {
    if (!user) return openAuthModal();
    addToCart(product);
    alert('Product added to cart!');
  };

  const clearFilters = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setTypeFilter('');
    setActiveTab('rice');
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter((p) => {
        const storeMatch = p.store?.toLowerCase() === activeTab.toLowerCase();
        const nameMatch =
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase());

        const price = parseFloat(p.discountPrice || p.price || 0);
        const min = minPrice !== '' ? parseFloat(minPrice) : null;
        const max = maxPrice !== '' ? parseFloat(maxPrice) : null;

        const minMatch = min === null || price >= min;
        const maxMatch = max === null || price <= max;

        const typeMatch =
          !typeFilter ||
          p.type?.toLowerCase() === typeFilter.toLowerCase() ||
          p.title?.toLowerCase().includes(typeFilter.toLowerCase()) ||
          p.name?.toLowerCase().includes(typeFilter.toLowerCase()) ||
          p.description?.toLowerCase().includes(typeFilter.toLowerCase());

        return storeMatch && nameMatch && minMatch && maxMatch && typeMatch;
      })
    : [];

  return (
    <div className="container-fluid px-3 px-sm-4 my-4">
      {/* Offer Swiper */}
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
      >
        {offers.map((offer) => (
          <SwiperSlide key={offer._id}>
            <OfferCard offer={offer} onGrab={() => handleGrabOffer(offer)} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Search + Filters */}
      <div className="row align-items-center my-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row g-2">
            <div className="col-6 col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              {activeTab === 'rice' && (
                <select
                  className="form-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Biryani Rice">Biryani Rice</option>
                  <option value="Raw Rice">Raw Rice</option>
                  <option value="Steamed Rice">Steamed Rice</option>
                  <option value="Brown Rice">Brown Rice</option>
                </select>
              )}
            </div>
            <div className="col-md-4">
              <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex justify-content-center mt-3 mb-3">
        <ul className="nav nav-tabs w-auto">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'rice' ? 'active' : ''}`}
              onClick={() => setActiveTab('rice')}
            >
              Rice Store
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'grocery' ? 'active' : ''}`}
              onClick={() => setActiveTab('grocery')}
            >
              Grocery Store
            </button>
          </li>
        </ul>
      </div>

      {/* Product Grid */}
      <div className="row g-3 g-sm-4">
        {loading ? (
          <div className="text-center fw-bold mt-4">
            <BeatLoader />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center fw-bold mt-4 text-muted">
            <i className="bi bi-box-seam"></i> No products found
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={product._id}>
              <ProductCard product={product} onAdd={() => handleAddToCart(product)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
