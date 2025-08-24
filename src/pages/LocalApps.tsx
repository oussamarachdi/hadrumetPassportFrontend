import AppCard from "@/components/ui/AppCard";
import Navbar from "@/components/ui/Navbar";
import useLocalApps from "@/hooks/useLocalApps";
const LocalApps = () => {
  const { loading, error, apps } = useLocalApps();
  const renderContent = () => {
    if (loading) {
      return (
        <div className="w-full h-screen flex items-center justify-center">
          <h1 className="text-xl font-semibold">Loading...</h1>
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full text-center mt-10 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h1 className="text-xl font-bold">An Error Occurred</h1>
          <p>{error}</p>
        </div>
      );
    }
    if (apps.length === 0) {
      return (
        <div className="w-full text-center mt-10">
          <p className=" text-gray-400 text-xl">No contacts found.</p>
        </div>
      );
    }

    return (
      <div className="mt-6 w-full  grid grid-cols-2 gap-5">
        {apps.map((app, idx) => (
          <AppCard key={idx} {...app} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="mx-6 mt-8 flex flex-col ">
        <h1 className=" underline text-blue-950 font-poppins font-semibold text-[22px]">
          Local Apps
        </h1>

        {/* apps */}
        {renderContent()}
      </div>
    </div>
  );
};

export default LocalApps;
