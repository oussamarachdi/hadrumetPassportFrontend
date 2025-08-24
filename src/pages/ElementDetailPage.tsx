import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/ui/Navbar";
import { FiPhone } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { MdOutlinePlace, MdOutlineDeliveryDining } from "react-icons/md";
import usePlaces from "@/hooks/usePlaces"; // <-- IMPORT THE HOOK

const ElementDetailPage = () => {
  const { categorySlug, elementSlug } = useParams();
  const { categories, loading, error } = usePlaces();

  if (loading) {
    return (
      <div>
        <Navbar />
        <h1 className="text-center text-2xl font-bold mt-10">Loading Item...</h1>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <Navbar />
        <h1 className="text-center text-2xl font-bold mt-10 text-red-500">Error: {error}</h1>
      </div>
    );
  }

  // Find the correct category and element AFTER data has loaded
  const category = categories.find((cat) => cat.slug === categorySlug);
  const element = category?.elements.find((el) => el.slug === elementSlug);

  if (!element || !category) {
    return (
      <div>
        <Navbar />
        <h1 className="text-center text-2xl font-bold mt-10">Item not found!</h1>
      </div>
    );
  }

  // --- RENDER CONTENT ---
  return (
    <div>
      <Navbar />
      <div className="ml-6 mt-3 pt-2 font-poppins text-blue-950 text-[23px] font-bold tracking-wide">
        <Link to={`/${category.slug}`} className="underline">
          {category.name}
        </Link>
        <span>/{element.title}</span>
      </div>

      <div className="mx-6">
        <div className="w-full mt-5">
          <img
            src={element.image || '/default-placeholder.png'} // Add a fallback image
            className="w-full object-cover h-[200px] rounded-md"
            alt={element.title}
          />
          <div className="bg-white px-4 py-3 mt-3 rounded-lg shadow-md">
            <h1 className="mt-2 text-blue-950 font-poppins font-semibold text-[23px]">
              {element.title}
            </h1>
            <h1 className=" text-gray-900 font-poppins font-semibold text-[19px]">
              {element.type ? element.type.charAt(0).toUpperCase() + element.type.slice(1) : ""}
            </h1>
            <p className="text-gray-600 mt-2 font-poppins text-[16px]">
              {element.description}
            </p>

            {element.phone && (
              <div className="flex items-center mt-4">
                <FiPhone size={20} className="text-blue-950" />
                <h3 className="text-blue-950 ml-2 font-semibold text-[17px]">
                  {element.phone}
                </h3>
              </div>
            )}

            <div className="flex items-center mt-2">
              <IoMdTime size={25} className="text-blue-950" />
              <h3 className="text-blue-950 ml-2 font-semibold text-[17px]">
                {element.working_time}
              </h3>
            </div>

            {/* Address */}
            {element.address && (
              <div className="flex items-center mt-2">
                <MdOutlinePlace size={25} className="text-blue-950" />
                <h3 className="text-blue-950 ml-2 font-semibold text-[17px]">
                  {element.address}
                </h3>
              </div>
            )}

            <a href={element.location} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center mt-2">
                <MdOutlinePlace size={25} className="text-blue-950" />
                <h3 className="text-blue-950 ml-2 font-semibold text-[17px] hover:underline">
                  See Location
                </h3>
              </div>
            </a>

            {element.delivery && (
              <div className="flex items-center mt-2 mb-4">
                <MdOutlineDeliveryDining size={25} className="text-blue-950" />
                <h3 className="text-blue-950 ml-2 font-semibold text-[17px]">
                  Delivery Available
                </h3>
              </div>
            )}
          </div>
          {/* See in Maps Button */}
          {element.location && (
            <div className="mt-6 flex justify-center">
              <a
                href={element.location}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
              >
                See in Maps
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElementDetailPage;