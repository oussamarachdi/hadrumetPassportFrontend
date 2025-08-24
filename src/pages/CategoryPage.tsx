import { useParams } from "react-router-dom";
import Navbar from "@/components/ui/Navbar";
import GenericCard from "@/components/ui/GenericCard";
import usePlaces from "@/hooks/usePlaces"; // <-- IMPORT THE HOOK

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { categories, loading, error } = usePlaces();

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

  const category = categories.find((cat) => cat.slug === categorySlug);

  if (!category) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-grow grid place-items-center px-6">
          {/* 3. Your content box, with no centering classes needed */}
          <div className="w-full max-w-md p-4 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            <h1 className="text-xl font-bold">Category Not Found</h1>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER CONTENT ---
  return (
    <div>
      <Navbar />
      <h1 className="ml-6 mt-3 pt-2 font-poppins  tracking-wide underline text-blue-950 font-poppins font-semibold text-[22px]">
        {category.name}
      </h1>
      <div className="mx-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {category.elements.map((element) => (
          <GenericCard
            key={element.id}
            linkTo={`/${category.slug}/${element.slug}`}
            image={element.image}
            description={element.description}
            title={element.title}
            address={element.address}
            location={element.location}
            // phone removed for basic info only
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
