// src/components/admin/TopProductCRUD.jsx
import { useState } from "react";

export default function TopProductCRUD({
  topProducts,
  setTopProducts,
  BACKEND_URL,
  token,
  setError,
  setSuccess,
}) {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    rating: "",
    description: "",
    price: "",
    aosDelay: "",
  });
  const [image, setImage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Populate form when editing
  useState(() => {
    if (editingProduct) {
      setFormData({
        id: editingProduct.id,
        title: editingProduct.title,
        rating: editingProduct.rating,
        description: editingProduct.description,
        price: editingProduct.price,
        aosDelay: editingProduct.aosDelay || "",
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { id, title, rating, description, price, aosDelay } = formData;
    const numId = parseInt(id);
    const numRating = parseFloat(rating);
    const numPrice = parseFloat(price);

    if (!id || !title || !rating || !description || !price || (!editingProduct && !image)) {
      setError("Please fill all required fields and upload an image");
      return;
    }

    const data = new FormData();
    data.append("id", numId);
    data.append("title", title);
    data.append("rating", numRating);
    data.append("description", description);
    data.append("price", numPrice);
    data.append("aosDelay", aosDelay || "");

    if (image) data.append("image", image);

    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct
        ? `${BACKEND_URL}/api/top-products/${numId}`
        : `${BACKEND_URL}/api/top-products`;

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(`✅ Top product ${editingProduct ? "updated" : "added"}!`);
        setFormData({
          id: "",
          title: "",
          rating: "",
          description: "",
          price: "",
          aosDelay: "",
        });
        setImage(null);
        setEditingProduct(null);

        // Refresh list
        const updated = await fetch(`${BACKEND_URL}/api/top-products`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json());
        setTopProducts(updated);
      } else {
        setError(result.error || "Failed to save top product");
      }
    } catch (err) {
      setError("⚠️ Network error. Try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this top product?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/top-products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setSuccess("✅ Top product deleted!");
        setTopProducts(topProducts.filter((p) => p.id !== id));
      } else {
        const result = await res.json();
        setError(result.error || "Failed to delete");
      }
    } catch (err) {
      setError("⚠️ Network error.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{editingProduct ? "Edit Top Product" : "Add Top Product"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="id"
          placeholder="ID"
          value={formData.id}
          onChange={handleChange}
          required
          disabled={editingProduct}
          className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
        />
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
        />
        <input
          name="rating"
          type="number"
          step="0.1"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
        />
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
        />
        <input
          name="aosDelay"
          type="text"
          placeholder="AOS Delay"
          value={formData.aosDelay}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
        />
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={!editingProduct}
            className="w-full text-sm"
          />
          {image && <p className="text-xs text-gray-500 mt-1">Selected: {image.name}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-primary hover:bg-black text-white py-2 px-4 rounded font-medium"
        >
          {editingProduct ? "Update" : "Add"}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="font-medium mb-3">Top Products</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {topProducts.map((p) => (
            <div key={p.id} className="flex justify-between text-sm">
              <span>{p.title}</span>
              <span>
                <button
                  onClick={() => setEditingProduct(p)}
                  className="text-blue-600 mx-1 hover:underline"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 mx-1 hover:underline"
                >
                  🗑️
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}