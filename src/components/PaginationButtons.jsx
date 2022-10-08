function PaginationButtons({ totalPages, currentPage, setCurrentPage }) {
  return (
    <>
      {
        new Array(totalPages).fill(0).map((_, index) => (
          <button
            onClick={() => setCurrentPage(index + 1)}
            className={`w-10 h-10 leading-10 text-center font-medium rounded
            ${currentPage === index + 1 ? 'bg-lightblue text-white'
            : 'bg-white text-lightblue hover:bg-gray-200 duration-200 ease'}`}
            key={index}
          >
            {index + 1}
          </button>
        ))
      }
    </>
  )
}
export default PaginationButtons