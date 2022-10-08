import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import ListingThumbnail from "../components/ListingThumbnail";
import ListingThumbnailSkeleton from "../components/ListingThumbnailSkeleton";
import PaginationButtons from "../components/PaginationButtons";
import { db } from "../firebase";
import useAuthUser from "../hooks/useAuthUser";

function Favourites() {
  const [listings, setListings] = useState();
  const [listingsLength, setListingsLength] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useAuthUser();

  const listingsPerPage = 1;
  const dropdownRef = useRef();

  useEffect(() => {
    async function getListings() {
      setListings()
      setCurrentPage(1);
      setTotalPages(0);
      const data = await getDocs(
        query(
          collection(db, "listings"),
          where("savedBy", "array-contains", user.uid),
        )
      );

      const listings = data.docs.map(doc => ({...doc.data(), id: doc.id}))
      setListingsLength(listings?.length)
      setTotalPages(listings?.length / listingsPerPage)
      setListings(data.docs.map(doc => ({...doc.data(), id: doc.id})))
    }
    if(user) {
      getListings();
    }
  }, [user])

  useEffect(() => {
    const hideDropdown = (e) => {
      if(
        !e.target.classList?.contains('dropdown')
        && !dropdownRef?.current?.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', hideDropdown)
    return () => {
      document.removeEventListener('click', hideDropdown)
    }
  }, [])

  const sortByTitle = (sortBy) => {
    switch(sortBy) {
      case "newest":
        return 'Date - Newest'
      case "oldest":
        return 'Date - Oldest'
      case "low_to_high":
        return 'Price - Low to High'
      case "high_to_low":
        return 'Price - High to Low'
    }
  }

  const filterListingPagination = (index) => {
    if(index >= listingsPerPage * (currentPage - 1) &&
    index < currentPage * listingsPerPage) {
      return true;
    }
    return false;
  }

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-16
      flex flex-col">
        {/* Title and Filters */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl capitalize">
            Favourites
          </h2>
        </div>
        {/* Top Header */}
        <div className="flex flex-col-reverse items-start gap-y-2 mb-4 
        sm:flex-row sm:items-center sm:justify-between sm:h-10 sm:mb-2">
          {
            listings && (
              <>
                {/* Number of properties */}
                <div className="font-light">
                  {listingsLength} properties
                </div>
                
                {/* Dropdown */}
                <div 
                  className="dropdown relative"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  ref={dropdownRef}
                >
                  {/* Dropdown Menu */}
                  <div className="flex items-center space-x-4 cursor-pointer">
                    <div className="flex space-x-2">
                      <span>Sort by:</span>
                      <span className="text-secondary">
                        {sortByTitle(sortBy)}
                      </span>
                    </div>
                    <div className={`w-2 h-2 border-t-[1px] border-l-[1px] border-secondary
                    duration-200 ease 
                    ${dropdownOpen ? '-rotate-[135deg] -translate-y-[2px]' 
                    : 'rotate-[45deg] translate-y-[2px]'}`}
                    ></div>
                  </div>
                  {/* Dropdown Options */}
                  {
                    dropdownOpen && (
                      <div className="absolute top-8 -right-8 sm:right-0 bg-white border border-lightgray flex flex-col
                      z-20 rounded overflow-hidden">
                        <button
                          onClick={() => setSortBy('newest')}
                          className="px-5 py-3 hover:bg-lightblue/10 duration-200 ease text-left"
                        >
                          Date - Newest
                        </button>
                        <button 
                          onClick={() => setSortBy('oldest')}
                          className="px-5 py-3 hover:bg-lightblue/10 duration-200 ease text-left"
                        >
                          Date - Oldest
                        </button>
                        <button 
                          onClick={() => setSortBy('low_to_high')}
                          className="px-5 py-3 hover:bg-lightblue/10 duration-200 ease text-left"
                        >
                          Price - Low to High
                        </button>
                        <button 
                          onClick={() => setSortBy('high_to_low')}
                          className="px-5 py-3 hover:bg-lightblue/10 duration-200 ease text-left"
                        >
                          Price - High to Low
                        </button>
                      </div>
                    )
                  }
                </div>
              </>
            )
          }
        </div>
        {/* Listings Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {
            listings ? (
              listings
                .sort((a, b) => {
                  if(sortBy === 'newest') return b.timestamp - a.timestamp
                  if(sortBy === 'oldest') return a.timestamp - b.timestamp
                  if(sortBy === 'low_to_high') return a.price - b.price
                  if(sortBy === 'high_to_low') return b.price - a.price
                })
                .filter((_, index) => filterListingPagination(index))
                .map(listing => (
                  <ListingThumbnail
                    listing={listing}
                    key={listing.id}
                  />
                ))
            ) : (
              new Array(6).fill(0).map((_, index) => (
                <ListingThumbnailSkeleton key={index} />
              ))
            )
          }
        </div>
        {/* Pagination */}
        {
          totalPages > 1 && (
            <div className="my-8 self-center flex gap-1">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`w-10 h-10 leading-10 text-center font-medium rounded bg-white hover:bg-gray-200 duration-200 ease
                ${currentPage > 1 ? 'text-lightblue' 
                : 'text-secondary/50 pointer-events-none'}`}
              >
                <i className="fa-solid fa-angle-left"></i>
              </button>
              <PaginationButtons
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`w-10 h-10 leading-10 text-center font-medium rounded bg-white hover:bg-gray-200 duration-200 ease
                ${currentPage < totalPages ? 'text-lightblue' 
                : 'text-secondary/50 pointer-events-none'}`}
              >
                <i className="fa-solid fa-angle-right"></i>
              </button>
            </div>
          )
        }

      </div>
    </div>
  )
}
export default Favourites