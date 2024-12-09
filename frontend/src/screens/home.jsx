import React, { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useGlobal } from '../hooks/global';
import UserBlogs from '../components/UserBlogs';
import AllUsers from '../components/AllUsers';

const Home = () => {

  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const {activeView, setActiveView, activeBlog} = useGlobal();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/get-all-blogs`);
      if(res.status !== 200) {
        toast.error(res.data.msg || "Something went wrong");
      }else{
        setBlogs(res.data.blogs);
        setFilteredBlogs(res.data.blogs);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg || "Server Error");
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    
  }, [blogs, activeView]);

  useEffect(() => {
    if(activeBlog === 'all'){
      setFilteredBlogs(blogs);
    }else{
      const filteredBlogs = blogs.filter((blog) => blog.category.toLowerCase() === activeBlog.toLowerCase());
      setFilteredBlogs(filteredBlogs);
    }
  }, [activeBlog]);

  return (
    <>
      <div className="home-wrapper p-12 w-full mt-[80px] ">

          {activeView === "all" && (
            <div className="home grid grid-cols-4 gap-5">
            { loading ? <div className="text-2xl font-bold text-center">Loading...</div> : filteredBlogs && filteredBlogs.length > 0 ? filteredBlogs.map((blog, index ) => (
              <BlogCard blog={blog} key={index} blogs={blogs} setBlogs={setBlogs} />
            )) : <div className="text-2xl font-bold text-center">No blogs found</div> 
            }
          </div>
          )}

          {activeView === "userBlogs" && (
            <UserBlogs />
          )}

          {activeView === "users" && (
            <AllUsers />
          )}
      </div>
    </>
  )
}

export default Home