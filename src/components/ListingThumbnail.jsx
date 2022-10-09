import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import { db } from "../firebase";
import useAuthUser from "../hooks/useAuthUser";

function ListingThumbnail({ listing, edit, listings, setListings }) {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const [savedBy, setSavedBy] = useState();

  useEffect(() => {
    setSavedBy(listing.savedBy)
  }, [])

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  async function deleteListing() {
    if(window.confirm('Are you sure you want to delete this listing?')) {
      setListings(listings.filter(item => item.id !== listing.id))
      await deleteDoc(doc(db, "listings", listing.id))
    }
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

  return (
    <div className="flex flex-col rounded overflow-hidden shadow-md hover:shadow-lg duration-200 ease">
      <div 
        className="group relative flex aspect-[4/3] overflow-hidden cursor-pointer w-full
        bg-red-400"
      >
        {/* <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          navigation
          loop={listing?.propertyImgs?.length > 1}
        >
          {
            listing?.propertyImgs?.map((img, index) => (
              <SwiperSlide key={index}>
                <img 
                  src={img}
                  className="object-cover object-center select-none min-h-full min-w-full"
                  alt={listing?.name}
                  onClick={() => navigate(`/listing/${listing.id}`)}
                />
              </SwiperSlide>
            ))
          }
        </Swiper> */}
        {
          listing.status === 'rent' ? (
            <div className="absolute z-10 top-4 right-4 px-[5px] py-[3px] bg-black/60 text-white uppercase text-[10px] rounded-sm">
              For rent
            </div>
          ) : (
            <div className="absolute z-10 top-4 right-4 px-[5px] py-[3px] bg-black/60 text-white uppercase text-[10px] rounded-sm">
              For sale
            </div>
          )
        }
        {
          edit && (
            <>
              <Link
                to={`/editlisting/${listing.id}`}
                className="absolute z-10 top-4 left-4 bg-lightblue text-white text-sm
                w-6 h-6 rounded-sm flex justify-center items-center"
              >
                <i className="fa-solid fa-pencil"></i>
              </Link>
              <button 
                onClick={deleteListing}
                className="absolute z-10 top-4 left-12 bg-red-500 text-white text-sm
                w-6 h-6 rounded-sm flex justify-center items-center"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </>
          )
        }
        <div 
          className="absolute z-10 bottom-4 right-4 w-8 h-8 bg-black/40 text-white
          flex justify-center items-center rounded opacity-0 group-hover:opacity-100 duration-200 ease hover:bg-black/70"
          onClick={toggleSaved}
        >
          <i className={`${savedBy?.includes(user?.uid) ? 'text-red-400' : 'text-white'} fa-regular fa-heart text-sm`}></i>
        </div>
      </div>
      <div className="bg-white p-5 flex-1 flex flex-col space-y-2">
        {/* Listing Name */}
        <h3
          className="self-start cursor-pointer hover:text-lightblue duration-200"
          onClick={() => navigate(`/listing/${listing.id}`)}
        >{listing?.name}</h3>
        {/* Listing Details */}
        <div className="flex items-center font-light flex-wrap gap-y-2">
          <div className="text-lightblue text-lg mr-auto pr-3">
            ${numberWithCommas(listing.price)}
            {listing.status === 'rent' && '/mo'}
          </div>
          <div className="flex items-center space-x-4 text-sm text-secondary">
            {/* Bedrooms */}
            <div className="flex items-center space-x-[6px]">
              <i className="fa-solid fa-bed"></i>
              <span>{listing.bedrooms}</span>
            </div>
            {/* Bathrooms */}
            <div className="flex items-center space-x-[6px]">
              <i className="fa-solid fa-shower"></i>
              <span>{listing.bathrooms}</span>
            </div>
            {/* Land Size */}
            <div className="flex items-center space-x-[6px]">
              <i className="fa-solid fa-vector-square"></i>
              <span>{listing.area}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ListingThumbnail