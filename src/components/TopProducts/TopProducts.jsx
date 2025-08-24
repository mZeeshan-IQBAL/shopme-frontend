// src/components/TopProducts.jsx
// src/components/TopProducts.jsx
import React, { useState, useEffect } from "react";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} className="text-yellow-400" />
      ))}
      {halfStar && <FaStar className="text-yellow-300 opacity-70" />}
      <span className="ml-1 text-sm text-gray-600">{rating}</span>
    </div>
  );
};

const TopProducts = () => {
  const { addToCart } = useCart();
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState({});

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/top-products`);
        if (!res.ok) throw new Error("Failed to fetch top products");
        const data = await res.json();
        setTopProducts(data);
      } catch (err) {
        console.error("Error fetching top products:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAdded((prev) => {
        const updated = { ...prev };
        delete updated[product.id];
        return updated;
      });
    }, 1500);
  };

  const getImageUrl = (imgPath) => {
    return imgPath.startsWith('http') ? imgPath : `${BACKEND_URL}${imgPath}`;
  };

  if (loading)
    return (
      <section className="container mx-auto px-4 lg:px-8 mt-14 mb-12 text-center">
        <p className="text-lg text-gray-600">Loading top products...</p>
      </section>
    );

  if (error)
    return (
      <section className="container mx-auto px-4 lg:px-8 mt-14 mb-12 text-center">
        <p className="text-red-500">⚠️ Failed to load products: {error}</p>
      </section>
    );

  return (
    <section className="container mx-auto px-4 lg:px-8 mt-14 mb-12">
      {/* Header */}
      <div className="text-center mb-10 max-w-[600px] mx-auto">
        <p data-aos="fade-up" className="text-sm text-primary font-medium">
          Top Rated Products for You
        </p>
        <h2 data-aos="fade-up" className="text-3xl font-bold mt-1">
          Best Products
        </h2>
        <p data-aos="fade-up" className="text-xs text-gray-400 mt-2">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit asperiores modi.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 place-items-center">
        {topProducts.length === 0 ? (
          <p>No top products available.</p>
        ) : (
          topProducts.map((product) => (
            <div
              key={product.id}
              data-aos="zoom-in"
              data-aos-delay={product.aosDelay}
              className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl transition-transform duration-300 group max-w-[320px] transform overflow-hidden"
            >
              {/* Image - Increased size */}
              <div className="flex justify-center h-48 md:h-56 items-center">
                <img
                  src={getImageUrl(product.img)}
                  alt={product.title}
                  className="max-w-[180px] md:max-w-[200px] max-h-[140px] md:max-h-[160px] object-contain block mx-auto transform transition-transform duration-300 drop-shadow-md group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Details */}
              <div className="p-5 text-center flex flex-col items-center">
                {renderStars(product.rating)}
                <h3 className="text-xl font-bold mt-2">{product.title}</h3>
                <p
                  className="text-gray-500 group-hover:text-white text-sm line-clamp-2"
                  title={product.description}
                >
                  {product.description}
                </p>
                <p className="text-sm font-medium mt-1 group-hover:text-white">
                  Rs. {product.price.toLocaleString()}
                </p>

                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  disabled={added[product.id]}
                  aria-label={added[product.id] ? "Item added to cart" : `Add ${product.title} to cart`}
                  className="mt-4 flex items-center gap-2 bg-primary hover:scale-105 disabled:scale-100 disabled:opacity-70 text-white py-2 px-6 rounded-full transition-transform duration-300 group-hover:bg-white group-hover:text-primary disabled:cursor-not-allowed"
                >
                  {added[product.id] ? (
                    "Added!"
                  ) : (
                    <>
                      <FaShoppingCart size={16} /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default TopProducts;