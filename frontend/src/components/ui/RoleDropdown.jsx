import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useGlobal } from "../../hooks/global";
import { useAuth } from "../../hooks/AuthContext"
import { useEffect } from "react";

export default function Dropdown({userId, user, setUsers}) {

    const [loading, setLoading] = useState(false);
    const { baseUrl } = useGlobal();
    const {currentUser} = useAuth();

    const handleRole = async (role) => {
      const toastId = toast.loading("Updating user role...");
        try{
            setLoading(true);
            console.log(userId);
            const res = await axios.put(`${baseUrl}/auth/update-user-roles`, {userId, role}, {
                withCredentials: true, validateStatus: (status) => status < 500,
            });
            if(res.status !== 200){
                toast.error(res.data.msg || "User role update failed");
            }else{
                toast.dismiss(toastId);
                toast.success("User role updated successfully");
                const upDatedUser = res.data.user;
                setUsers((prevUsers) => prevUsers.map(user => user._id === userId ? upDatedUser : user));
            }
        }catch(error){
            toast.error(error.response.data.msg || "Server Error");
            toast.dismiss(toastId);
        }   finally{
            setLoading(false);
        }
    }

    useEffect(() => {

    }, [currentUser]);

  return (
    <Menu as="div" className="relative inline-block text-left w-full">
      <div className="w-full">
        <MenuButton className="flex w-full h-full items-center p-1 border border-gray-300 gap-2 rounded-md ">
            {user.role}
            <ChevronDownIcon className="w-4 h-4" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          {currentUser.role === "admin" && (
            <MenuItem>
              <button
                disabled={loading}
              onClick={() => handleRole("superUser")}
                type="submit"
                className="block w-full  px-4 py-2 text-right text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
              >
                SuperUser
              </button>
            </MenuItem>
          )}

          <MenuItem>
            <button
              disabled={loading}
              onClick={() => handleRole("user")}
              type="submit"
                className="block w-full px-4 py-2 text-right text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
              >
                User
              </button>
            </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
