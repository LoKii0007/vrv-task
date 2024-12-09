const express = require('express');
const { createBlog, likeBlog, dislikeBlog, getAllBlogs, deleteBlog, updateBlog, getUserBlogs } = require('../controller/blog');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); 
const { signUp, login, createSuperUser, deleteUser, getAllUsers, updateRole, signOutApi, updateUserPermissions } = require('../controller/auth');
const { verifyUser } = require('../utils/middleware');

router.post('/api/create-blog', verifyUser, upload.single("image"), createBlog);
router.post('/api/like-blog', verifyUser, likeBlog);
router.post('/api/dislike-blog', verifyUser, dislikeBlog);
router.get('/api/get-all-blogs', getAllBlogs);
router.delete('/api/delete-blog', verifyUser, deleteBlog);
router.put('/api/update-blog', verifyUser, upload.single("image"), updateBlog);

router.post('/api/auth/sign-up', signUp );
router.post('/api/auth/login', login );
router.post('/api/auth/create-super-user', verifyUser, createSuperUser);
router.delete('/api/auth/delete-user', verifyUser, deleteUser);
router.get('/api/auth/logout-user', verifyUser, signOutApi);

router.put('/api/auth/update-user-permissions', verifyUser, updateUserPermissions);
router.get('/api/auth/get-all-users', verifyUser, getAllUsers);
router.put('/api/auth/update-user-roles', verifyUser, updateRole);


router.get('/api/get-user-blogs', verifyUser, getUserBlogs);

module.exports = router;
