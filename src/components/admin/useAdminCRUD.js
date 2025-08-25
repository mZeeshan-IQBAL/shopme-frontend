// src/components/admin/useAdminCRUD.js
import { useState, useEffect } from "react";

export function useAdminCRUD(BACKEND_URL, token, endpoint) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(`Failed to load ${endpoint}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [BACKEND_URL, token, endpoint]);

  const createItem = async (item, image, onSuccess) => {
    const data = new FormData();
    Object.keys(item).forEach(key => data.append(key, item[key]));
    if (image) data.append('image', image);

    const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: data
    });

    if (res.ok) {
      const newItem = await res.json();
      setItems(prev => [...prev, newItem]);
      onSuccess();
    }
  };

  const updateItem = async (id, item, image, onSuccess) => {
    const data = new FormData();
    Object.keys(item).forEach(key => data.append(key, item[key]));
    if (image) data.append('image', image);

    const res = await fetch(`${BACKEND_URL}/api/${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: data
    });

    if (res.ok) {
      const updated = await res.json();
      setItems(prev => prev.map(p => p.id === id ? updated : p));
      onSuccess();
    }
  };

  const deleteItem = async (id, onSuccess) => {
    const res = await fetch(`${BACKEND_URL}/api/${endpoint}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      setItems(prev => prev.filter(p => p.id !== id));
      onSuccess();
    }
  };

  return { items, loading, createItem, updateItem, deleteItem };
}