
import { MdOutlinePlace, MdPhone } from "react-icons/md";
// 1. Import Link from react-router-dom
import { Link } from "react-router-dom";

interface cardProps {
  image: string;
  description?: string;
  title: string;
  address: string;
  location: string;
  linkTo: string; 
  phone?: string;
  startDate?: string;
  endDate?: string;
}

const GenericCard = ({ image, description, title, address, location, linkTo, phone, startDate, endDate }: cardProps) => {
  return (

    <div className="shadow-lg p-4 mt-2 rounded-lg bg-white flex flex-col h-full min-h-[300px]">

      <Link to={linkTo} className="group">
        <div className="w-full">
          <img
            src={image}
            className="w-full h-[160px] object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
            alt={title}
          />
        </div>
        <h1 className="mt-3 text-blue-950 font-poppins font-semibold text-base ">
          {title}
        </h1>
        {/* Event Dates */}
        {(!!startDate || !!endDate) && (
          <div className="text-xs text-gray-600 mt-1 font-semibold">
            {startDate === endDate || !endDate ? (
              <span>{startDate}</span>
            ) : (
              <span>{startDate} - {endDate}</span>
            )}
          </div>
        )}
      </Link>
      
      {description && (
      <p className="text-gray-600 mt-1 font-poppin text-[14px] line-clamp-3 flex-grow">
        {description}
      </p>
      )}

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center">
          <MdOutlinePlace className="text-blue-950" size={22} />
          <span className="ml-1 text-blue-950 font-semibold text-sm">{address}</span>
        </div>
        {phone && (
        <div className="flex items-center">
            <MdPhone className="text-blue-950" size={20} />
            <span className="ml-1 text-blue-950 font-semibold text-sm">{phone}</span>
        </div>
        )}
      </div>
    </div>
  );
};

export default GenericCard;