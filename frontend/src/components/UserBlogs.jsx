import React from 'react'
import { useAuth } from '../hooks/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import UserBlogCard from './UserBlogCard';
import { useGlobal } from '../hooks/global';

const UserBlogs = () => {

    const {currentUser} = useAuth();
    const {baseUrl} = useGlobal();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
  
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        console.log(baseUrl);
        const res = await axios.get(`${baseUrl}/get-user-blogs`, { withCredentials : true, validateStatus : (status) => status < 500 });
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
      console.log('blogs updated');
      setFilteredBlogs(blogs);
    }, [blogs]);

    useEffect(() => {
      console.log('filteredBlogs updated');
    }, [filteredBlogs]);

  return (
    <>
        <div className="user-blogs flex flex-wrap justify-evenly gap-5">
            {filteredBlogs &&filteredBlogs.length > 0 ? filteredBlogs.map((blog, index) => (  
                <UserBlogCard blog={blog} key={index} blogs={blogs} setBlogs={setBlogs} setFilteredBlogs={setFilteredBlogs} filteredBlogs={filteredBlogs} />
            )) : <div className="text-2xl font-bold text-center">You have no blogs yet</div>}
        </div>
    </>
  )
}

export default UserBlogs