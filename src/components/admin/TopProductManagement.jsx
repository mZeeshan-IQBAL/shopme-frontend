// src/components/admin/TopProductManagement.jsx
import React, { useState, useEffect } from "react";

export default function TopProductManagement({ BACKEND_URL, token, setError, setSuccess }) {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/top-products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setTopProducts(data);
      } catch (err) {
        setError("Failed to load top products");
      } finally {
        setLoading(false);
      }
    };
    fetchTopProducts();
  }, [BACKEND_URL, token, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const numId = parseInt(data.id);
    const numRating = parseFloat(data.rating);
    const numPrice = parseFloat(data.price);

    if (!numId || !data.title || !data.description || !numRating || !numPrice || (!editingProduct && !image)) {
      setError("Please fill all fields and upload image");
      return;
    }

    const submitData = new FormData();
    submitData.append("id", numId);
    submitData.append("title", data.title);
    submitData.append("rating", numRating);
    submitData.append("description", data.description);
    submitData.append("price", numPrice);
    submitData.append("aosDelay", data.aosDelay || "");
    if (image) submitData.append("image", image);

    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct
        ? `${BACKEND_URL}/api/top-products/${numId}`
        : `${BACKEND_URL}/api/top-products`;

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: submitData,
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(`✅ Top product ${editingProduct ? "updated" : "added"}!`);
        setEditingProduct(null);
        setImage(null);
        const updated = await fetch(`${BACKEND_URL}/api/top-products`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json());
        setTopProducts(updated);
      } else {
        setError(result.error || "Failed to save");
      }
    } catch (err) {
      setError("⚠️ Network error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this top product?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/top-products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccess("✅ Top product deleted!");
        setTopProducts(topProducts.filter(p => p.id !== id));
      } else {
        const result = await res.json();
        setError(result.error || "Delete failed");
      }
    } catch (err) {
      setError("⚠️ Network error");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? `Edit Top Product #${editingProduct.id}` : "Add New Top Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="id" placeholder="ID" defaultValue={editingProduct?.id} required disabled={editingProduct} className="border rounded px-3 py-2" />
            <input name="title" placeholder="Title" defaultValue={editingProduct?.title} required className="border rounded px-3 py-2" />
            <input name="rating" type="number" step="0.1" placeholder="Rating" defaultValue={editingProduct?.rating} required className="border rounded px-3 py-2" />
            <input name="description" placeholder="Description" defaultValue={editingProduct?.description} required className="border rounded px-3 py-2" />
            <input name="price" type="number" placeholder="Price" defaultValue={editingProduct?.price} required className="border rounded px-3 py-2" />
            <input name="aosDelay" type="text" placeholder="AOS Delay" defaultValue={editingProduct?.aosDelay} className="border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required={!editingProduct} className="w-full" />
            {image && <p className="text-sm text-gray-500 mt-1">Selected: {image.name}</p>}
            {editingProduct && editingProduct.img && !image && (
              <img src={editingProduct.img} alt="Current" className="w-20 h-20 object-cover mt-2 rounded" />
            )}
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-primary hover:bg-black text-white py-2 px-6 rounded">
              {editingProduct ? "Update" : "Add"}
            </button>
            {editingProduct && (
              <button type="button" onClick={() => setEditingProduct(null)} className="text-gray-600 hover:text-gray-800">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Top Products</h3>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : topProducts.length === 0 ? (
          <p className="text-gray-500">No top products yet.</p>
        ) : (
          <div className="space-y-4">
            {topProducts.map((p) => (
              <div key={p.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <img src={p.img} alt={p.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h4 className="font-medium">{p.title}</h4>
                    <p className="text-sm text-gray-500">ID: {p.id} | ₹{p.price} | ⭐ {p.rating}</p>
                    <p className="text-sm text-gray-600">{p.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProduct(p)}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
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
    </div>
  );
}