// src/components/admin/ProductManagement/ProductForm.jsx
import React, { useState } from "react";

export default function ProductForm({ product, onSubmit, onCancel, isEditing }) {
  const [formData, setFormData] = useState(product || {
    id: '', title: '', rating: '', color: '', price: '', aosDelay: ''
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData }, image);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="id"
          placeholder="ID"
          value={formData.id}
          onChange={handleChange}
          required
          disabled={isEditing}
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="rating"
          type="number"
          step="0.1"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="aosDelay"
          type="text"
          placeholder="AOS Delay"
          value={formData.aosDelay}
          onChange={handleChange}
          className="border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required={!isEditing}
          className="w-full text-sm"
        />
        {image && (
          <p className="text-sm text-gray-500 mt-1">Selected: <span className="font-medium">{image.name}</span></p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-primary hover:bg-black text-white py-2 px-6 rounded font-medium"
        >
          {isEditing ? 'Update Product' : 'Add Product'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}