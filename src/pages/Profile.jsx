import { signOut, updateProfile } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ListingThumbnail from "../components/ListingThumbnail";
import ListingThumbnailSkeleton from "../components/ListingThumbnailSkeleton";
import { auth, db } from "../firebase";
import useAuthUser from "../hooks/useAuthUser";

function Profile() {
  const { user, loading } = useAuthUser();
  const [listings, setListings] = useState();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function getListings() {
      const data = await getDocs(query(
        collection(db, "listings"),
        where("uid", "==", user.uid)
      ))
      setListings(data.docs.map(doc => ({...doc.data(), id: doc.id})));
    }
    if(!loading) {
      getListings();
    }
  }, [loading])

  const onSubmit = async (e) => {
    e.preventDefault();
    setEditing(false);
    if(name !== user?.displayName) {
      await updateProfile(user, { displayName: name} )
    }
  }

  useEffect(() => {
    if(!loading) setName(user?.displayName)
  }, [loading])

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-16">
        {/* My Profile */}
        <h2 className="text-2xl md:text-3xl mb-4 md:mb-8">
          My Profile
        </h2>
        <div className="p-8 bg-white shadow-md rounded max-w-md space-y-6
        mb-4">
          {/* Name */}
          <div
            className="flex flex-col space-y-1"
          >
            <div className="flex justify-between">
              <div className="font-medium">Name</div>
              {
                !editing ? (
                  <button
                    type="button"
                    className="text-lightblue cursor-pointer hover:underline"
                    onClick={() => setEditing(!editing)}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="text-lightblue cursor-pointer hover:underline"
                    onClick={() => setEditing(!editing)}
                  >
                    Done
                  </button>
                )
              }
            </div>
            {
              !editing ? (
                <div className="text-base">{name}</div>
              ) : (
                <form 
                  onSubmit={onSubmit}
                  className="flex"
                >
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-background focus:outline-none"
                  />
                </form>
              )
            }
          </div>
          {/* Email */}
          <div className="flex flex-col space-y-1">
            <div className="font-medium">Email</div>
            <div className="text-base">{user?.email}</div>
          </div>
        </div>
        <Link
          to='/createlisting'
          className="p-8 bg-white shadow-md rounded max-w-md flex justify-between items-center mb-4"
        >
          <span className="font-medium">Sell or rent your home</span>
          <i className="fa-solid fa-chevron-right"></i>
        </Link>
        <Link
          to='/favourites'
          className="p-8 bg-white shadow-md rounded max-w-md flex justify-between items-center mb-4 md:mb-8"
        >
          <span className="font-medium">View saved listings</span>
          <i className="fa-solid fa-chevron-right"></i>
        </Link>
        {/* Sign out */}
        <button 
          className={`px-6 py-3 bg-lightblue text-white font-medium rounded
          hover:bg-[#33beff] duration-200 ease w-full h-12 max-w-md mb-12 md:mb-16
          ${loading ? 'pointer-events-none' : 'pointer-events-auto'}`}
          onClick={async () => {
            await signOut(auth);
            toast.success('Successfully signed out.', {theme: 'colored'})
            navigate('/signin')
          }}
        >
          {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : "Sign out"}
        </button>
        {/* My Listings */}
        <h2 className="text-2xl md:text-3xl mb-4 md:mb-8">
          My Listings
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {
            listings && listings.length === 0 && (
              <div className="text-secondary font-light text-base md:text-lg">
                You have no listings at the moment.
              </div>
            )
          }
          {
            listings ? listings
              .map(listing => (
                <ListingThumbnail
                  listing={listing}
                  key={listing.id}
                  edit
                  listings={listings}
                  setListings={setListings}
                />
              )) : new Array(6).fill(0).map((_, index) => (
                <ListingThumbnailSkeleton key={index} />
              ))
          }
        </div>
      </div>
    </div>
  )
}
export default Profile