import React, { useEffect, useState, useContext } from 'react';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch both in parallel
        const [offersRes, productsRes] = await Promise.all([
          API.get('/offers'),
          API.get('/products')
        ]);

        // Preload images for faster display
        offersRes.data.forEach(o => o.image && new Image().src = o.image);
        productsRes.data.forEach(p => p.image && new Image().src = p.image);

        setOffers(offersRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('API fetch error:', error);
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

  const filteredProducts = products.filter(p => {
    const storeMatch = p.store?.toLowerCase() === activeTab.toLowerCase();
    const nameMatch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
                      p.title?.toLowerCase().includes(search.toLowerCase()) ||
                      p.description?.toLowerCase().includes(search.toLowerCase());
    const price = parseFloat(p.discountPrice || p.price || 0);
    const min = minPrice !== '' ? parseFloat(minPrice) : null;
    const max = maxPrice !== '' ? parseFloat(maxPrice) : null;
    const minMatch = min === null || price >= min;
    const maxMatch = max === null || price <= max;
    const typeMatch = !typeFilter || p.type?.toLowerCase() === typeFilter.toLowerCase() ||
                      p.title?.toLowerCase().includes(typeFilter.toLowerCase()) ||
                      p.name?.toLowerCase().includes(typeFilter.toLowerCase()) ||
                      p.description?.toLowerCase().includes(typeFilter.toLowerCase());
    return storeMatch && nameMatch && minMatch && maxMatch && typeMatch;
  });

  return (
    <div className="container-fluid px-3 px-sm-4 my-4">
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
      >
        {offers.map(offer => (
          <SwiperSlide key={offer._id}>
            <OfferCard offer={offer} onGrab={() => handleGrabOffer(offer)} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Filters */}
      <div className="row align-items-center my-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <div className="row g-2">
            <div className="col-6 col-md-4">
              <input type="number" className="form-control" placeholder="Min Price" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
            </div>
            <div className="col-6 col-md-4">
              <input type="number" className="form-control" placeholder="Max Price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
            </div>
            <div className="col-md-4">
              {activeTab === 'rice' && (
                <select className="form-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  <option value="">All Types</option>
                  <option value="Biryani Rice">Biryani Rice</option>
                  <option value="Raw Rice">Raw Rice</option>
                  <option value="Steamed Rice">Steamed Rice</option>
                  <option value="Brown Rice">Brown Rice</option>
                </select>
              )}
            </div>
            <div className="col-md-4">
              <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>Clear Filters</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs justify-content-center mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'rice' ? 'active' : ''}`} onClick={() => setActiveTab('rice')}>Rice Store</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'grocery' ? 'active' : ''}`} onClick={() => setActiveTab('grocery')}>Grocery Store</button>
        </li>
      </ul>

      {/* Products */}
      <div className="row g-3 g-sm-4">
        {loading ? <div className="text-center mt-4"><BeatLoader /></div> :
         filteredProducts.length === 0 ? <div className="text-center mt-4 text-muted">No products found</div> :
         filteredProducts.map(product => (
          <div key={product._id} className="col-6 col-sm-4 col-md-3 col-lg-2">
            <ProductCard product={product} onAdd={() => handleAddToCart(product)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
