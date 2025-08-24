import { FiPhone } from "react-icons/fi";
import { TiSocialFacebookCircular } from "react-icons/ti";

interface PersonInfo {
  image: string;
  name: string;
  phone: string;
  nationality: string;
  experience: string;
  term: string;
  position: string;
  facebook_link: string;
}
const PersonCard = ({
  image,
  name,
  phone,
  nationality,
  experience,
  term,
  position,
  facebook_link,
}: PersonInfo) => {
  return (
    <div className=" flex bg-white p-2 items-center shadow-lg rounded-lg">
      <div className="flex items-center justify-center w-[36%]">
        <div className="w-28 h-28 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
          <img className="w-full h-full object-cover" src={image} alt="" />
        </div>
      </div>
      <div className=" ml-3">
        <h1 className=" text-blue-950 font-poppins font-semibold text-[17px] ">
          {name}
        </h1>
        <div className="flex items-center ">
          <FiPhone size={18} className="text-blue-950" />
          <h3 className="text-blue-950 ml-1 font-semibold text-[16px]">
            {phone}
          </h3>
        </div>
        {facebook_link !== "" && (
          <a href={facebook_link}>
            <div className="flex items-center">
              <TiSocialFacebookCircular size={23} className="text-blue-950" />
              <h3 className="text-blue-950 ml-1 font-semibold text-[16px]">
                See Facebook
              </h3>
            </div>
          </a>
        )}
        <h1 className=" text-md font-semibold text-gray-900">{position}</h1>
        <h1 className=" text-md text-gray-900"> from {nationality} </h1>
        <h3 className=" text-md text-gray-900">{experience}</h3>
        <h3 className=" text-md text-gray-900">{term}</h3>
      </div>
    </div>
  );
};

export default PersonCard;
