import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/ui/Navbar";
import useEvents from "@/hooks/useEvents";
import { IoMdTime } from "react-icons/io";
import { MdOutlinePlace } from "react-icons/md";
// It's a good idea to have the same slugify function here
const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\\-]+/g, "")
    .replace(/\\-\\-+/g, "-");

const EventDetail = () => {
  // 1. Get the 'eventSlug' from the URL parameters
  const { eventSlug } = useParams<{ eventSlug: string }>();

  // 2. Fetch the list of all events using your hook
  const { events, loading, error } = useEvents();

  // 3. Handle loading and error states first
  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-grow grid place-items-center">
          <h1 className="text-xl font-semibold">Loading Event...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-grow grid place-items-center text-center">
          <h1 className="text-xl font-semibold text-red-500">Error loading event</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // 4. Find the specific event that matches the slug from the URL
  const event = events.find(
    (e) => slugify(e.title) === eventSlug
  );

  // 5. If no event is found, display a "Not Found" message
  if (!event) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-grow grid place-items-center text-center">
          <h1 className="text-2xl font-bold">Event Not Found</h1>
          <p className="text-gray-500">Sorry, the event you're looking for does not exist.</p>
        </div>
      </div>
    );
  }

  // 6. If the event is found, render its details
  return (
    <div>
      <Navbar />
      <div className="ml-6 mt-3 pt-2 font-poppins text-blue-950 text-[23px] font-semibold tracking-wide">
        <Link to={`/events`} className="underline">
          Events & Outings
        </Link>
        <span> / {event.title}</span>
      </div>

      <div className="mx-6">
        <div className="w-full mt-5">
          <img
            src={event.picture || '/default-placeholder.png'} // Add a fallback image
            className="w-full object-cover h-[200px] rounded-md"
            alt={event.title}
          />
          <div className="bg-white px-4 py-3 mt-3 rounded-lg shadow-md">
            <h1 className="mt-2 text-blue-950 font-poppins font-semibold text-[23px]">
              {event.title}
            </h1>
            <h1 className=" text-gray-900 font-poppins font-semibold text-[19px]">
              {event.eventType}
            </h1>
            <p className="text-gray-600 mt-2 font-poppins text-[16px]">
              {event.description}
            </p>

            

            <div className="flex items-center mt-2">
              <IoMdTime size={25} className="text-blue-950" />
              <h3 className="text-blue-950 ml-2 font-semibold text-[17px]">
                {event.dayTime}
              </h3>
            </div>

            <a href={event.location} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center mt-2">
                <MdOutlinePlace size={25} className="text-blue-950" />
                <h3 className="text-blue-950 ml-2 font-semibold text-[17px] hover:underline">
                  See Location
                </h3>
              </div>
            </a>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;