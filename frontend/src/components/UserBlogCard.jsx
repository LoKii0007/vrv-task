import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";
import Dropdown from "./ui/Dropdown";
import UpdateBlogModal from "./ui/UpdateBlogModal";


const UserBlogCard = ({blog, blogs, setBlogs}) => {
  const {currentUser} = useAuth();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);


  console.log('currentUser', currentUser);

  useEffect(() => {
    console.log(updateLoading, deleteLoading);
  }, [updateLoading, deleteLoading, blog, blogs, currentUser]);

  const handleUpdate = async () => {
    setOpenUpdateModal(true);
  }

  const handleDelete = async () => {
    setDeleteLoading(true);
    const res = await axios.delete(`http://localhost:3000/api/delete-blog`, { blogId : blog._id }, { withCredentials : true, validateStatus : (status) => status < 500 });
    console.log(res);
    if(res.status === 200) {
      toast.success("Blog deleted successfully");
      // setBlogs(blogs.filter(b => b._id !== blog._id));
    }
  }

  useEffect(() => {
    console.log(blogs);
  }, [blogs]);

  return (
    <>
      <button className="card bg-gray-100 shadow-md rounded-lg p-2 relative ">
        <div className="card-top flex justify-center ">
          <img className="w-[300px] h-[200px] rounded-md " src={`${blog.image}`} alt="" />
        </div>
        <div className="card-bottom md:px-4 flex flex-col gap-3 py-2">
          <div className="card-head font-semibold text-lg flex flex-col justify-between">
            <div className="text-gray-800 text-lg text-ellipsis whitespace-nowrap overflow-hidden" >{blog.title}</div>
            <div className="text-gray-500 text-sm " >{blog.description}</div>
          </div>
          <div className="card-body md:text-base text-xs grid grid-cols-2 gap-4 justify-center items-center ">
            <button disabled={updateLoading} className={`${updateLoading ? "bg-blue-300" : "bg-blue-400"} rounded-md py-1 px-2`} onClick={handleUpdate}>Update</button>
            <button disabled={deleteLoading} className={`${deleteLoading ? "bg-blue-300" : "bg-red-400"} rounded-md py-1 px-2`} onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </button>

      <UpdateBlogModal open={openUpdateModal} setOpen={setOpenUpdateModal} blog={blog} setBlogs={setBlogs} />
    </>
  );
};

export default UserBlogCard;
