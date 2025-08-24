import Navbar from "@/components/ui/Navbar";
import PersonCard from "@/components/ui/PersonCard";
import useContacts from "@/hooks/useContacts";

const Contacts = () => {
  // Consume the hook to get state and data
  const { loading, error, contacts } = useContacts();

  // Helper function to render content based on state
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
    
    if (contacts.length === 0) {
        return (
            <div className="w-full text-center mt-10">
                <p className=" text-gray-400 text-xl">No contacts found.</p>
            </div>
        );
    }

    return (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <PersonCard
            key={contact.id}
            image={contact.image || ""} 
            name={contact.fullName} 
            phone={contact.phone}
            facebook_link={contact.facebook_link}
            nationality="Tunisian"
            experience=""
            term=""
            position={contact.role} 
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="mt-8 mx-6">
        <h1 className="underline text-black font-poppins font-semibold text-[22px]">
          Experience Managers
        </h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default Contacts;