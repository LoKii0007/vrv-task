import React, { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useGlobal } from '../hooks/global';
import UserBlogs from '../components/UserBlogs';
import AllUsers from '../components/AllUsers';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const {activeView, setActiveView, activeBlog} = useGlobal();
  const {currentUser, setCurrentUser} = useAuth();
  const navigate = useNavigate();
  const {baseUrl} = useGlobal()

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/get-all-blogs`);
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
    if(currentUser){
      fetchBlogs();
    }else{
      const data = JSON.parse(sessionStorage.getItem('user'));
      if(data){
        setCurrentUser(data);
        fetchBlogs();
      }else{
        navigate('/login');
      }
    }
  }, [currentUser]);

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

  useEffect(() => {
    console.log(filteredBlogs);
  }, [filteredBlogs]);

  return (
    <>
      <div className="home-wrapper p-5 sm:p-12 w-full mt-[80px] ">

          {activeView === "all" && (
            <div className="home flex flex-wrap justify-evenly gap-5">
            { loading ? <div className="text-2xl font-bold text-center">Loading...</div> : filteredBlogs && filteredBlogs.length > 0 ? filteredBlogs.map((blog, index ) => (
              <BlogCard blog={blog} key={index} blogs={blogs} setBlogs={setBlogs} setFilteredBlogs={setFilteredBlogs} />
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