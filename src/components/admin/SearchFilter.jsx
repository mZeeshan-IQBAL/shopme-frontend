// src/components/admin/SearchFilter.jsx
export default function SearchFilter({ searchTerm, setSearchTerm, minPrice, setMinPrice, maxPrice, setMaxPrice, onClear }) {
  return (
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
          onClick={onClear}
          className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>
    </div>
  );
}