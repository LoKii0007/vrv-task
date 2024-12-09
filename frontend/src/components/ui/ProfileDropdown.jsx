import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useGlobal } from "../../hooks/global";
import { useAuth } from "../../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProfileDropdown() {
  const { activeView, setActiveView } = useGlobal();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleMyBlogs = () => {
    setActiveView("userBlogs");
  };

  const handleProfile = () => {
    setActiveView("profile");
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/auth/logout-user");
      if(res.status !== 200){
        toast.error("Logout failed");
      }
      else{
        toast.success("Logout successful");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="flex w-full h-full items-center rounded-full justify-center bg-blue-400 p-1 shadow-sm ">
          <img
            className="rounded-full w-6 h-6 "
            src={`${currentUser?.image ? currentUser.image : "/svg/user.svg"}`}
            alt=""
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          {currentUser ? (
            <>
              <MenuItem>
                <button
                  onClick={() => setActiveView("all")}
                  type="submit"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  Home
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={handleMyBlogs}
                  type="submit"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  My Blogs
                </button>
              </MenuItem>
              {(currentUser.role === "admin" ||
                currentUser.role === "superUser") && (
                <MenuItem>
                  <button
                    onClick={() => setActiveView("users")}
                    type="submit"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    Users
                  </button>
                </MenuItem>
              )}

              {currentUser.role === "admin" && (
                <MenuItem>
                  <button
                    onClick={() => setActiveView("superUsers")}
                    type="submit"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    Super Users
                  </button>
                </MenuItem>
              )}

              <MenuItem>
                <button
                  onClick={handleProfile}
                  type="submit"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  My Profile
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={handleLogout}
                  type="submit"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  Logout
                </button>
              </MenuItem>
            </>
          ) : (
            <MenuItem>
              <button
                onClick={handleLogin}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
              >
                Login
              </button>
            </MenuItem>
          )}
        </div>
      </MenuItems>
    </Menu>
  );
}
