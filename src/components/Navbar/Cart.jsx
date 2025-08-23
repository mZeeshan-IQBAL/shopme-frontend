// src/components/Cart.jsx
import React, { useState } from "react";
import { useCart } from "../../context/CartContext";

// ✅ Use environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Cart = ({ onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isCheckout, setIsCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.address) {
      alert("Please fill all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            img: item.img, // ✅ CRITICAL: Add this to fix 500 error
          })),
          ...formData,
          totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
      });

      // Check if response is OK (200-299)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Order placed successfully:", result);

      setSuccess(true);
      clearCart();

      // Close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert("Failed to place order. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ✅ Success Screen
  if (success) {
    return (
      <div className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-lg p-4 z-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600">🎉 Order Confirmed!</h2>
          <p className="mt-2">Thank you, <strong>{formData.name}</strong>!</p>
          <p>We've sent a confirmation to <em>{formData.email}</em>.</p>
          <p className="mt-4 text-sm text-gray-500">Redirecting shortly...</p>
        </div>
      </div>
    );
  }

  // ✅ Checkout Form Overlay
  if (isCheckout) {
    return (
      <div className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-lg p-4 z-50 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <button
            onClick={() => setIsCheckout(false)}
            className="text-red-500 font-bold text-lg"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="john@example.com"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="123 Street, City, State, ZIP, Country"
            />
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800">Order Summary</h3>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.title}</span>
                  <span>× {item.quantity}</span>
                </li>
              ))}
            </ul>
            <p className="font-bold mt-2 text-lg">Total: ₹{totalPrice.toLocaleString()}</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 rounded transition duration-200 font-medium"
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>
    );
  }

  // ✅ Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-lg p-4 z-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700">Your Cart</h2>
        <p className="mt-6 text-center text-gray-500">Your cart is empty.</p>
        <button
          onClick={onClose}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full transition"
        >
          Close
        </button>
      </div>
    );
  }

  // ✅ Default Cart UI
  return (
    <div className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-lg p-4 z-50 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
        <button
          onClick={onClose}
          className="text-red-500 font-bold text-xl hover:text-red-700 transition"
        >
          ✕
        </button>
      </div>

      <ul className="space-y-4">
        {cart.map((item) => (
          <li
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg shadow-sm"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <p className="text-gray-600">₹{item.price}</p>

              {/* Quantity Controls */}
              <div className="flex items-center mt-2 gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed px-2 py-1 rounded text-sm font-medium transition"
                >
                  −
                </button>
                <span className="font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm font-medium transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item.id)}
              className="self-start mt-2 sm:mt-0 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* Total & Checkout Button */}
      <div className="mt-6 border-t pt-4">
        <p className="font-semibold text-lg text-gray-800">
          Total: ₹{totalPrice.toLocaleString()}
        </p>
        <button
          onClick={() => setIsCheckout(true)}
          className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-medium transition duration-200"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;