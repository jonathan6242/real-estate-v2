import { Link } from "react-router-dom"

function PropertyType({ name, url, number }) {
  return (
    <Link
      to={`/category/${name.toLowerCase()}`}
      className="relative aspect-square md:aspect-[2/3] bg-cover bg-center bg-no-repeat rounded overflow-hidden"
      style={{
        backgroundImage: `url(${url})`
      }}
    >
      <div className="absolute inset-0 bg-black/50 text-white p-8 md:p-6 lg:p-8 font-light
      flex flex-col justify-between hover:bg-white/50 hover:text-black duration-200 ease">
        <div className="flex flex-col">
          <div className="text-xs leading-loose">{number} Properties</div>
          <div className="text-xl">{name}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase font-normal leading-5">
            More details
          </div>
          <i className="text-sm fa-solid fa-arrow-right-long"></i>
        </div>
      </div>
    </Link>
  )
}
export default PropertyType