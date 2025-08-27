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
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${currentPage === 1 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
      >
        ← Previous
      </button>

      <div className="flex gap-1">
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={i} className="px-2 py-1 text-gray-500">...</span>
          ) : (
            <button
              key={i}
              onClick={() => onPageChange(p)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors
                ${currentPage === p 
                  ? 'bg-primary text-white' 
                  : 'bg-white hover:bg-gray-200 text-gray-700 border border-gray-200'}`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${currentPage === totalPages 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
      >
        Next →
      </button>
    </div>
  );
}