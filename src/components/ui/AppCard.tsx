import {
  FaAndroid,
  FaAppStoreIos,
} from "react-icons/fa";
interface App {
  id: string;
  name: string;
  androidLink: string;
  iosLink: string;
  picture: string;
}
const AppCard = ({ name, androidLink, iosLink,picture  }: App) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center aspect-square w-full max-w-[200px] mx-auto">
    <div className="flex items-center justify-center w-full mb-2">
      <img src={picture} alt={name} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
    </div>
    <p className="font-semibold text-blue-950 text-xl mt-2">{name}</p>
    <div className="flex flex-col items-center mt-1 justify-center ">
      {androidLink && (
        <a
          href={androidLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-green-600 hover:underline text-base font-semibold"
        >
          <FaAndroid className="mr-2 text-xl" />
          Android
        </a>
      )}
      {iosLink && (
        <a
          href={iosLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center mt-1 text-blue-600 hover:underline text-base font-semibold"
        >
          <FaAppStoreIos className="mr-2 text-xl" />
          iOS
        </a>
      )}
    </div>
  </div>
);
export default AppCard;