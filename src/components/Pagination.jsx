function Pagination({ pageInfo, handlePageChange }) {
  
  const pages = Array.from({ length: pageInfo.total_pages }, (_, index) => index + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      
      <button
        onClick={() => handlePageChange(pageInfo.current_page - 1)}
        disabled={!pageInfo.has_pre}
        className={`px-4 py-2 rounded-lg border transition backdrop-blur-md flex items-center
          ${!pageInfo.has_pre 
            ? 'border-white/10 text-white/30 cursor-not-allowed' 
            : 'border-white/30 text-white hover:bg-white/10 hover:border-white/50'
          }`}
      >
        <span className="mr-1">«</span> 上一頁
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`w-10 h-10 rounded-lg border transition backdrop-blur-md font-bold
            ${page === pageInfo.current_page
              ? 'bg-white text-purple-600 border-white shadow-lg scale-105'
              : 'bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50'
            }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(pageInfo.current_page + 1)}
        disabled={!pageInfo.has_next}
        className={`px-4 py-2 rounded-lg border transition backdrop-blur-md flex items-center
          ${!pageInfo.has_next
            ? 'border-white/10 text-white/30 cursor-not-allowed' 
            : 'border-white/30 text-white hover:bg-white/10 hover:border-white/50'
          }`}
      >
        下一頁 <span className="ml-1">»</span>
      </button>
    </div>
  );
}

export default Pagination;