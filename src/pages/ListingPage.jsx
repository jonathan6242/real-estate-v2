import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom"
import { db } from "../firebase";
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import ListingFact from "./ListingFact";
import { useLoadScript } from "@react-google-maps/api";
import Map from "../components/Map"
import ListingThumbnail from "../components/ListingThumbnail";
import ListingThumbnailSkeleton from "../components/ListingThumbnailSkeleton";
import { toast } from "react-toastify";
import useAuthUser from "../hooks/useAuthUser";

function ListingPage() {
  const [listing, setListing] = useState();
  const [similarListings, setSimilarListings] = useState();
  const [savedBy, setSavedBy] = useState();
  const { id } = useParams();
  const { user } = useAuthUser();
  const { isLoaded } = useLoadScript({ 
    googleMapsApiKey: process.env.REACT_APP_API_KEY
  })

  useEffect(() => {
    async function getListing() {
      setListing();
      setSimilarListings()
      const docSnap = await getDoc(doc(db, "listings", id));
      const listing = {...docSnap.data(), id: docSnap.id}
      setListing(listing);
      setSavedBy(listing.savedBy)
      async function getSimilarListings() { 
        let data = await getDocs(
          query(
            collection(db, "listings"),
            where("type", "==", listing.type),
          )
        );
        setSimilarListings(
          data.docs
            .map(doc => ({...doc.data(), id: doc.id}))
            .filter(listing => listing.id !== id)
            .slice(0, 4)
        )
      }
      getSimilarListings();
    }
    getListing();
  }, [id])

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  async function toggleSaved() {
    if(!user) {
      toast.error('Sign in to save listings.', { theme: 'colored' })
      return;
    } else {
      if(!savedBy.includes(user.uid)) {
        // If not saved, add UID to savedBy
        setSavedBy([...savedBy, user.uid])
        await updateDoc(doc(db, "listings", listing.id), {
          savedBy: arrayUnion(user.uid)
        })
      } else {
        // If saved, remove UID from savedBy
        setSavedBy(savedBy.filter(item => item !== user.uid))
        await updateDoc(doc(db, "listings", listing.id), {
          savedBy: arrayRemove(user.uid)
        })
      }
    }

  }

  function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied!', { theme: 'colored', autoClose: 2000 })
  }

  // Skeleton loading state
  if(!listing) {
    return (
      <div className="flex-1 flex bg-background">
        <div className="container mx-auto max-w-3xl lg:max-w-6xl p-0 md:px-6 md:py-8
        flex flex-col">
          <div className="h-8 mb-4 flex justify-end"></div>
          {/* Primary Header */}
          <div className="hidden md:flex h-9 mb-3 animated-bg"></div>
          {/* Secondary Header */}
          <div className="hidden md:flex h-7 mb-3 animated-bg"></div>
          {/* Listing Address */}
          <div className="hidden md:flex animated-bg mb-8 h-6"></div>
          {/* Images and Details */}
          <div className="flex flex-1">
            <div className="flex flex-col w-full lg:w-[70%]">
              {/* Swiper */}
              <div className="w-full aspect-[4/3] animated-bg"></div>
              {/* Name, Price, Address - Below 768px */}
              <div className="p-8 bg-white md:hidden flex-1 flex flex-col border-b">
                <h2 className="mb-2 h-8 w-full animated-bg"></h2>
                <div className="mb-4 self-start h-5 w-full animated-bg"></div>
                {/* Listing Address */}
                <div className="h-5 mb-4 w-full animated-bg"></div>
                {/* Price */}
                <div className="h-5 mb-4 w-full animated-bg"></div>
              </div>
            </div>
            {/* Agent Details - Above 1024px */}
            <div className="w-[30%] animated-bg self-start hidden lg:block ml-8 h-48">
            </div>
          </div>
          <div className="mb-96"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto max-w-3xl lg:max-w-6xl p-0 md:px-6 md:py-8
      flex flex-col">
        {/* Save & Copy Buttons - Above 768px */}
        <div className="h-8 mb-4 hidden md:flex justify-between text-secondary">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm capitalize">
            <Link 
              to='/'
              className="text-lightblue"
            >
              Home
            </Link>
            <span className="breadcrumb">&gt;</span>
            <Link 
              to={`/category/${listing.type}`}
              className="text-lightblue"
            >
              {listing.type}
            </Link>
            <span className="breadcrumb">&gt;</span>
            <span>{listing.name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="group w-8 h-8 border border-black flex justify-center items-center rounded duration-200 ease hover:bg-black"
              onClick={toggleSaved}
            >
              <i className={`fa-regular fa-heart text-sm
              ${savedBy?.includes(user?.uid) ? 'text-red-400'
              : 'text-black group-hover:text-white'}`}></i>
            </button>
            <button
              className="group w-8 h-8 border border-black flex justify-center items-center rounded duration-200 ease hover:bg-black"
              onClick={copyToClipboard}
            >
              <i className="fa-solid fa-share-nodes text-black text-sm group-hover:text-white"></i>
            </button>
          </div>
        </div>
        {/* Primary Header */}
        <div className="hidden md:flex items-center justify-between mb-3">
          <h2 className="text-2xl lg:text-3xl capitalize">
            {listing.name}
          </h2>
          <div className="font-semibold text-2xl lg:text-3xl">
            ${numberWithCommas(listing.price)}
            {listing.status === 'rent' && '/mo'}
          </div>
        </div>
        {/* Secondary Header */}
        <div className="hidden md:flex items-center justify-between mb-3">
          {
            listing.status === 'rent' ? (
              <div className="px-[6px] py-[3px] lg:px-[10px] lg:py-[5px] bg-black/60 text-white uppercase text-[10px] lg:text-xs rounded-sm font-medium">
                For rent
              </div>
            ) : (
              <div className="px-[6px] py-[3px] lg:px-[10px] lg:py-[5px] bg-black/60 text-white uppercase text-[10px] lg:text-xs rounded-sm font-medium">
                For sale
              </div>
            )
          }
          <div className="text-lg font-light">
            {numberWithCommas(listing.area)} sqm
          </div>
        </div>
        {/* Listing Address */}
        <div className="font-light hidden md:flex space-x-2 text-secondary mb-8">
          <i className="fa-solid fa-location-dot leading-5"></i>
          <span>{listing.address}</span>
        </div>
        {/* Images and Details */}
        <div className="flex">
          <div className="flex flex-col w-full lg:w-[70%]">
            {/* Swiper */}
            <div className="w-full aspect-[4/3] bg-black">
              <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                loop={listing?.propertyImgs?.length > 1}
              >
                {
                  listing?.propertyImgs?.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img 
                        src={img}
                        className="object-cover object-center select-none
                        min-h-full min-w-full"
                        alt={listing?.name}
                      />
                    </SwiperSlide>
                  ))
                }
              </Swiper>
            </div>
            {/* Name, Price, Address - Below 768px */}
            <div className="p-8 bg-white md:hidden flex flex-col border-b">
              <h2 className="text-xl capitalize mb-2">
                {listing.name}
              </h2>
              <div className="mb-4 self-start">
                {
                  listing.status === 'rent' ? (
                    <div className="px-[6px] py-[3px] bg-black/60 text-white uppercase text-[10px] rounded-sm font-medium">
                      For rent
                    </div>
                  ) : (
                    <div className="px-[6px] py-[3px] bg-black/60 text-white uppercase text-[10px] rounded-sm font-medium">
                      For sale
                    </div>
                  )
                }
              </div>
              {/* Listing Address */}
              <div className="font-light space-x-2 text-secondary text-sm mb-4">
                <i className="fa-solid fa-location-dot leading-5"></i>
                <span>{listing.address}</span>
              </div>
              {/* Price */}
              <div className="font-semibold text-xl mb-8">
                ${numberWithCommas(listing.price)}
                {listing.status === 'rent' && '/mo'}
              </div>
              {/* Save & Copy Buttons - Below 768px */}
              <div className="h-10 flex flex-wrap md:hidden gap-2">
                <button
                  className="group w-10 h-10 border border-black flex justify-center items-center rounded"
                  onClick={toggleSaved}
                >
                  <i className={`fa-regular fa-heart
                  ${savedBy?.includes(user?.uid) ? 'text-red-400'
                  : 'text-black'}`}></i>
                </button>
                <button
                  className="group w-10 h-10 border border-black flex justify-center items-center rounded"
                  onClick={copyToClipboard}
                >
                  <i className="fa-solid fa-share-nodes text-black"></i>
                </button>
              </div>
            </div>
            {/* Overview */}
            <div className="p-8 bg-white md:mt-8 rounded border-b md:border-none">
              <h3 className="text-lg md:pb-8 md:border-b mb-6">Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-5 mb-8">
                <ListingFact 
                  field="Property Type"
                  value={listing.type}
                />
                <ListingFact 
                  field="Bedrooms"
                  value={listing.bedrooms}
                />
                <ListingFact 
                  field="Bathrooms"
                  value={listing.bathrooms}
                />
                <ListingFact 
                  field="Garages"
                  value={listing.garages}
                />
                <ListingFact 
                  field="Sqm"
                  value={listing.area}
                />
              </div>
            </div>
            {/* Description */}
            <div className="p-8 bg-white md:mt-8 rounded border-b md:border-none">
              <h3 className="text-lg md:pb-8 md:border-b mb-6">Description</h3>
              <div className="font-light leading-relaxed">
                {listing.description}
              </div>
            </div>
            {/* Map */}
            <div className="p-8 bg-white md:mt-8 rounded border-b md:border-none">
              <h3 className="text-lg md:pb-8 md:border-b mb-6">Map</h3>
              <div className="w-full h-96 flex">
                {
                  isLoaded ? (
                    <Map geolocation={listing.geolocation} />
                  ) : (
                    <></>
                  )
                }
              </div>
            </div>
            {/* Contact Information */}
            <div className="p-8 bg-white md:mt-8 rounded border-b md:border-none">
              <h3 className="text-lg md:pb-8 md:border-b mb-6">
                Contact Information
              </h3>
              <div className="flex gap-x-4 mb-6">
                <img
                  src={listing.agentImg}
                  className="w-20 h-20 rounded"
                />
                <div className="flex-1 flex flex-col">
                  <div className="font-light mb-1">
                    <i className="fa-regular fa-user leading-5 text-sm"></i>
                    &nbsp;&nbsp;{listing.agentName}
                  </div>
                  <div className="text-sm font-light text-secondary mb-4">
                    {listing.agentEmail}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <i className="fa-brands fa-facebook cursor-not-allowed"></i>
                    <i className="fa-brands fa-instagram cursor-not-allowed"></i>
                    <i className="fa-brands fa-linkedin-in cursor-not-allowed"></i>
                    <i className="fa-brands fa-youtube cursor-not-allowed"></i>
                  </div>
                </div>
              </div>
              <a
                href={`mailto:${listing.agentEmail}`} 
                className="w-full md:w-56 h-10 flex justify-center items-center bg-orange rounded text-white hover:shadow-md duration-200 ease font-medium"
              >
                Contact agent
              </a>
            </div>
            {/* Similar Listings */}
            <div className="p-8 md:py-4 md:px-0 md:mt-8 rounded border-b md:border-none">
              <h3 className="text-lg md:pb-8 md:border-b mb-6">Similar Listings</h3>
              <div className="grid sm:grid-cols-2 gap-8">
                {
                  similarListings ? similarListings?.map(listing => (
                    <ListingThumbnail listing={listing} key={listing.id} />
                  )) : new Array(4).fill(0).map((_, index) => (
                    <ListingThumbnailSkeleton key={index} />
                  ))
                }
              </div>
            </div>
          </div>
          {/* Agent Details - Above 1024px */}
          <div className="w-[30%]">
            <div className=" bg-white p-8 self-start hidden lg:block ml-8 rounded sticky
            top-4">
              <div className="flex gap-x-4 mb-4">
                <img
                  src={listing.agentImg}
                  className="w-16 h-16 rounded"
                />
                <div className="flex-1 flex flex-col">
                  <div className="font-light mb-1">
                    <i className="fa-regular fa-user leading-5 text-sm"></i>
                    &nbsp;&nbsp;{listing.agentName}
                  </div>
                  <div className="text-sm font-light text-secondary">
                    {listing.agentEmail}
                  </div>
                </div>
              </div>
              <a
                href={`mailto:${listing.agentEmail}`} 
                className="h-10 flex space-x-2 justify-center items-center bg-orange rounded text-white hover:shadow-md duration-200 ease font-medium"
              >
                Contact agent
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ListingPage