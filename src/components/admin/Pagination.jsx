// src/components/admin/Pagination.jsx
export default function Pagination({ currentPage, totalPages, onPageChange, onPrev, onNext }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        ← Previous
      </button>

      <div className="flex gap-1">
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={i} className="px-3 py-1">...</span>
          ) : (
            <button
              key={i}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === p ? 'bg-primary text-white' : 'bg-white hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${currentPage === totalPages ? 'text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        Next →
      </button>
    </div>
  );
}