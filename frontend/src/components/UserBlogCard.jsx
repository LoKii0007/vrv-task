import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";
import UpdateBlogModal from "./ui/UpdateBlogModal";
import DeleteModal from "./ui/deleteModal";
import { useGlobal } from "../hooks/global";

const UserBlogCard = ({blog, blogs, setBlogs, setFilteredBlogs, filteredBlogs}) => {
  const {currentUser} = useAuth();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { baseUrl } = useGlobal();


  console.log('currentUser', currentUser);

  useEffect(() => {
    console.log(updateLoading, deleteLoading);
  }, [updateLoading, deleteLoading, blog, blogs, currentUser]);

  const handleUpdate = async () => {
    setOpenUpdateModal(true);
  }

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await axios.delete(`${baseUrl}/delete-blog`, {
        data: { blogId: blog._id },
        withCredentials: true,
        validateStatus: (status) => status < 500
      });
      
      if(res.status === 200) {
        toast.success("Blog deleted successfully");
        setBlogs(prev => prev.filter(b => b._id !== blog._id));
        setFilteredBlogs(prev => prev.filter(b => b._id !== blog._id));
      }
    } catch (error) {
      toast.error("Blog deletion failed");
    } finally {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
    }
  };

  useEffect(() => {
    console.log(blogs);
  }, [blogs, filteredBlogs]);

  return (
    <>
      <button className="card bg-[#f5f5f5] shadow-md rounded-lg p-2 relative ">
        <div className="card-top flex justify-center ">
          <img className="w-[300px] h-[200px] rounded-md " src={`${blog.image}`} alt="" />
        </div>
        <div className="card-bottom md:px-4 flex flex-col gap-3 py-2">
          <div className="card-head font-semibold text-lg flex flex-col justify-between">
            <div className="text-gray-800 text-lg text-ellipsis whitespace-nowrap overflow-hidden capitalize text-left " >{blog.title}</div>
            <div className="text-gray-500 text-sm text-left  " >{blog.description}</div>
          </div>
          <div className="card-body md:text-base grid grid-cols-2 gap-4 justify-center items-center ">
            <button disabled={updateLoading} className={`${updateLoading ? "bg-blue-300" : "bg-blue-400"} rounded-md py-1 px-2`} onClick={handleUpdate}>Update</button>
            <button className={`bg-red-400 rounded-md py-1 px-2`} onClick={() => setOpenDeleteModal(true)}>Delete</button>
          </div>
        </div>
      </button>

      <UpdateBlogModal open={openUpdateModal} setOpen={setOpenUpdateModal} blog={blog} setBlogs={setBlogs} setFilteredBlogs={setFilteredBlogs} />
      <DeleteModal open={openDeleteModal} setOpen={setOpenDeleteModal} handleDelete={handleDelete} deleteLoading={deleteLoading} />
    </>
  );
};

export default UserBlogCard;
