// src/components/admin/TopProductManagement.jsx
import React, { useState, useEffect } from "react";

export default function TopProductManagement({ BACKEND_URL, token, setError, setSuccess }) {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [image, setImage] = useState(null);

  // 🔍 Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Fetch top products
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/top-products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setTopProducts(data);
      } catch (err) {
        setError("Failed to load top products: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTopProducts();
  }, [BACKEND_URL, token, setError]);

  // 🔎 Filtered Products
  const filteredTopProducts = topProducts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMinPrice = !minPrice || p.price >= parseFloat(minPrice);
    const matchesMaxPrice = !maxPrice || p.price <= parseFloat(maxPrice);
    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  // 🧹 Clear Filters
  const clearFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
  };

  // Handle Form Submit (Create/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const id = parseInt(data.id);
    const rating = parseFloat(data.rating);
    const price = parseFloat(data.price);

    if (!id || !data.title || !data.description || !rating || !price || (!editingProduct && !image)) {
      setError('Please fill all required fields and upload an image');
      return;
    }

    const submitData = new FormData();
    submitData.append('id', id);
    submitData.append('title', data.title);
    submitData.append('rating', rating);
    submitData.append('description', data.description);
    submitData.append('price', price);
    submitData.append('aosDelay', data.aosDelay || '');

    if (image) submitData.append('image', image);

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct
        ? `${BACKEND_URL}/api/top-products/${id}`
        : `${BACKEND_URL}/api/top-products`;

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(`✅ Top product ${editingProduct ? 'updated' : 'added'}!`);
        setEditingProduct(null);
        setImage(null);
        e.target.reset(); // Clear form

        // Refresh list
        const updated = await fetch(`${BACKEND_URL}/api/top-products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json());
        setTopProducts(updated);
      } else {
        setError(result.error || 'Failed to save top product');
      }
    } catch (err) {
      setError('⚠️ Network error. Try again.');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this top product?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/top-products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setSuccess('✅ Top product deleted!');
        setTopProducts(topProducts.filter(p => p.id !== id));
      } else {
        const result = await res.json();
        setError(result.error || 'Failed to delete');
      }
    } catch (err) {
      setError('⚠️ Network error. Try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Add/Edit Form */}
      <div className="p-6 border-b bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? `Edit Top Product #${editingProduct.id}` : "Add New Top Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="id"
              placeholder="Product ID"
              defaultValue={editingProduct?.id}
              required
              disabled={editingProduct}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              name="title"
              placeholder="Title"
              defaultValue={editingProduct?.title}
              required
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              name="rating"
              type="number"
              step="0.1"
              placeholder="Rating (e.g., 4.5)"
              defaultValue={editingProduct?.rating}
              required
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              name="description"
              placeholder="Description"
              defaultValue={editingProduct?.description}
              required
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              name="price"
              type="number"
              placeholder="Price (in Rs)"
              defaultValue={editingProduct?.price}
              required
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              name="aosDelay"
              type="text"
              placeholder="AOS Delay (e.g., 200)"
              defaultValue={editingProduct?.aosDelay}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required={!editingProduct}
              className="w-full text-sm"
            />
            {image && (
              <p className="text-sm text-gray-500 mt-1">Selected: <span className="font-medium">{image.name}</span></p>
            )}
            {editingProduct && editingProduct.img && !image && (
              <img
                src={editingProduct.img}
                alt="Current"
                className="w-20 h-20 object-cover mt-2 rounded"
              />
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-primary hover:bg-black text-white py-2 px-6 rounded font-medium"
            >
              {editingProduct ? 'Update' : 'Add'} Top Product
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setImage(null);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search & Filter */}
      <div className="p-6 border-b bg-gray-50">
        <h3 className="text-lg font-medium mb-3">Search & Filter</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <button
            onClick={clearFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Top Product List */}
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">
          Top Products ({filteredTopProducts.length})
        </h3>

        {loading ? (
          <p className="text-gray-500">Loading top products...</p>
        ) : filteredTopProducts.length === 0 ? (
          <p className="text-gray-500">No top products match your filters.</p>
        ) : (
          <div className="space-y-4">
            {filteredTopProducts.map((p) => (
              <div
                key={p.id}
                className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                    }}
                  />
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