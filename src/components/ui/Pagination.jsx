import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  loading = false,
  totalItems = 0,
  itemsPerPage = 20
}) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-800">
      <div className="text-sm text-gray-400 mb-4 sm:mb-0">
        Showing {startItem}-{endItem} of {totalItems} files
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={`p-2 rounded-lg border border-gray-700 ${
            currentPage === 1 || loading
              ? 'opacity-50 cursor-not-allowed text-gray-500'
              : 'hover:bg-gray-800 text-gray-300 hover:border-blue-500'
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                1 === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-700 hover:bg-gray-800 text-gray-300'
              } ${loading ? 'opacity-50' : ''}`}
            >
              1
            </button>
            {startPage > 2 && (
              <span className="text-gray-500 px-1">...</span>
            )}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`px-3 py-1.5 rounded-lg text-sm min-w-[40px] ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'border border-gray-700 hover:bg-gray-800 text-gray-300'
            } ${loading ? 'opacity-50' : ''}`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-gray-500 px-1">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                totalPages === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-700 hover:bg-gray-800 text-gray-300'
              } ${loading ? 'opacity-50' : ''}`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className={`p-2 rounded-lg border border-gray-700 ${
            currentPage === totalPages || loading
              ? 'opacity-50 cursor-not-allowed text-gray-500'
              : 'hover:bg-gray-800 text-gray-300 hover:border-blue-500'
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;