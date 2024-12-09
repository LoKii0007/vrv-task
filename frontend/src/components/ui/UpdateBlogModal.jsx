import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useGlobal } from "../../hooks/global";
import axios from "axios";
import toast from "react-hot-toast";

export default function UpdateBlogModal({
  open,
  setOpen,
  blog,
  setBlogs,
  setFilteredBlogs,
}) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
  const { baseUrl } = useGlobal();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "image") {
          formData.append(key, data.image[0]); // Add the file to FormData
        } else {
          formData.append(key, value);
        }
      });

      const res = await axios.put(`${baseUrl}/update-blog`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        validateStatus: (status) => status < 500,
        withCredentials: true,
        params: { blogId: blog._id },
      });

      if (res.status !== 200) {
        toast.error("Blog update failed");
      } else {
        toast.success("Blog updated successfully");
        setBlogs((prev) =>
          prev.map((b) => (b._id === blog._id ? res.data.blog : b))
        );
        setFilteredBlogs((prev) =>
          prev.map((b) => (b._id === blog._id ? res.data.blog : b))
        );
        reset();
        setImg(null);
        setOpen(false);
      }
    } catch (error) {
      toast.error("Blog update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValue("title", blog?.title);
    setValue("description", blog?.description);
    setValue("category", blog?.category);
    setImg(blog?.image);
  }, [blog]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImg(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setOpen(false);
    setImg(null);
  };

  useEffect(() => {}, [img]);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-10"
    >
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
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col md:gap-6 gap-4 justify-center items-center"
              >
                <div className="flex flex-col gap-2 w-full">
                  {img ? (
                    <>
                      <img src={img} alt="image" />
                    </>
                  ) : (
                    <>
                      <label
                        htmlFor="image"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Image
                      </label>
                    </>
                  )}
                  <input
                    {...register("image")}
                    onChange={handleFileChange}
                    type="file"
                    name="image"
                    id="image"
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full ">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    {...register("title")}
                    type="text"
                    name="title"
                    id="title"
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full ">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    name="description"
                    id="description"
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full ">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    {...register("category")}
                    name="category"
                    id="category"
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Science">Science</option>
                    <option value="Health">Health</option>
                    <option value="Business">Business</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Sports">Sports</option>
                    <option value="Travel">Travel</option>
                    <option value="Food">Food</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Art">Art</option>
                    <option value="Music">Music</option>
                    <option value="Books">Books</option>
                    <option value="Movies">Movies</option>
                    <option value="TV">TV</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 items-center gap-6 w-full ">
                  <button
                    onClick={handleCancel}
                    type="button"
                    className="border border-red-500 text-red-500 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loading}
                    type="submit"
                    className="border bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    {loading ? "Loading..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
