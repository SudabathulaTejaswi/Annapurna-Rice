// src/context/ProductsContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (products.length > 0) return; // Already cached
    try {
      setLoading(true);
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts, loading }}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsProvider;
