import Navbar from "@/components/ui/Navbar";
import ProfileCard from "@/components/ui/ProfileCard";
import useProfile from "@/hooks/useProfile";

const mapUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.01968293617!2d144.95605481531837!3d-37.81720997975156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f4f1d6e3%3A0x5045675218ce6e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1616189547346!5m2!1sen!2sus";
const MyProfile = () => {
  const { profile, loading, error } = useProfile();

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
    if (profile) {
      return (
        <div className=" mx-4">
          <ProfileCard
            name={profile.fullName} 
            job_title="Skill Up" 
            jd={profile.opportunity.description} 
            start_date={profile.startDate}
            end_date={profile.endDate}
            mapUrl={mapUrl} // Assuming mapUrl is defined elsewhere
            meals={parseInt(profile.opportunity.logistics.no_of_meals, 10)}
            accommodationProvided={
              profile.opportunity.logistics.accommodation_provided ===
              "provided"
            }
            accommodationCovered={
              profile.opportunity.logistics.accommodation_covered === "covered"
            }
            transportCovered={
              profile.opportunity.logistics.transportation_covered === "covered"
            }
            computerProvided={
              profile.opportunity.logistics.computer_provided === "provided"
            }
          />
        </div>
      );
    }
  };
  return (
    <div className="">
      <Navbar />
      <div className=" mx-4">
         {renderContent()}
      </div>
    </div>
  );
};

export default MyProfile;
