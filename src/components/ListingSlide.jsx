import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function ListingSlide({ listing }) {
  const parallaxRef = useRef();

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    function onScroll() {
      let offset = window.scrollY;
        if(window.innerWidth >= 640) {
          parallaxRef.current.style.backgroundPositionY = `calc(50% + ${offset * 0.75}px)`
        } else {
          parallaxRef.current.style.backgroundPositionY = `calc(50% + ${offset * 0.25}px)`
        }
        
    }

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll);
    }
  }, [])

  return (
    <Link 
      to={`/listing/${listing.id}`} 
      className="relative w-full aspect-[5/4] sm:aspect-[2/1] max-h-[540px] overflow-hidden bg-center bg-cover bg-no-repeat block"
      ref={parallaxRef}
      style={{
        backgroundImage: `url(${listing.propertyImgs[0]})`
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex pb-[8%] lg:pb-0">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 flex flex-col  justify-end lg:justify-center text-white">
          <div className="text-xs sm:text-sm lg:text-base font-light">
            {listing.bedrooms} Beds - {listing.bathrooms} Baths - {listing.area} Sqm
          </div>
          <div className="text-2xl sm:text-4xl lg:text-5xl font-normal lg:font-light my-3">
            {listing.name}
          </div>
          <div className="text-xs sm:text-sm lg:text-base line-clamp-3 leading-relaxed tracking-wide font-light max-w-[75%] sm:max-w-md lg:max-w-sm mb-4">
            {listing.description}
          </div>
          <div className="text-lg sm:text-xl lg:text-[28px]">
            ${numberWithCommas(listing.price)}
            {listing.status === 'rent' && '/mo'}
          </div>
        </div>
      </div>
    </Link>
  )
}
export default ListingSlide