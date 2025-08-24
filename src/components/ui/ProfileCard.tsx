import avatar from "../../assets/images/people/avatar.jpg";
import { FaUtensils, FaHome, FaCarAlt, FaLaptop } from "react-icons/fa";
import { FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import { FaBoxArchive } from "react-icons/fa6";

interface ProfileCardProps {
  name: string;
  job_title: string;
  jd: string;
  start_date: string;
  end_date: string;
  mapUrl: string;
  meals: number;
  accommodationProvided: boolean;
  accommodationCovered: boolean;
  transportCovered: boolean;
  computerProvided: boolean;
}
const ProfileCard = ({
  name,
  job_title,
  jd,
  start_date,
  end_date,
  mapUrl,
  meals,
  accommodationProvided,
  transportCovered,
  computerProvided,
}: ProfileCardProps) => {
  const icons = [];

  if (meals > 0) {
    icons.push({ icon: <FaUtensils size={22} />, label: "Food", count: meals });
  }

  if (transportCovered) {
    icons.push({ icon: <FaCarAlt size={22} />, label: "Transport" });
  }
  if (accommodationProvided) {
    icons.push({
      icon: <FaHome size={24} />,
      label: "Accommodation",
    });
  }
  if (computerProvided) {
    icons.push({ icon: <FaLaptop size={22} />, label: "Computer" });
  }

  return (
    <div className="mt-5 mb-7  text-gray-800 font-sans space-y-4">
      {/* Profile */}
      <div className="flex flex-col items-center">
        <img
          src={avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-white"
        />
        <h2 className="text-blue-950 text-xl font-semibold mt-2">{name}</h2>
        <p className="text-md text-gray-900">Exchange participant</p>
        <p className="text-sm text-gray-400">Hadrumet, Tunisia</p>
      </div>
      {/* Job description */}
      <div className="bg-white rounded-xl shadow-md p-3 space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-950">
            <FaBriefcase className="text-blue-950" size={18} />
            <p className="font-medium text-lg text-blue-950">{job_title}</p>
          </div>

          <p className="text-xs text-gray-400">
            {start_date} / {end_date}
          </p>
        </div>
        <p className="text-gray-900 text-sm">{jd}</p>
      </div>

      {/* Logistics  */}
      <div className="bg-white rounded-xl shadow-md p-3 space-y-4">
        <div className="flex items-center gap-2 font-medium text-lg text-blue-950">
          <FaBoxArchive />
          <span>Logistics</span>
        </div>

        <div className={` flex w-full ${icons.length>3 ? "justify-between":"justify-evenly"} `}>
          {icons.map(({ icon, label }, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-1">
              <div className="relative bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
                <div className="text-blue-950 text-xl">{icon}</div>

                {/* blue bubble */}
                {label === "Food" && meals > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                    {meals}
                  </span>
                )}
              </div>

              <span className={`${icons.length>2 ? "text-sm":"text-xs"} text-gray-900 text-center font-semibold`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl shadow-md p-3 mb-7">
        <div className=" mb-2 flex items-center gap-2  font-medium text-lg text-blue-950">
          <FaMapMarkerAlt size={16} />
          <p className="font-medium">Location</p>
        </div>

        <iframe
          title="Google Map"
          src={mapUrl}
          className="w-full h-44 rounded-lg border"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};

export default ProfileCard;
