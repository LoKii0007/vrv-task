import { useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { useGlobalContext } from '../../hooks/global';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UpdateBlogModal({ open, setOpen, user, setUsers }) {

    
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState(user?.permissions);

    const handlePermission = (permission) => {
       if(permissions.includes(permission)) {
        setPermissions(prev => prev.filter(p => p !== permission));
       } else {
        setPermissions(prev => [...prev, permission]);
       }
    }

    const handleUpdate = async () => {
        try {
            setLoading(true);
    
            const res = await axios.put(`http://localhost:3000/api/auth/update-user-permissions`,
                { permissions, userId: user._id },{
                validateStatus: (status) => status < 500, withCredentials: true, params: { userId: user._id }
            });
    
            if (res.status !== 200) {
                toast.error("permissions update failed");
            } else {
                toast.success("permissions updated successfully");
                setOpen(false);
                const updatedUser = res.data.user;
                setUsers(prev => prev.map(u => u._id === user._id ? {...u, permissions: updatedUser.permissions} : u));
            }
        } catch (error) {
            toast.error("permissions update failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    }

    useEffect(() => {
      console.log(permissions);
    }, [permissions]);

    useEffect(() => {
        setPermissions(user?.permissions);
    }, [user]);

    

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className='flex flex-col md:gap-6 gap-4 justify-center items-center' >

                <div className='grid grid-cols-3 gap-5' >
                  <button onClick={() => handlePermission("createBlog")} className={`rounded-md p-2 px-4 ${permissions.includes("createBlog") ? "bg-blue-500" : "bg-gray-300 "}`} >Create Blog</button>
                  <button onClick={() => handlePermission("updateBlog")} className={`rounded-md p-2 px-4 ${permissions.includes("updateBlog") ? "bg-blue-500" : "bg-gray-300 "}`} >Update Blog</button>
                  <button onClick={() => handlePermission("deleteBlog")} className={`rounded-md p-2 px-4 ${permissions.includes("deleteBlog") ? "bg-blue-500" : "bg-gray-300 "}`} >Delete Blog</button>
                  <button onClick={() => handlePermission("deleteOtherBlogs")} className={`rounded-md p-2 px-4 ${permissions.includes("deleteOtherBlogs") ? "bg-blue-500" : "bg-gray-300 "}`} >Delete Other Blogs</button>
                  <button onClick={() => handlePermission("updateUserPermissions")} className={`rounded-md p-2 px-4 ${permissions.includes("updateUserPermissions") ? "bg-blue-500" : "bg-gray-300 "}`} >Update User Permissions</button>
                </div>

                <div className="grid grid-cols-2 items-center gap-6 w-full ">
                    <button onClick={handleCancel} type='button' className='border border-red-500 text-red-500 px-4 py-2 rounded-md'>Cancel</button>
                    <button onClick={handleUpdate} disabled={loading} type='submit' className='border bg-blue-500 text-white px-4 py-2 rounded-md'>{loading ? 'Loading...' : 'Update'}</button>
                </div>
              </div>
            </div>
            
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
