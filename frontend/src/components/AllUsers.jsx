import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "./Usercard";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3000/api/auth/get-all-users",
          {
            withCredentials: true,
          }
        );
        if (response.status !== 200) {
          toast.error(response.data.msg);
          return;
        }
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  return (
    <>
      <div className="flex flex-col items-center gap-12 h-screen">
        <h1 className="text-2xl font-bold">All Users</h1>
        <div className="flex flex-col items-center justify-center w-[80%] gap-3 ">
          <div className="w-full flex gap-4 font-semibold text-lg text-gray-600">
            <div className="flex items-center justify-center py-3 px-5 w-[70px] ">No</div>
            <div className="users-top grid grid-cols-4 gap-2 md:gap-4 py-3 px-5 items-center justify-center w-full ">
              <div>Email</div>
              <div>Name</div>
              <div>Role</div>
              <div>Permissions</div>
            </div>
            <button className="flex items-center justify-center py-3 px-5">
              Delete
            </button>
          </div>
          <div className="users-bottom flex flex-col gap-3">
            {loading ? (
              <p>Loading...</p>
            ) : (
              users.map((user, index) => (
                <UserCard
                  key={user._id}
                  user={user}
                  setUsers={setUsers}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllUsers;
