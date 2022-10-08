import axios from "axios";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid"
import { db, storage } from "../firebase";
import useAuthUser from "../hooks/useAuthUser"

function EditListing() {
  const { id } = useParams();
  const [fields, setFields] = useState({
    status: "sale",
    name: "",
    address: "",
    description: "",
    price: "",
    bedrooms: 1,
    bathrooms: 1,
    garages: 1,
    area: "",
    type: "",
    agentName: "",
    agentEmail: "",
    agentImage: "",
    propertyImages: [],
    oldAgentImg: "",
    oldPropertyImgs: []    
  });
  // Destructure fields from object in state
  const {
    status,
    name,
    address,
    description,
    price,
    bedrooms,
    bathrooms,
    garages,
    area,
    type,
    agentName,
    agentEmail,
    agentImage,
    propertyImages 
  } = fields;
  const [loading, setLoading] = useState(false);
  const [listingLoading, setListingLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('');
  const { user, loading: userLoading } = useAuthUser();
  const navigate = useNavigate();

  // Get listing and validate listing & user
  useEffect(() => {
    async function getListing() {
      setListingLoading(true);
      const docSnap = await getDoc(doc(db, "listings", id));
      if(docSnap.exists()) {
        if(docSnap.data().uid !== user.uid) {
          toast.error('Permission denied.', { theme: 'colored'})
          setListingLoading(false);
          navigate('/')
          return;
        }
        const listingCopy = {...docSnap.data()}
        // delete listingCopy.agentImg;
        // delete listingCopy.propertyImgs
        setFields({
          ...listingCopy,
          oldAgentImg: listingCopy.agentImg,
          oldPropertyImgs: listingCopy.propertyImgs,
          agentImage: null,
          propertyImages: []
        })
        setListingLoading(false);
      } else {
        toast.error('Listing does not exist.', { theme: 'colored'})
        setListingLoading(false);
        navigate('/')
        return;
      }
    }
    if(!userLoading && user) {
      getListing();
    }
  }, [userLoading])

  // Redirect if user is not signed in
  useEffect(() => {
    if(!userLoading && !user) {
      navigate('/signin')
      toast.error('Must sign in to edit listing.', {theme: 'colored'})
    }
  }, [userLoading])

  const onChange = (e) => {
    // Files
    if(e.target.files) {
      if(e.target.id === 'propertyImages') {
        setFields({
          ...fields,
          propertyImages: e.target.files
        })
      }
      if(e.target.id === 'agentImage') {
        setFields({
          ...fields,
          agentImage: e.target.files[0]
        })
      }
      return;
    }
    if (e.target.type === "number") {
      setFields({
        ...fields,
        [e.target.id]: +e.target.value,
      });
      return;
    }
    setFields({
      ...fields,
      [e.target.id]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage('Geocoding address...')

    if(propertyImages.length > 6) {
      toast.error('Maximum of 6 property images.', {theme: 'colored'})
      setLoading(false);
      return;
    }

    // Geocoding
    let geolocation;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_API_KEY}`
      );
      const data = response.data.results[0]
      if(!data) {
        toast.error('Invalid address.', {theme: 'colored'});
      }
      geolocation = data.geometry.location
    } catch (error) {
      toast.error('Invalid address.', {theme: 'colored'});
      console.log(error)
      setLoading(false);
      return;
    }

    // Store images in Firebase
    const storeImage = async (image) => {
      try {
        const filename = `${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, `images/${filename}`);
        await uploadBytes(storageRef, image)
        const url = await getDownloadURL(storageRef);
        return url;   
      } catch (error) {
        console.log(error)
      }
    }
    
    let agentImg;
    let propertyImgs;

    setLoadingMessage('Uploading images...')
    if(agentImage) {
      try {
        agentImg = await storeImage(agentImage)
      } catch (error) {
        console.log(error)
        toast.error('Could not upload images.', {theme: 'colored'})
        setLoading(false);
        return;
      }
    } else {
      agentImg = fields?.oldAgentImg;
    }
    if(propertyImages.length > 0) {
      try {
        propertyImgs = await Promise.all(
          [...propertyImages].map(image => storeImage(image))
        )
      } catch (error) {
        console.log(error)
        toast.error('Could not upload images.', {theme: 'colored'})
        setLoading(false);
        return;
      }
    } else {
      propertyImgs = fields?.oldPropertyImgs;
    }


    setLoadingMessage('Adding listing to database...')
    const fieldsCopy = {
      ...fields,
      type: type.toLowerCase(),
      geolocation,
      agentImg,
      propertyImgs,
      uid: user?.uid
    }
    delete fieldsCopy.agentImage
    delete fieldsCopy.propertyImages
    
    await updateDoc(doc(db, "listings", id), fieldsCopy)
    setLoading(false);
    setLoadingMessage();
    toast.success("Listing updated.", {theme: 'colored'})
    navigate(`/listing/${id}`)
  }

  if(listingLoading) {
    return (
      <div className="fixed inset-0 top-[60px] bg-black/50 flex justify-center items-center z-50">
        <div className="border-8 border-white rounded-full w-16 h-16 border-l-transparent border-r-transparent animate-spin"></div>
      </div>
    )
  }

  if(!user) {
    return <div className="flex-1 bg-background"></div>
  }

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto max-w-6xl sm:px-6 sm:py-16">
        {/* Edit Listing - Above 640px */}
        <h2 className="hidden sm:block text-3xl mb-8">
          Edit Listing
        </h2>
        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="px-6 py-8 sm:p-8 bg-white shadow-md rounded w-full sm:max-w-xl"
        >
          {/* Edit Listing - Below 640px */}
          <div className="text-3xl mb-6 sm:hidden">
            Edit Listing
          </div>
          {/* Sell / Rent */}
          <div className="flex flex-col space-y-2 mb-6">
            <div className="font-medium">Property Status</div>
            <div className="flex flex-wrap gap-2 text-center font-medium">
              <button 
                className={`px-6 sm:px-10 rounded  cursor-pointer h-10 leading-10 
                ${status === 'sale' ? 'bg-lightblue text-white' : 'border border-lightgray'}`}
                id="status"
                value="sale"
                onClick={onChange}
                type="button"
              >
                For Sale
              </button>
              <button 
                className={`px-6 sm:px-10 rounded  cursor-pointer h-10 leading-10 
                ${status === 'rent' ? 'bg-lightblue text-white' : 'border border-lightgray'}`}
                id="status"
                value="rent"
                onClick={onChange}
                type="button"
              >
                For Rent
              </button>
            </div>
          </div>
          {/* Name */}
          <div className="flex flex-col space-y-2 mb-6">
            <div className="font-medium">Property Name</div>
            <input 
              type="text"
              className="px-4 py-2 w-full focus:outline-none border border-lightgray rounded placeholder-secondary"
              id="name"
              value={name}
              onChange={onChange}
            />
          </div>
          {/* Address */}
          <div className="flex flex-col space-y-2 mb-6">
            <div className="font-medium">Property Address</div>
            <input 
              type="text"
              className="px-4 py-2 w-full focus:outline-none border border-lightgray rounded placeholder-secondary"
              id="address"
              value={address}
              onChange={onChange}
            />
          </div>
          {/* Description */}
          <div className="flex flex-col space-y-2 mb-6">
            <div className="font-medium">Description</div>
            <textarea
              className="px-4 py-2 w-full focus:outline-none border border-lightgray rounded placeholder-secondary"
              id="description"
              value={description}
              onChange={onChange}
              rows={5}
            />
          </div>
          {/* Price */}
          <div className="flex flex-col space-y-2 mb-6">
            <div className="font-medium">Price</div>
            <div className="flex items-center gap-2">
              <input 
                type="number"
                min={0}
                className="p-2 w-full focus:outline-none border border-lightgray rounded placeholder-secondary max-w-[144px]"
                id="price"
                value={price}
                onChange={onChange}
              />
              {
                status === "rent" && (
                  <div className="text-secondary">/month</div>
                )
              }
            </div>
          </div>
          {/* Bedrooms, Bathrooms, Garages */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-6">
            {/* Bedrooms */}
            <div className="flex flex-col space-y-2">
              <div className="font-medium">Bedrooms</div>
              <input 
                type="number"
                min={0}
                className="p-2 w-full focus:outline-none border border-lightgray rounded placeholder-secondary max-w-[72px]"
                id="bedrooms"
                value={bedrooms}
                onChange={onChange}
              />
            </div>
            {/* Bathrooms */}
            <div className="flex flex-col space-y-2">
              <div className="font-medium">Bathrooms</div>
              <input 
                type="number"
                min={0}
                className="p-2 w-full focus:outline-none border border-lightgray rounded placeholder-secondary max-w-[72px]"
                id="bathrooms"
                value={bathrooms}
                onChange={onChange}
              />
            </div>
            {/* Garages */}
            <div className="flex flex-col space-y-2">
              <div className="font-medium">Garages</div>
              <input 
                type="number"
                min={0}
                className="p-2 w-full focus:outline-none border border-lightgray rounded placeholder-secondary max-w-[72px]"
                id="garages"
                value={garages}
                onChange={onChange}
              />
            </div>
          </div>
          {/* Area */}
          <div className="flex flex-col space-y-2 mb-6">
            <div className="font-medium">Area (sqm)</div>
            <input 
              type="number"
              min={0}
              className="p-2 w-full focus:outline-none border border-lightgray rounded placeholder-secondary max-w-[144px]"
              id="area"
              value={area}
              onChange={onChange}
            />
          </div>
          {/* Property Type */}
          <div className="flex flex-col space-y-2 mb-6">
            <div className="font-medium">Property Type</div>
            <input 
              type="text"
              className="px-4 py-2 w-full focus:outline-none border border-lightgray rounded placeholder-secondary"
              id="type"
              value={type}
              onChange={onChange}
            />
          </div>
          {/* Agent Name */}
          <div className="flex flex-col space-y-2 mb-6">
            <div className="font-medium">Agent Name</div>
            <input 
              type="text"
              className="px-4 py-2 w-full focus:outline-none border border-lightgray rounded placeholder-secondary"
              id="agentName"
              value={agentName}
              onChange={onChange}
            />
          </div>
          {/* Agent Email */}
          <div className="flex flex-col space-y-2 mb-6">
            <div className="font-medium">Agent Email</div>
            <input 
              type="text"
              className="px-4 py-2 w-full focus:outline-none border border-lightgray rounded placeholder-secondary"
              id="agentEmail"
              value={agentEmail}
              onChange={onChange}
            />
          </div>
          {/* Agent Image */}
          <div className="flex flex-col space-y-2 mb-6">
            <div className="font-medium">Agent Image</div>
            <input 
              type="file"
              className="px-4 py-2 w-full focus:outline-none bg-background rounded placeholder-secondary input-group__file"
              id="agentImage"
              onChange={onChange}
              accept='.jpg,.png,.jpeg'
              
            />
          </div>
          {/* Property Images */}
          <div className="flex flex-col space-y-2 mb-6 sm:mb-8">
            <div className="flex flex-col space-y-1">
              <div className="font-medium">Property Images</div>
              <div className="text-sm text-secondary">
                Maximum 6 images.
              </div>
            </div>
            <input 
              type="file"
              multiple="multiple"
              max='6'
              accept='.jpg,.png,.jpeg'
              className="px-4 py-2 w-full focus:outline-none bg-background rounded placeholder-secondary input-group__file"
              id="propertyImages"
              onChange={onChange}
              
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className={`px-6 py-3 bg-lightblue text-white font-medium rounded
            hover:bg-[#33beff] duration-200 ease w-full h-12 mb-4
            ${loading ? 'pointer-events-none' : 'pointer-events-auto'}`}
          >
            {
              loading ? <i className="fa-solid fa-spinner animate-spin"></i>
              : "Update Listing"
            }
          </button>
          <div className="text-sm text-center text-secondary">
            {
              loading ? <>{loadingMessage}</> : <>&nbsp;</>
            }
          </div>
        </form>
        
      </div>
    </div>
  )
}
export default EditListing