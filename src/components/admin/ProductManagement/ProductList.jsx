// src/components/admin/ProductManagement/ProductList.jsx
import React from "react";

export default function ProductList({ products, onEdit, onDelete }) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium mb-4">Products ({products.length})</h3>
      {products.length === 0 ? (
        <p className="text-gray-500">No products to display.</p>
      ) : (
        <div className="space-y-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/80x80?text=No+Image"; }}
                />
                <div>
                  <h4 className="font-medium">{p.title}</h4>
                  <p className="text-sm text-gray-500">ID: {p.id} | ₹{p.price} | ⭐ {p.rating}</p>
                  {p.color && <p className="text-sm text-gray-500">Color: {p.color}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(p)}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="text-red-600 hover:underline text-sm font-medium"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}