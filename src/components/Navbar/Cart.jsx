// src/components/Cart.jsx
import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import axios from "axios";

const Cart = ({ onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isCheckout, setIsCheckout] = useState(false); // Show form
  const [formData, setFormData] = useState({ name: "", email: "", address: "" });
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
      const res = await axios.post("http://localhost:3000/api/orders", {
        items: cart,
        ...formData,
        totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      });

      console.log("Order placed:", res.data);
      setSuccess(true);
      clearCart();

      // Close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      alert("Failed to place order. Please try again.");
      console.error(error);
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
          <p className="mt-4 text-sm text-gray-500">Redirecting...</p>
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
            className="text-red-500 font-bold"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Shipping Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border p-2 rounded"
              placeholder="123 Street, City, State, ZIP, Country"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold">Order Summary</h3>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              {cart.map((item) => (
                <li key={item.id}>
                  {item.title} × {item.quantity}
                </li>
              ))}
            </ul>
            <p className="font-bold mt-2">Total: ₹{totalPrice}</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 rounded transition"
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>
    );
  }

  // ✅ Original Cart UI (Unchanged)
  if (cart.length === 0) {
    return (
      <div className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-lg p-4 z-50">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <p className="mt-10 text-center text-gray-500">Your Cart is Empty</p>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-lg p-4 z-50 transform transition-transform duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Cart</h2>
        <button onClick={onClose} className="text-red-500 font-bold">X</button>
      </div>

      <ul className="space-y-4 overflow-y-auto max-h-[70%]">
        {cart.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border p-3 rounded-lg shadow"
          >
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-gray-600">Rs. {item.price}</p>
              <div className="flex items-center mt-2 gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="bg-gray-200 px-2 rounded"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="bg-gray-200 px-2 rounded"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t pt-4">
        <p className="font-semibold text-lg">Total: Rs. {totalPrice}</p>
        <button
          onClick={() => setIsCheckout(true)} // Opens form
          className="mt-3 w-full bg-green-500 text-white py-2 rounded font-medium hover:bg-green-600 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;