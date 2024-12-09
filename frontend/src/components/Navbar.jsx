import React, { useState } from "react";
  import { Link } from "react-router-dom";
  import CreateBlogModal from "./ui/CreateBlogModal";
import ProfileDropdown from "./ui/ProfileDropdown";
import { useGlobal } from "../hooks/global";

const Navbar = () => {

  const [open, setOpen] = useState(false);
  const {setActiveBlog, activeBlog} = useGlobal();

  const handleCategory = (category) => {
    setActiveBlog(category);
  }

  return (
    <>
      <nav className="px-12 py-5 flex justify-between items-center fixed top-0 w-full z-50 bg-white">
        <div className="nav-left flex items-center gap-6">
          <Link onClick={() => setActiveBlog('all')} className="text-2xl font-bold text-red-800 " to="/">
            DigitalInk
          </Link>
          <button className="h-10 w-[1px] bg-black"></button>
          <button onClick={() => handleCategory("movies")} className={`menu-item hover:text-red-800 ${activeBlog === "movies" ? "text-red-800" : ""}`}>Movies</button>
          <button onClick={() => handleCategory("anime")} className={`menu-item hover:text-red-800 ${activeBlog === "anime" ? "text-red-800" : ""}`}>Anime</button>
          <button onClick={() => handleCategory("sports")} className={`menu-item hover:text-red-800 ${activeBlog === "sports" ? "text-red-800" : ""}`}>Sports</button>
          <button onClick={() => handleCategory("entertainment")} className={`menu-item hover:text-red-800 ${activeBlog === "entertainment" ? "text-red-800" : ""}`}>Entertainment</button>
        </div>
        <div className="nav-right flex items-center gap-6">
          <button onClick={() => setOpen(true)} className="menu-item flex items-center gap-2 hover:text-red-800">
            <img className=" rounded-full" src={`/svg/pen.svg`} alt="user" />
            Write
          </button>
          <ProfileDropdown />
        </div>
      </nav>

      <CreateBlogModal open={open} setOpen={setOpen} />
    </>
  );
};

export default Navbar;
