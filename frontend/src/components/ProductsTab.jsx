import React, { useEffect, useState } from 'react';
import axios from 'axios';
import baseUrl from '../../config';

const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [store, setStore] = useState('');
  const [image, setImage] = useState(null);

  // 🔹 NEW: quantity variants
  const [quantities, setQuantities] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${baseUrl}api/products`);
    setProducts(res.data);
  };

  const handleAddQuantity = () => {
    setQuantities([...quantities, { label: '', price: '' }]);
  };

  const handleQuantityChange = (index, field, value) => {
    const updated = [...quantities];
    updated[index][field] = value;
    setQuantities(updated);
  };

  const handleRemoveQuantity = (index) => {
    const updated = quantities.filter((_, i) => i !== index);
    setQuantities(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price); // 🔹 existing base price
    formData.append('store', store);
    if (image) formData.append('image', image);

    // 🔹 NEW: quantity variants (optional)
    formData.append('quantities', JSON.stringify(quantities));

    await axios.post(`${baseUrl}api/products`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // reset
    setName('');
    setDescription('');
    setPrice('');
    setStore('');
    setImage(null);
    setQuantities([]);

    fetchProducts();
  };

  return (
    <div className="container">
      <h4 className="mb-3">Add Product</h4>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Base Price (used if no quantities)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          className="form-control mb-2"
          placeholder="Store"
          value={store}
          onChange={(e) => setStore(e.target.value)}
          required
        />

        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* 🔹 Quantity Variants */}
        <h6 className="mt-3">Quantity Variants (Optional)</h6>

        {quantities.map((q, index) => (
          <div key={index} className="d-flex gap-2 mb-2">
            <input
              className="form-control"
              placeholder="Label (e.g. 5 Kg)"
              value={q.label}
              onChange={(e) =>
                handleQuantityChange(index, 'label', e.target.value)
              }
            />
            <input
              type="number"
              className="form-control"
              placeholder="Price"
              value={q.price}
              onChange={(e) =>
                handleQuantityChange(index, 'price', e.target.value)
              }
            />
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleRemoveQuantity(index)}
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline-primary btn-sm mb-3"
          onClick={handleAddQuantity}
        >
          + Add Quantity
        </button>

        <br />

        <button type="submit" className="btn btn-success">
          Add Product
        </button>
      </form>

      <hr />

      <h4 className="mt-4">Products</h4>

      <div className="row">
        {products.map((p) => (
          <div key={p._id} className="col-md-4 mb-3">
            <div className="card h-100">
              {p.image?.data && (
                <img
                  src={`data:${p.image.contentType};base64,${p.image.data}`}
                  className="card-img-top"
                  alt={p.name}
                />
              )}
              <div className="card-body">
                <h6>{p.name}</h6>
                <p className="small text-muted">{p.description}</p>

                {p.quantities?.length > 0 ? (
                  <ul className="small">
                    {p.quantities.map((q, i) => (
                      <li key={i}>
                        {q.label} – ₹{q.price}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>₹{p.price}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsTab;
