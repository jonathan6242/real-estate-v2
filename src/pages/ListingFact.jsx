function ListingFact({ field, value, icon }) {
  return (
    <div className="flex flex-col capitalize">
      <div className="flex items-center space-x-2 h-7">
        {icon}
        <div className="font-semibold self-end">
          {value}
        </div>
      </div>
      <div className="font-light">
        {field}
      </div>
    </div>
  )
}
export default ListingFact