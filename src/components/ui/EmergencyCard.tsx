import React from "react";
import { IoIosCall } from "react-icons/io";

interface EmergencyCardProps {
  label: string;
  number: string;
  icon: React.ReactNode;
}
const EmergencyCard = ({ label, number, icon }: EmergencyCardProps) => (
  <div className="flex flex-col w-full items-center space-y-2">
    <div className="bg-white w-full p-1 py-4 rounded-lg flex flex-col items-center justify-center text-xl text-blue-950 shadow-md ">
      <div className="flex items-center justify-center rounded-full h-16 w-16 border-2 border-blue-950">
        {icon}
      </div>
      <p className="text-md mt-2 font-semibold text-blue-950 text-center">{label}</p>

      <a
        href={`tel:${number}`}
        className="inline-flex items-center mt-1  text-blue-900 font-bold text-lg hover:underline"
      >
        <IoIosCall size={24} />
        <p>{number}</p>
      </a>
    </div>
  </div>
);
export default EmergencyCard;
