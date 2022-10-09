import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import ListingThumbnail from "../components/ListingThumbnail";
import ListingThumbnailSkeleton from "../components/ListingThumbnailSkeleton";
import PaginationButtons from "../components/PaginationButtons";
import { db } from "../firebase";

function Category() {
  const forSale = (category) => {
    if(category === 'sale' || category === 'house' || category === 'villa' || category === 'rural') {
      return true;
    }
    return false;
  }

  const { category } = useParams();
  const priceLimit = forSale(category) ? 10000000 : 5000
  const [listings, setListings] = useState();
  const [listingsLength, setListingsLength] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [bedrooms, setBedrooms] = useState();
  const [filterBedrooms, setFilterBedrooms] = useState();
  const [bathrooms, setBathrooms] = useState();
  const [filterBathrooms, setFilterBathrooms] = useState();
  const [garages, setGarages] = useState();
  const [filterGarages, setFilterGarages] = useState();
  const [priceOne, setPriceOne] = useState(0);
  const [priceTwo, setPriceTwo] = useState(priceLimit);
  const minPrice = Math.min(priceOne, priceTwo);
  const maxPrice = Math.max(priceOne, priceTwo);
  const [filterMinPrice, setFilterMinPrice] = useState();
  const [filterMaxPrice, setFilterMaxPrice] = useState();
  

  const listingsPerPage = 6;

  const dropdownRef = useRef();
  const filtersRef = useRef();
  const priceOneRef = useRef();
  const priceTwoRef = useRef();

  const resetFilters = () => {
    setFilterBedrooms(0);
    setBedrooms(0);
    setFilterBathrooms(0);
    setBathrooms(0);
    setFilterGarages(0);
    setGarages(0);
    setPriceOne(0);
    setPriceTwo(priceLimit);
    setFilterMinPrice();
    setFilterMaxPrice();
  }

  useEffect(() => {
    async function getListings() {
      setListings()
      setCurrentPage(1);
      setTotalPages(0);
      resetFilters();
      let data;
      if(category === 'sale' || category === 'rent') {
        data = await getDocs(
          query(
            collection(db, "listings"),
            where("status", "==", category),
          )
        );
      } else {
        data = await getDocs(
          query(
            collection(db, "listings"),
            where("type", "==", category),
          )
        );
      }

      const listings = data.docs.map(doc => ({...doc.data(), id: doc.id}))
      setListingsLength(listings?.length)
      setTotalPages(Math.ceil(listings?.length / listingsPerPage))
      setListings(data.docs.map(doc => ({...doc.data(), id: doc.id})))
    }
    getListings();
  }, [category])

  useEffect(() => {
    const hideDropdown = (e) => {
      if(
        !e.target.classList?.contains('dropdown')
        && !dropdownRef?.current?.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    }
    const hideFilters = (e) => {
      if(
        !e.target.classList?.contains('filters')
        && !filtersRef?.current?.contains(e.target)
      ) {
        setFiltersOpen(false);
      }
    }
    document.addEventListener('click', hideDropdown)
    document.addEventListener('click', hideFilters)
    return () => {
      document.removeEventListener('click', hideDropdown)
      document.removeEventListener('click', hideFilters)
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

  const filterListing = (listing) => {
    let inFilter = true;
    if(filterBedrooms && filterBedrooms !== listing?.bedrooms) {
      inFilter = false;
    }
    if(filterBathrooms && filterBathrooms !== listing?.bathrooms) {
      inFilter = false;
    }
    if(filterGarages && filterGarages !== listing?.garages) {
      inFilter = false;
    }
    if(listing?.price < filterMinPrice || listing?.price > filterMaxPrice) {
      inFilter = false;
    }
    return inFilter;
  }

  const filterListingPagination = (index) => {
    if(index >= listingsPerPage * (currentPage - 1) &&
    index < currentPage * listingsPerPage) {
      return true;
    }
    return false;
  }

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('onSubmit')
    setFilterBedrooms(bedrooms);
    setFilterBathrooms(bathrooms);
    setFilterGarages(garages);
    setFilterMinPrice(minPrice);
    setFilterMaxPrice(maxPrice)
  }

  useEffect(() => {
    const listingsLength = listings?.filter(listing => filterListing(listing))?.length
    setListingsLength(listingsLength)
    setTotalPages(Math.ceil(listingsLength / listingsPerPage))
  }, [filterBedrooms, filterBathrooms, filterGarages, filterMinPrice, filterMaxPrice])

  const onPriceChange = (e) => {
    let priceOne = parseInt(priceOneRef?.current?.value);
    let priceTwo = parseInt(priceTwoRef?.current?.value);

    setPriceOne(priceOne);
    setPriceTwo(priceTwo)

  }

  const formatNumber = (number) => {
    if(number > 999999) {
      if(Number.isInteger(number / 1000000)) {
        return parseInt(number / 1000000) + "M"
      } else {
        return (number / 1000000).toFixed(1) + "M"
      }
    } else if (number > 999) {
      if(Number.isInteger(number / 1000)) {
        return parseInt(number / 1000) + "K"
      } else {
        return (number / 1000).toFixed(1) + "K"
      }
    } else {
      return parseInt(number)
    }
  }

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-16
      flex flex-col">
        {/* Title and Filters */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl capitalize">
            {
              category === 'sale' || category === 'rent' ? `for ${category}`
              : `${category}`
            }
          </h2>
          {/* Filters */}
          <div 
            className="filters relative"
            ref={filtersRef}
          >
            {/* Filters Button */}
            <button 
              className="flex items-center"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <i className="fa-solid fa-bars-staggered text-xl sm:text-lg"></i>
              <span className="hidden sm:inline ml-2 font-medium">Filters</span>
            </button>
            {/* Filters Modal */}
            {
              filtersOpen && (
                <>
                  <div 
                    className="fixed inset-0 sm:hidden bg-black/50 z-20"
                    onClick={() => setFiltersOpen(false)}
                  ></div>
                </>
              )
            }
            <form
              onSubmit={onSubmit} 
              className={`fixed inset-x-0 top-0 sm:inset-x-auto sm:absolute sm:top-8 sm:bottom-auto sm:right-0 sm:w-[360px] bg-white border px-3 py-5 sm:p-5 border-lightgray flex-col z-20 rounded overflow-hidden 
              ${filtersOpen ? 'translate-y-0 sm:flex' : '-translate-y-full sm:hidden'} duration-300 ease text-sm sm:text-base`}
            >
              <div className="flex justify-between mb-4">
                <div className="font-medium">Filters</div>
                <button 
                  type="button"
                  className="hidden sm:block text-lightblue hover:underline"
                  onClick={resetFilters}
                >
                  Reset filters
                </button>
                <button 
                  type="button"
                  className="block sm:hidden text-lightblue hover:underline"
                  onClick={() => {
                    resetFilters();
                    setFiltersOpen(false);
                  }}
                >
                  Reset filters
                </button>
              </div>
              {/* Fields */}
              <div className="flex flex-col divide-y border-y mb-4">
                {/* Bedrooms */}
                <div className="flex flex-col py-4">
                  <div className="font-medium mb-2">Bedrooms</div>
                  <div className="grid grid-cols-6 font-medium rounded text-center">
                    <button
                      type="button"
                      className={`py-2 -mx-[0.5px] ${!bedrooms ? 
                      'text-lightblue border border-lightblue bg-lightblue/10 z-10' 
                      : 'border'}`}
                      onClick={() => setBedrooms()}
                    >Any</button>
                    {
                      new Array(5).fill(0).map((_, index) => (
                        <button
                          type="button"
                          className={`py-2 -mx-[0.5px] ${bedrooms === index + 1 ? 
                          'text-lightblue border border-lightblue bg-lightblue/10 z-10' 
                          : 'border'}`}
                          onClick={() => setBedrooms(index + 1)}
                          key={index}
                        >
                          {index + 1}
                        </button>
                      )) 
                    }
                  </div>
                </div>
                {/* Bathrooms */}
                <div className="flex flex-col py-4">
                  <div className="font-medium mb-2">Bathrooms</div>
                  <div className="grid grid-cols-6 font-medium rounded text-center">
                    <button
                      type="button"
                      className={`py-2 -mx-[0.5px] ${!bathrooms ? 
                      'text-lightblue border border-lightblue bg-lightblue/10 z-10' 
                      : 'border'}`}
                      onClick={() => setBathrooms()}
                    >Any</button>
                    {
                      new Array(5).fill(0).map((_, index) => (
                        <button
                          type="button"
                          className={`py-2 -mx-[0.5px] ${bathrooms === index + 1 ? 
                          'text-lightblue border border-lightblue bg-lightblue/10 z-10' 
                          : 'border'}`}
                          onClick={() => setBathrooms(index + 1)}
                          key={index}
                        >
                          {index + 1}
                        </button>
                      )) 
                    }
                  </div>
                </div>
                {/* Garages */}
                <div className="flex flex-col py-4">
                  <div className="font-medium mb-2">Garages</div>
                  <div className="grid grid-cols-6 font-medium rounded text-center">
                    <button
                      type="button"
                      className={`py-2 -mx-[0.5px] ${!garages ? 
                      'text-lightblue border border-lightblue bg-lightblue/10 z-10' 
                      : 'border'}`}
                      onClick={() => setGarages()}
                    >Any</button>
                    {
                      new Array(5).fill(0).map((_, index) => (
                        <button
                          type="button"
                          className={`py-2 -mx-[0.5px] ${garages === index + 1 ? 
                          'text-lightblue border border-lightblue bg-lightblue/10 z-10' 
                          : 'border'}`}
                          onClick={() => setGarages(index + 1)}
                          key={index}
                        >
                          {index + 1}
                        </button>
                      )) 
                    }
                  </div>
                </div>
                {/* Price Range */}
                <div className="flex flex-col py-4">
                  <div className="font-medium mb-2">Price</div>
                  <div className="mb-5">
                    ${formatNumber(minPrice)} - ${formatNumber(maxPrice)}
                  </div>
                  {/* Slider */}
                  <div className="h-1 bg-lightgray relative">
                    {/* Progress */}
                    <div 
                      className="h-1 absolute inset-y-0 rounded bg-lightblue"
                      style={{
                        left: `${(minPrice / priceLimit) * 100}%`,
                        right: `${100 - ((maxPrice / priceLimit) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  {/* Range Inputs */}
                  <div className="relative range-input">
                    <input 
                      type="range"
                      min="0"
                      max={priceLimit}
                      step={forSale(category) ? "50000" : "50"}
                      ref={priceOneRef}
                      value={priceOne}
                      onChange={onPriceChange}
                    />
                    <input 
                      type="range"
                      min="0"
                      max={priceLimit}
                      step={forSale(category) ? "50000" : "50"}
                      ref={priceTwoRef}
                      value={priceTwo}
                      onChange={onPriceChange}
                    />
                  </div>
                </div>

              </div>
              {/* Buttons */}
              <div className="flex justify-end">
                <button
                  type="button" 
                  className="py-2 px-6 mr-2 hover:bg-gray-50 duration-200 ease rounded"
                  onClick={() => {
                    setFiltersOpen(false);
                    resetFilters();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit" 
                  className="py-2 px-6 text-white bg-lightblue 
                  hover:bg-[#009de8] duration-200 ease rounded font-medium"
                  onClick={() => setFiltersOpen(false)}
                >
                  See results
                </button>
              </div>
            </form>
          </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {
            listings ? (
              listings
                .sort((a, b) => {
                  if(sortBy === 'newest') return b.timestamp - a.timestamp
                  if(sortBy === 'oldest') return a.timestamp - b.timestamp
                  if(sortBy === 'low_to_high') return a.price - b.price
                  if(sortBy === 'high_to_low') return b.price - a.price
                })
                .filter(listing => filterListing(listing))
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
export default Category