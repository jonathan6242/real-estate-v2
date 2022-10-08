function ListingThumbnailSkeleton() {
  return (
    <div className="flex flex-col rounded overflow-hidden shadow-md">
      {/* Swiper Skeleton */}
      <div 
        className="relative flex aspect-[4/3] overflow-hidden cursor-pointer animated-bg"
      ></div>
      <div className="bg-white p-5 flex flex-col space-y-3">
        {/* Listing Name */}
        <h3 className="text-sm animated-bg w-32">
          &nbsp;
        </h3>
        {/* Listing Details */}
        <div className="flex flex-1 items-center text-sm font-light animated-bg">
          &nbsp;
        </div>
      </div>
    </div>
  )
}
export default ListingThumbnailSkeleton