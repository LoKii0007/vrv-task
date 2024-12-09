const blogSchema = require("../models/blog");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const userSchema = require("../models/user");
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const createBlog = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const userId = req.user.userId;

        if(!userId || !title || !description ) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const user = await userSchema.findById(userId);
        if(!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        if(!user.permissions.includes("createBlog")) {
            return res.status(403).json({ msg: "You are not authorized to create blogs" });
        }

        const imageBuffer = req.file.buffer
        let imageUrl;
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "blogs" },
            async (error, result) => {
              if (error) {
                return res
                  .status(500)
                  .json({ msg: "Cloudinary upload failed", error: error.message });
              }
              imageUrl = result.secure_url;
              const blog = await blogSchema.create({ title, description, image: imageUrl, category, userId });
              res.status(201).json(blog); 
            }
          );
      
        streamifier.createReadStream(imageBuffer).pipe(uploadStream);  
    } catch (error) {
        console.log("Error in createBlog API: ", error.message);
        res.status(500).json({ msg: "Blog creation failed", error: error.message });
    }
};

const likeBlog = async (req, res) => {

    try {
        const { blogId } = req.body;
        console.log(blogId);    
        const userId = req.user.userId;

        if(!blogId || !userId) {
            return res.status(400).json({ msg: "Blog ID and User ID are required" });
        }

        const blog = await blogSchema.findById(blogId);
        if(!blog) {
            return res.status(404).json({ msg: "Blog not found" });
        }

        if(blog.downVotes.includes(userId)) {
            blog.downVotes = blog.downVotes.filter(id => id.toString() !== userId);
        }

        if(blog.upVotes.includes(userId)) {
            blog.upVotes = blog.upVotes.filter(id => id.toString() !== userId);
            await blog.save();
            return res.status(200).json({ msg: "Blog unliked successfully", like : false, dislike : blog.downVotes.length });
        }

        blog.upVotes.push(userId);
        await blog.save();
        res.status(200).json({ msg: "Blog liked successfully", like : true, dislike : false });
    } catch (error) {
        console.log("Error in likeBlog API: ", error.message);
        res.status(500).json({ msg: "Failed to like blog", error: error.message });
    }
}

const dislikeBlog = async (req, res) => {
    try {
        const { blogId } = req.body;
        const userId = req.user.userId;

        if(!blogId || !userId) {
            return res.status(400).json({ msg: "Blog ID and User ID are required" });
        }

        const blog = await blogSchema.findById(blogId);
        if(!blog) {
            return res.status(404).json({ msg: "Blog not found" });
        }

        if(blog.upVotes.includes(userId)) {
            blog.upVotes = blog.upVotes.filter(id => id.toString() !== userId);
            await blog.save();
        }

        if(blog.downVotes.includes(userId)) {  
            blog.downVotes = blog.downVotes.filter(id => id.toString() !== userId);
            await blog.save();
            return res.status(200).json({ msg: "Blog undisliked successfully", like : false, dislike : false });
        }

        blog.downVotes.push(userId);
        await blog.save();
        res.status(200).json({ msg: "Blog disliked successfully", like : false, dislike : true });
    } catch (error) {
        console.log("Error in dislikeBlog API: ", error.message);
        res.status(500).json({ msg: "Failed to dislike blog", error: error.message });
    }
}

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await blogSchema.find();

        if(blogs.length === 0) {
            return res.status(200).json({ msg: "No blogs found" });
        }

        res.status(200).json({ blogs });
    } catch (error) {
        console.log("Error in getAllBlogs API: ", error.message);
        res.status(500).json({ msg: "Failed to fetch blogs", error: error.message });
    }
}

const getUserBlogs = async (req, res) => {
    try {
        console.log("getUserBlogs API called");
        const userId = req.user.userId;
        const blogs = await blogSchema.find({ userId });
        console.log(blogs);
        res.status(200).json({ blogs });
    } catch (error) {
        console.log("Error in getUserBlogs API: ", error.message);
        res.status(500).json({ msg: "Failed to fetch blogs", error: error.message });
    }
}

const deleteBlog = async (req, res) => {
    try {
        const { blogId } = req.body;
        const userId = req.user.userId;

        if(!blogId || !userId) {
            return res.status(400).json({ msg: "Blog ID and User ID are required" });
        }

        const user = await userSchema.findById(userId);
        const blog = await blogSchema.findById(blogId);
        if(!blog) {
            return res.status(404).json({ msg: "Blog not found" });
        }

        if( user.role === 'user' && !user.permissions.includes("deleteBlog")) {
            return res.status(404).json({ msg: "You are not authorized to delete this blog" });
        }

        if( user.role === 'superUser' && !user.permissions.includes("deleteOtherBlogs")) {
            return res.status(404).json({ msg: "You are not authorized to delete blogs" });
        }

        if(blog.userId.toString() === userId.toString() || (user.role === "superUser" && user.permissions.includes("deleteOtherBlogs")) || (user.role === "admin") ) {
            await blogSchema.findByIdAndDelete(blogId);
            res.status(200).json({ msg: "Blog deleted successfully" });
        }else{
            return res.status(403).json({ msg: "You are not authorized to delete this blog" });
        }
    } catch (error) {
        console.log("Error in deleteBlog API: ", error.message);
        res.status(500).json({ msg: "Failed to delete blog", error: error.message });
    }
}

const updateBlog = async (req, res) => {
    try {
        console.log("updateBlog API called");
        const { title, description, author, tags } = req.body;
        const { blogId } = req.query;
        const userId = req.user?.userId; // Ensure userId exists with optional chaining

        // Validate required fields
        if (!blogId || !userId) {
            return res.status(400).json({ msg: "Blog ID and User ID are required" });
        }

        const user = await userSchema.findById(userId);
        const blog = await blogSchema.findById(blogId);

        // Validate blog and user existence
        if (!blog) {
            return res.status(404).json({ msg: "Blog not found" });
        }

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check user permissions
        if (!user.permissions.includes("updateBlog")) {
            return res.status(403).json({ msg: "You are not authorized to update this blog" });
        }

        const imageBuffer = req.file?.buffer; // Optional chaining for file existence

        if (imageBuffer) {
            // Handle image upload
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "image", folder: "blogs" },
                async (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error.message);
                        return res
                            .status(500)
                            .json({ msg: "Cloudinary upload failed", error: error.message });
                    }

                    const imageUrl = result.secure_url;

                    // Update blog with image
                    const newBlog = await blogSchema.findByIdAndUpdate(blogId, {
                        title,
                        description,
                        author,
                        image: imageUrl,
                        userId,
                    }, { new: true });
                    return res.status(200).json({ msg: "Blog updated successfully", blog: newBlog });
                }
            );

            streamifier.createReadStream(imageBuffer).pipe(uploadStream);
        } else {
            // Update blog without image
            const newBlog = await blogSchema.findByIdAndUpdate(blogId, {
                title,
                description,
                author,
                userId,
            }, { new: true });
            return res.status(200).json({ msg: "Blog updated successfully", blog: newBlog });
        }
    } catch (error) {
        console.error("Error in updateBlog API:", error.message);
        res.status(500).json({ msg: "Failed to update blog", error: error.message });
    }
};


module.exports = { createBlog, likeBlog, dislikeBlog, getAllBlogs, deleteBlog, updateBlog, getUserBlogs };

