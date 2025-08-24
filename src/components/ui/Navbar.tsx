import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import usePlaces from "@/hooks/usePlaces"; // 1. IMPORT THE HOOK
import { useAuth } from "@/context/AuthContext"; // 1. IMPORT useAuth
import { FiUser, FiHome, FiCalendar, FiPhone, FiGrid, FiUsers, FiMapPin, FiCoffee, FiShoppingBag } from "react-icons/fi";


const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const handleMenu = () => setMenu((prev) => !prev);
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // 2. GET USER AND LOGOUT FROM CONTEXT

  const handleLogout = () => {
    logout(); // 3. USE LOGOUT FROM CONTEXT
    navigate("/login");
  };
  const { categories, loading, error } = usePlaces();

  // A helper function to create a menu item with icon
  const MenuItem = ({
    to,
    icon,
    children,
  }: {
    to: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <li>
      <Link to={to} onClick={handleMenu} className="flex items-center gap-3 mt-1 w-full text-left font-poppins font-semibold text-[18px] text-black hover:bg-[#f0f0f0] py-2 px-6">
        {icon} {children}
      </Link>
    </li>
  );

  return (
    <div>
      {/* Overlay */}
      {menu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={handleMenu}
        ></div>
      )}

      {/* Sidedrawer */}
      <div
        className={
          menu
            ? "z-50 fixed left-0 top-0 rounded-r-[10px] w-[60%] h-full bg-white ease-in-out duration-500"
            : "ease-in-out duration-500 z-50 fixed left-[-100%]"
        }
      >
        <ul className="cursor-pointer">
          <li className="ml-6 mt-5 cursor-pointer pt-2 font-poppins text-blue-950 text-[20px] font-semibold">
            Hadrumet Passport
          </li>
          <MenuItem to="/" icon={<FiHome />}>Home</MenuItem>
          <MenuItem to="/my-profile" icon={<FiUser />}>My profile</MenuItem>
          {/* Categories with icons */}
          {!loading &&
            !error &&
            categories.map((category) => (
              <MenuItem
                key={category.id}
                to={`/${category.slug}`}
                icon={
                  category.name.toLowerCase().includes('café') ? <FiCoffee /> :
                  category.name.toLowerCase().includes('restaurant') ? <FiShoppingBag /> :
                  <FiMapPin />
                }
              >
                {category.name}
              </MenuItem>
            ))}
          <MenuItem to="/events" icon={<FiCalendar />}>Events</MenuItem>
          <MenuItem to="/emergency" icon={<FiPhone />}>Emergency numbers</MenuItem>
          <MenuItem to="/local-apps" icon={<FiGrid />}>Local Apps</MenuItem>
          <MenuItem to="/contacts" icon={<FiMapPin />}>Contacts</MenuItem>
          <MenuItem to="/eps" icon={<FiUsers />}>Other EPs</MenuItem>
            <button onClick={handleLogout} className="mt-1 w-full text-left items-center font-poppins flex font-semibold text-[18px] text-black hover:bg-[#f0f0f0] py-2 px-6">
              Log out
            </button>
        </ul>
      </div>

      {/* Navbar Bar */}
      <div className="flex justify-between pt-3 items-center ml-6 lg:ml-20 mr-6">
        <div className="flex items-center">
          <button
            className="pt-2 cursor-pointer flex lg:hidden"
            onClick={handleMenu}
            aria-label="Open menu"
          >
            <RxHamburgerMenu color="#000000" size={28} />
          </button>
          <div className="pt-2 ml-4 font-poppins text-blue-950 text-[20px] font-semibold">
           Hello, {user ? user.fullName : "Guest"}
          </div>
        </div>
        <Link to="/my-profile">
          <FiUser className="w-8 h-8 text-blue-950 self-center cursor-pointer" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
