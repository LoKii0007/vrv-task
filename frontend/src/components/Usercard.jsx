import React, { useState } from "react";
import RoleDropdown from "./ui/RoleDropdown";
import PermissionsModal from "./ui/PermissionsModal";

const Usercard = ({ user, setUsers, index }) => {

  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="w-full flex gap-4">
        <div className="flex items-center justify-center py-3 px-5 w-[70px] ">
          {index + 1}
        </div>
        <div className=" grid grid-cols-4 gap-2 items-center w-full py-3 px-5 ">
          <div className="overflow-hidden text-ellipsis">{user.email}</div>
          <div>
            {user.firstName} {user.lastName}
          </div>
          <div className=" w-[90%]">
            <RoleDropdown userId={user._id} user={user} setUsers={setUsers} />
          </div>
          <div>
            <button onClick={() => setOpen(true)}>Permissions</button>
            <PermissionsModal user={user} setUsers={setUsers} open={open} setOpen={setOpen} />
          </div>
        </div>
        <button className="flex items-center justify-center py-3 px-5">
          <img src="/svg/delete.svg" alt="delete" />
        </button>
      </div>
    </>
  );
};

export default Usercard;
