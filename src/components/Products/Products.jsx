// src/components/Products.jsx
import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

// ✅ Use environment variable
const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL;

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} className="text-yellow-400" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
      <span className="ml-1 text-sm text-gray-600">{rating}</span>
    </div>
  );
};

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAdded((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  if (loading)
    return (
      <div className="mt-14 text-center">
        <p className="text-lg text-gray-600">Loading products...</p>
      </div>
    );

  if (error)
    return (
      <div className="mt-14 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );

  return (
    <div className="mt-14 mb-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary font-medium">
            Top Selling Products for you
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Products
          </h1>
          <p data-aos="fade-up" className="text-sm text-gray-500">
            Discover our most loved items handpicked based on your style and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center gap-6">
          {products.length === 0 ? (
            <p>No products available</p>
          ) : (
            products.map((data) => (
              <div
                key={data.id}
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                className="bg-white shadow-md rounded-xl p-3 hover:shadow-xl transition-transform duration-300 hover:-translate-y-2 w-[180px] group"
              >
                <img
                  src={`${BACKEND_URL}${data.img}`} // ✅ Now uses correct backend URL
                  alt={data.title}
                  className="h-[220px] w-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="mt-3 space-y-1">
                  <h3 className="font-semibold text-gray-800">{data.title}</h3>
                  <p className="text-sm text-gray-500">{data.color}</p>
                  <p className="text-sm font-medium text-gray-800">
                    Rs. {data.price.toLocaleString()}
                  </p>
                  {renderStars(data.rating)}
                </div>
                <button
                  className="mt-4 flex items-center gap-2 bg-primary hover:scale-105 disabled:scale-100 disabled:opacity-70 text-white py-2 px-6 rounded-full transition-transform duration-300 group-hover:bg-black group-hover:text-primary disabled:cursor-not-allowed"
                  onClick={() => handleAddToCart(data)}
                  disabled={added[data.id]}
                >
                  {added[data.id] ? (
                    "Added!"
                  ) : (
                    <>
                      <FaShoppingCart size={16} /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;