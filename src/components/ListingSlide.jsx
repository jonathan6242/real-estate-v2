import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Aos from "aos"
import 'aos/dist/aos.css';

function ListingSlide({ listing }) {
  const parallaxRef = useRef();

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    Aos.init()
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

  if(listing.name === 'Park View Apartment') {
    return (
      <div 
        to={`/listing/${listing.id}`} 
        className="relative w-full aspect-square sm:aspect-[7/4] max-h-[540px] overflow-hidden bg-center bg-cover bg-no-repeat block"
        ref={parallaxRef}
        style={{
          backgroundImage: `url(${listing.propertyImgs[0]})`
        }}
      >
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        <div 
          className="absolute inset-0 bg-black/70 flex pb-[8%] lg:pb-0"
          data-aos="fade-in"
          data-aos-delay="500"
          data-aos-duration="1000"
        >
          <div className="container mx-auto max-w-6xl px-4 md:px-6 flex flex-col  justify-center sm:justify-end lg:justify-center text-white">
            <div className="overflow-hidden">
              <div 
                className="text-xs sm:text-sm lg:text-base font-light"
                data-aos="slide-down"
                data-aos-delay="1500"
                data-aos-duration="1000"
              >
                {listing.bedrooms} Beds - {listing.bathrooms} Baths - {listing.area} Sqm
              </div>
            </div>
            <div className="overflow-hidden">
              <div 
                className="text-2xl sm:text-4xl lg:text-5xl font-normal lg:font-light py-3"
                data-aos="slide-down"
                data-aos-delay="1500"
                data-aos-duration="1000"
              >
                {listing.name}
              </div>
            </div>
            <div 
              className="text-xs sm:text-sm lg:text-base line-clamp-3 leading-relaxed tracking-wide font-light max-w-[75%] sm:max-w-md lg:max-w-sm mb-4"
              data-aos="fade-in"
              data-aos-delay="1500"
              data-aos-duration="1500"
            >
              {listing.description}
            </div>
            <div className="overflow-hidden">
              <div 
                className="text-lg sm:text-xl lg:text-[28px] mb-5"
                data-aos="slide-down"
                data-aos-delay="1500"
                data-aos-duration="1000"
              >
                ${numberWithCommas(listing.price)}
                {listing.status === 'rent' && '/mo'}
              </div>
            </div>
            <Link
              to={`/listing/${listing.id}`}
              className="text-xs sm:text-sm uppercase tracking-wider w-40 sm:w-48 px-6 py-3 bg-white text-black self-start text-center group relative overflow-hidden"
              data-aos="fade-in"
              data-aos-delay="1500"
              data-aos-duration="1000"
            >
              <span className="relative z-10 rubik font-normal">View listing</span>
              <div className="absolute inset-0 bg-gray-200 translate-y-full group-hover:translate-y-0 duration-150 ease">
              
              </div>
            </Link>
          </div>
        </div>
        
      </div>
    )
  }

  return (
    <div 
      to={`/listing/${listing.id}`} 
      className="relative w-full aspect-square sm:aspect-[7/4] max-h-[540px] overflow-hidden bg-center bg-cover bg-no-repeat block"
      ref={parallaxRef}
      style={{
        backgroundImage: `url(${listing.propertyImgs[0]})`
      }}
    >
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      <div 
        className="absolute inset-0 bg-black/70 flex pb-[8%] lg:pb-0"
      >
        <div className="container mx-auto max-w-6xl px-4 md:px-6 flex flex-col  justify-center text-white">
          <div className="overflow-hidden">
            <div 
              className="text-xs sm:text-sm lg:text-base font-light"
            >
              {listing.bedrooms} Beds - {listing.bathrooms} Baths - {listing.area} Sqm
            </div>
          </div>
          <div className="overflow-hidden">
            <div 
              className="text-2xl sm:text-4xl lg:text-5xl font-normal lg:font-light py-3"
            >
              {listing.name}
            </div>
          </div>
          <div 
            className="text-xs sm:text-sm lg:text-base line-clamp-3 leading-relaxed tracking-wide font-light max-w-[75%] sm:max-w-md lg:max-w-sm mb-4"
          >
            {listing.description}
          </div>
          <div className="overflow-hidden">
            <div 
              className="text-lg sm:text-xl lg:text-[28px] mb-6"
            >
              ${numberWithCommas(listing.price)}
              {listing.status === 'rent' && '/mo'}
            </div>
          </div>
          <Link
            to={`/listing/${listing.id}`}
            className="text-xs sm:text-sm uppercase tracking-wider w-40 sm:w-48 px-6 py-3 bg-white text-black self-start text-center group relative overflow-hidden"
          >
            <span className="relative z-10 rubik font-normal">View listing</span>
            <div className="absolute inset-0 bg-gray-200 translate-y-full group-hover:translate-y-0 duration-150 ease">
            
            </div>
          </Link>
        </div>
      </div>
      
    </div>
  )
}
export default ListingSlide