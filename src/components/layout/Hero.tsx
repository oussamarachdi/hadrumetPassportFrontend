/* eslint-disable @typescript-eslint/no-unused-vars */
import ImageCarousel from "../ui/ImageCarousel";
import { IoRestaurant } from "react-icons/io5";
import { FaCoffee } from "react-icons/fa";
import { HiCurrencyEuro } from "react-icons/hi";
import { FaDumbbell } from "react-icons/fa6";
import GenericCard from "../ui/GenericCard";
import useEvents from "@/hooks/useEvents";
import useCategories from "@/hooks/usecategories";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import tnFlag from "@/assets/images/Sousse/tn.svg";

const Hero = () => {
  const { events, loading, error } = useEvents();
  const { catLoading, catError, categories } = useCategories();
  const slugify = (text: string) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\\-]+/g, "") // Remove all non-word chars
      .replace(/\\-\\-+/g, "-"); // Replace multiple - with single -

  const categoryLogos: { [key: string]: React.ReactElement } = {
    'Cafés': <FaCoffee size={35} className="text-blue-950" />,
    'Fitness Centers': <FaDumbbell size={35} className="text-blue-950" />,
    'Restaurants': <IoRestaurant size={35} className="text-blue-950" />,
    'Money Exchange': <HiCurrencyEuro size={35} className="text-blue-950" />,
  };

  // Map category label to a single-word display name
  const singleWordCategory = (label: string) => {
    if (label.toLowerCase().includes('café')) return 'Cafés';
    if (label.toLowerCase().includes('fitness')) return 'Gyms';
    if (label.toLowerCase().includes('restaurant')) return 'Restaurants';
    if (label.toLowerCase().includes('money')) return 'Exchange';
    return label.split(' ')[0];
  };

  const displayCategories = useMemo(() => {
    return categories.map((category) => ({
      id: category.id,
      name: category.label,
      logo: categoryLogos[category.label] , 
      linkTo: `/${category.id}`,
    }));
  }, [categories]);

  return (
       <div className=" w-full h-full flex flex-col mb-16">
      {/**mobile */}
      <div className=" mt-2  ">
        <div className="w-full flex justify-center mt-4">
          <div className="flex items-center gap-3 bg-blue-50 rounded-lg shadow px-6 py-3 border border-blue-200">
            <img src={tnFlag} alt="Tunisian flag" className="w-9 h-9 rounded-full object-cover" />
            <span className="text-blue-950 font-poppins font-semibold text-[20px]">Discover Sousse: Explore, Experience, Enjoy!</span>
          </div>
        </div>
        <div className="ml-4">
          <ImageCarousel />
        </div>

        {/**categories */}
        <div className="w-full mt-4">
          <h2 className="mx-4 mb-2 text-lg font-semibold text-blue-950">Recommended Destinations</h2>
          <div className="mx-4 grid grid-cols-4 gap-x-5 gap-y-4">
            {/* 5. Handle loading and error states for categories */}
            {catLoading ? (
              <p>Loading categories...</p>
            ) : catError ? (
              <p className="text-red-500">{catError}</p>
            ) : (
              // 6. Map over the new 'displayCategories' array
              displayCategories.map((category) => (
                <Link to={category.linkTo} key={category.id}>
                  <div
                    className="shadow-lg flex flex-col items-center justify-center aspect-square rounded-lg bg-white duration-300 transition-colors ease-in-out hover:bg-blue-600/15 cursor-pointer border-blue-950 border-2 p-5"
                  >
                    {category.logo}
                    <span className="mt-2 text-xs font-medium text-blue-950 text-center">{singleWordCategory(category.name)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
        
        {/**events */}
        <div className="mx-4 mt-4">
          {loading ? (
            <p>Loading events...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : events.length > 0 ? (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-blue-950">Events & Outings</h2>
                <Link to="/events">
                  <Button variant="link" className="text-blue-950 font-semibold">View More</Button>
                </Link>
              </div>
              <div className="flex justify-center">
                <Carousel className="max-w-full">
                  <CarouselContent className="px-2">
                    {events.slice(0, 8).map((event) => (
                      <CarouselItem key={event.id} className="basis-3/4 md:basis-1/3 lg:basis-1/4 px-2">
                <GenericCard
                  linkTo={`/events/${slugify(event.title)}`}
                  image={event.picture}
                  title={event.title}
                          address={event.location}
                  location={event.location}
                          startDate={event.startDate}
                          endDate={event.endDate}
                />
                      </CarouselItem>
              ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
          ) : (
            <div className="w-full text-center mt-10">
              <p className="text-gray-400 text-xl">No Events found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
