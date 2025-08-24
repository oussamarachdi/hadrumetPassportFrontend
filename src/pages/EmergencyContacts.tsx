import EmergencyCard from "@/components/ui/EmergencyCard";
import Navbar from "@/components/ui/Navbar";
import { FaAmbulance, FaFireExtinguisher } from "react-icons/fa";
import { GiPoliceOfficerHead } from "react-icons/gi";
import { MdOutlineSecurity } from "react-icons/md";
const EmergencyContacts = () => {
  const contacts = [
    {
      label: "Ambulance",
      number: "190",
      icon: <FaAmbulance size={40} />,
    },
    {
      label: "National Guard",
      number: "193",
      icon: <MdOutlineSecurity size={40} />,
    },
    {
      label: "Police",
      number: "197",
      icon: <GiPoliceOfficerHead size={40} />,
    },
    {
      label: "Firefighter",
      number: "198",
      icon: <FaFireExtinguisher size={40} />,
    },
  ];

  return (
    <div>
      <Navbar />
      <div className=" mx-6 mt-8 flex flex-col ">
        <h1 className=" underline text-black font-poppins font-semibold text-[22px]">
          Emergency Contacts
        </h1>
        {/* contats container */}
        <div className=" mt-6 w-full ">
          <div className="grid grid-cols-2 gap-5">
            {contacts.map((contact, idx) => (
              <EmergencyCard key={idx} {...contact} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
