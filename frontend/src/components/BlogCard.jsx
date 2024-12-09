import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";
import Dropdown from "./ui/Dropdown";


const BlogCard = ({blog, blogs, setBlogs}) => {
  const {currentUser} = useAuth();
  const [like, setLike] = useState(blog?.upVotes?.includes(currentUser?.userId));
  const [dislike, setDislike] = useState(blog?.downVotes?.includes(currentUser?.userId));
  const [likeLoading, setLikeLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);

  console.log('currentUser', currentUser);

  const handleLike = async () => {
    try {
      setLikeLoading(true);
      const res = await axios.post(`http://localhost:3000/api/like-blog`, { blogId : blog._id }, { withCredentials : true, validateStatus : (status) => status < 500 });
      console.log(res);
      if(res.status !== 200) {
        toast.error(res.data.msg || "Something went wrong");
      }else{
        setLike(res.data.like);
        setDislike(res.data.dislike);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg || "Server Error");
    }finally{
      setLikeLoading(false);
    }
  }

  const handleDislike = async () => {
    try {
      setDislikeLoading(true);
      const res = await axios.post(`http://localhost:3000/api/dislike-blog`, { blogId : blog._id }, { withCredentials : true, validateStatus : (status) => status < 500 });
      console.log(res);
      if(res.status !== 200) {
        toast.error(res.data.msg || "Something went wrong");
      }else{
        setLike(res.data.like);
        setDislike(res.data.dislike);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg || "Server Error");
    }finally{
      setDislikeLoading(false);
    }
  }

  useEffect(() => {
    console.log(like, dislike);
  }, [like, dislike, blog, blogs, currentUser]);

  return (
    <>
      <button className="card bg-gray-100 shadow-md rounded-lg p-2 relative ">
        {(currentUser?.role === 'admin' || currentUser?.role === 'superUser') && (
          <div className="absolute top-0 right-0 rounded-full p-1 cursor-pointer ">
            <Dropdown blogId={blog._id} blogs={blogs} setBlogs={setBlogs} />
          </div>
        )}
        <div className="card-top flex justify-center ">
          <img className="w-[300px] h-[200px] rounded-md " src={`${blog.image}`} alt="" />
        </div>
        <div className="card-bottom md:px-4 flex flex-col gap-3 py-2">
          <div className="card-head font-semibold text-lg flex flex-col justify-between">
            <div className="text-gray-800 text-lg text-ellipsis whitespace-nowrap overflow-hidden" >{blog.title}</div>
            <div className="text-gray-500 text-sm " >{blog.description}</div>
          </div>
          <div className="card-body md:text-base text-xs flex gap-4 ">
            <button disabled={likeLoading} className={`flex items-center gap-2 ${like ? "bg-blue-300" : ""}`} onClick={handleLike}><img src="/svg/like.svg" alt="" />{like ? blog.upVotes.length + 1 : blog.upVotes.length}</button>
            <button disabled={dislikeLoading} className={`flex items-center gap-2 ${dislike ? "bg-blue-300" : ""}`} onClick={handleDislike}><img src="/svg/dislike.svg" alt="" />{dislike ? blog.downVotes.length + 1 : blog.downVotes.length}</button>
          </div>
        </div>
      </button>
    </>
  );
};

export default BlogCard;
