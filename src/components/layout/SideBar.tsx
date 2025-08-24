import React from 'react'
import { FiHome, FiUser, FiCalendar, FiPhone, FiGrid, FiUsers, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className='bg-white w-[300px] fixed h-full shadow-lg pt-8'>
      <ul className="flex flex-col gap-4 px-6">
        <li>
          <Link to="/" className="flex items-center gap-3 text-blue-950 font-semibold text-lg hover:text-blue-700">
            <FiHome /> Home
          </Link>
        </li>
        <li>
          <Link to="/my-profile" className="flex items-center gap-3 text-blue-950 font-semibold text-lg hover:text-blue-700">
            <FiUser /> My Profile
          </Link>
        </li>
        <li>
          <Link to="/events" className="flex items-center gap-3 text-blue-950 font-semibold text-lg hover:text-blue-700">
            <FiCalendar /> Events
          </Link>
        </li>
        <li>
          <Link to="/emergency" className="flex items-center gap-3 text-blue-950 font-semibold text-lg hover:text-blue-700">
            <FiPhone /> Emergency
          </Link>
        </li>
        <li>
          <Link to="/local-apps" className="flex items-center gap-3 text-blue-950 font-semibold text-lg hover:text-blue-700">
            <FiGrid /> Local Apps
          </Link>
        </li>
        <li>
          <Link to="/contacts" className="flex items-center gap-3 text-blue-950 font-semibold text-lg hover:text-blue-700">
            <FiMapPin /> Contacts
          </Link>
        </li>
        <li>
          <Link to="/eps" className="flex items-center gap-3 text-blue-950 font-semibold text-lg hover:text-blue-700">
            <FiUsers /> Other EPs
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default SideBar
