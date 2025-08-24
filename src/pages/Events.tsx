import GenericCard from "@/components/ui/GenericCard";
import Navbar from "@/components/ui/Navbar";
import useEvents from "@/hooks/useEvents";

const Events = () => {
  const { events, loading, error } = useEvents();
  const slugify = (text: string) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\\-]+/g, "") // Remove all non-word chars
      .replace(/\\-\\-+/g, "-"); // Replace multiple - with single -
  const renderContent = () => {
    if (loading) {
      return (
        <div>
          <Navbar />

          <h1 className="text-center  text-blue-950 text-2xl font-bold mt-10">
            Loading...
          </h1>
        </div>
      );
    }
    if (error) {
      return (
        <div>
          <Navbar />
          <h1 className="text-center text-2xl font-bold mt-10 text-red-500">
            Error: {error}
          </h1>
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className="w-full text-center mt-10">
          <p className=" text-gray-400 text-xl">No Events found.</p>
        </div>
      );
    }

    return (
      
        
       
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {events.map((event) => (
            <GenericCard
              key={event.id}
              linkTo={`/events/${slugify(event.title)}`}
              image={event.picture}
              title={event.title}
              address={event.location}
              location={event.location}
              startDate={event.startDate}
              endDate={event.endDate}
            />
          ))}
        </div>
     
    );
  };
  return (
    <div>
      <Navbar />
      <div className="mx-6 mt-8 flex flex-col ">
        <h1 className=" underline text-blue-950 font-poppins font-semibold text-[22px]">
          Events & Outings
        </h1>

        {/* apps */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Events;
