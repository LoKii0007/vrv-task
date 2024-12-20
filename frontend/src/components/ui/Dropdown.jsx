import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useGlobal } from "../../hooks/global";

export default function Dropdown({blogId, setBlogs, setFilteredBlogs }) {

  const { baseUrl } = useGlobal();

    const handleDelete = async () => {
        try{
            const res = await axios.delete(`${baseUrl}/delete-blog`,{data : {blogId} ,
                withCredentials: true, validateStatus : (status) => status < 500
            });
            if(res.status !== 200){
                toast.error(res.data.msg || "Blog deletion failed");
            }else{
                toast.success("Blog deleted successfully");
                setBlogs((prevBlogs) => prevBlogs.filter(blog => blog._id !== blogId));
                setFilteredBlogs((prevBlogs) => prevBlogs.filter(blog => blog._id !== blogId));
            }
        }catch(error){
            toast.error(error.response.data.msg || "Server Error");
        }   
    }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="flex w-full h-full items-center rounded-full justify-center bg-red-300 p-1 shadow-sm ">
            <img src="/svg/edit.svg" alt="" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
            <MenuItem>
              <button
              onClick={handleDelete}
                type="submit"
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
              >
                Delete
              </button>
            </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
