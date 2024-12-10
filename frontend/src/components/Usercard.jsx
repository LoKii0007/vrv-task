import React, { useState } from "react";
import RoleDropdown from "./ui/RoleDropdown";
import PermissionsModal from "./ui/PermissionsModal";
import DeleteUserModal from "./ui/deleteUserModal";
import { useGlobal } from "../hooks/global";
import axios from "axios";
import toast from "react-hot-toast";


const Usercard = ({ user, setUsers, index }) => {

  const [open, setOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { baseUrl } = useGlobal()

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await axios.delete(`${baseUrl}/auth/delete-user`, {
        data: { userId: user._id },
        withCredentials: true,
        validateStatus: (status) => status < 500
      });
      
      if(res.status === 200) {
        toast.success("User deleted successfully");
        setUsers(prev => prev.filter(b => b._id !== user._id));
      }
    } catch (error) {
      toast.error("User deletion failed");
    } finally {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
    }
  };

  return (
    <>
      <div className="w-full flex gap-4">
        <div className="items-center justify-center py-3 px-5 w-[70px] hidden md:flex ">
          {index + 1}
        </div>
        <div className=" grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-4 py-3 px-5 items-center justify-center w-full md:w-[90%]  ">
          <div className="overflow-hidden text-ellipsis">{user.email}</div>
          <div className="hidden sm:block" >
            {user.firstName} {user.lastName}
          </div>
          <div className="overflow-hidden text-ellipsis w-full ">
            <button className="border rounded-md px-2 py-1 w-full text-left " onClick={() => setOpen(true)}>Edit</button>
            <PermissionsModal user={user} setUsers={setUsers} open={open} setOpen={setOpen} />
          </div>
          <div className=" w-full">
            <RoleDropdown userId={user._id} user={user} setUsers={setUsers} />
          </div>
        </div>
        <button className="flex items-center justify-center py-3 pe-5 md:px-5" onClick={() => setOpenDeleteModal(true)}>
          <img src="/svg/trash.svg" alt="delete" />
        </button>
      </div>

      <DeleteUserModal open={openDeleteModal} setOpen={setOpenDeleteModal} handleDelete={handleDelete} deleteLoading={deleteLoading} />
    </>
  );
};

export default Usercard;
