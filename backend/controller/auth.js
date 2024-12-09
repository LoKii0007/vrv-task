const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//?------------------------------
//? signup
//?------------------------------
const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, googleId } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Initialize newUserData and ensure connectedAccounts is an array
    let newUserData = { firstName, lastName, email, connectedAccounts: [] };

    if (googleId) {
      // If Google ID is provided, it's a Google-authenticated user
      newUserData.googleId = googleId;
      newUserData.connectedAccounts.push("Google");
    } else if (password) {
      // For email/password signup, hash the password
      const salt = await bcrypt.genSalt(10);
      newUserData.password = await bcrypt.hash(password, salt);
      newUserData.connectedAccounts.push("Email");
    } else {
      return res.status(400).json({ msg: "Password or Google ID required" });
    }

    // Create new user
    user = new User(newUserData);
    await user.save();

    // Create and send JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("authToken", token, {
      // httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.__v;
    delete userResponse.createdAt;
    delete userResponse.updatedAt;
    delete userResponse.totalOrders;
    delete userResponse.totalSpent;
    delete userResponse._id;


    res.status(201).json({ user: userResponse, msg: "User saved successfully" });

  } catch (error) {
    console.error("Error in signUp API: ", error.message);
    res.status(500).json({ msg: "Signup server error" });
  }
};

//?------------------------------
//? login
//?------------------------------
const login = async (req, res) => {
  try {
    const { email, password, googleId } = req.body;

    const user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -totalOrders -totalSpent"
    ); // Check if user exists
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!password && !googleId) {
      return res.status(400).json({ msg: "Please provide credentials" });
    }
    if (password && user.connectedAccounts.includes("Email")) {
      const isMatch = await bcrypt.compare(password, user.password); // Check password match
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
    }
    if (googleId && user.connectedAccounts.includes("Google")) {
      if (user.googleId !== googleId) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("authToken", token, {
      secure: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    const user2 = user.toObject();
    delete user2._id;
    delete user2.password;

    res.status(200).json({ user: user2 });
  } catch (error) {
    console.error("Error in login API: ", error.message);
    res.status(500).json({ msg: "login Server error" });
  }
};

//?------------------------------
//? login by authtoken
//?------------------------------
const getUserByToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password -__v -createdAt -updatedAt -totalOrders -totalSpent"
    );
    if (!user) {
      return res.status(400).json({ msg: "no user found" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("authToken", token, {
      secure: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error in getUserByToken API: ", err.message);
    return res.status(500).json({ error: err.message, msg: "error in getUser api" });
  }
};

//?------------------------------
//? update password
//?------------------------------
const updatePassword = async (req, res) => {
  try {
    const { currentPass, newPass } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPass, salt);

    // Save the updated user
    await user.save();


    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in updatePassword API: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//? ------------------------
//? auth update for user
//? ------------------------
const authUpdate = async (req, res) => {
  try {
    const { email, password, googleId } = req.body;

    const tokenUser = await User.findById(req.user.userId);
    if (!tokenUser) {
      return res.status(400).json({ msg: "no user found" });
    }

    // Find the user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user._id.toString() !== tokenUser._id.toString()) {
      return res.status(404).json({ msg: "not authorized" });
    }

    // If Google ID is provided and we want to link it to an email/password account
    if (googleId) {
      if (user.googleId) {
        // Check if the provided Google ID matches the existing one
        if (user.googleId !== googleId) {
          return res
            .status(400)
            .json({ msg: "Invalid Google ID for this user" });
        }
      } else {
        user.googleId = googleId; // Add Google ID if it does not exist
        user.connectedAccounts.push("Google");
      }
    }

    // If password is provided and we want to link it to a Google-authenticated account
    if (password) {
      if (user.password) {
        // Check if the provided password matches the existing one
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res
            .status(400)
            .json({ msg: "Invalid password for this user" });
        }
      } else {
        // Hash the new password and add it to the account
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.connectedAccounts.push("Email");
      }
    }

    // Save the updated user information
    await user.save();

    // Generate and send a new JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.cookie("authToken", token, {
      secure: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.__v;
    delete userResponse.createdAt;
    delete userResponse.updatedAt;
    delete userResponse.totalOrders;
    delete userResponse.totalSpent;
    delete userResponse._id;

    res
      .status(200)
      .json({ msg: "User updated with new auth method", user: userResponse });
  } catch (error) {
    console.error("Error in authUpdate API: ", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

//? ------------------------
//? signout api
//? ------------------------
const signOutApi = async (req, res) => {
  try {
    const userId = req.user?.userId; // Optional chaining to avoid errors
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    // Clear the authToken cookie
    res.clearCookie("authToken", {
      secure: true,
      sameSite: "None",
    });

    // Send response indicating sign-out success
    return res.status(200).json({ message: "Successfully signed out" });
  } catch (error) {
    console.error("Error in signOutApi API: ", error.message);
    return res.status(500).json({ message: "Server error during sign-out" });
  }
};


//?---------------------------------
//? --------------- send otp
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    user.otp = otp;
    user.Expiry = expiry;
    await user.save();

    // Send email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset Password OTP",
      html: gmailTemplateResetPassword(user.firstName, otp),
    };

    await nodemailerTransport.sendMail(mailOptions);
    res.status(200).json({ msg: "OTP sent to email." });
  } catch (error) {
    console.error("Error in sendOtp API: ", error.message);
    res.status(500).json({ msg: "Server error", error });
  }
};

//? ---------reset pass-------------
const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    const userId = req.user.userId; // Extracted from req.user as requested

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (!user.connectedAccounts.includes("Email")) {
      return res.status(404).json({ msg: "Not connected by email" });
    }

    if (user.otp !== otp || user.Expiry < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.Expiry = undefined;

    await user.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error("Error in resetPassword API: ", error.message);
    res.status(500).json({ msg: "Server error", error });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the admin user by ID
    const requestingUser = await User.findById(req.user.userId);

    if (!requestingUser || (requestingUser.role !== "admin" && requestingUser.role !== "superUser")) {
      return res.status(403).json({ msg: "Unauthorized or user not found" });
    }

    if( requestingUser.role === "superUser" && !requestingUser.permissions.includes("deleteUsers")){
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const deleted = await User.findByIdAndDelete(userId);

    if (!deleted) {
      return res.status(403).json({ msg: "user not found" });
    }

    if (deleted && deleted.profileCompleted) {
      await UserDetails.findOneAndDelete({ userId });
    }


    res.status(200).json({ msg: "user deleted", user: deleted });

  } catch (error) {
    console.error("Error in deleteUser API: ", error.message);
    res.status(500).json({ msg: "Server error while deleting profile" });
  }
};

const createSuperUser = async (req, res) => {
  try { 
    const { email, password, permissions } = req.body;

    const requestedUser = await User.findById(req.user.userId);
    if (!requestedUser || requestedUser.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(404).json({ msg: "User already exists" });

    const newUser = new User({ email, password, role: "superuser", permissions });
    await newUser.save();

    res.status(200).json({ msg: "Super user created" });
  } catch (error) {
    console.error("Error in createSuperUser API: ", error.message);
    res.status(500).json({ msg: "Server error while creating super user" });
  }
}


const getAllUsers = async (req, res) => {
  try {
    console.log("getAllUsers API called");
    const requestedUser = await User.findById(req.user.userId);
    console.log(requestedUser.role);

    // Check if the user exists and has proper authorization
    if (!requestedUser || !["superUser", "admin"].includes(requestedUser.role)) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    let users;

    // Admin can view all users except other admins
    if (requestedUser.role === "admin") {
      users = await User.find({ role: { $in: ["superUser", "user"] } });
    }

    // Superuser can only view users with role "user"
    if (requestedUser.role === "superUser") {
      users = await User.find({ role: "user" });
    }

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error in getAllUsers API: ", error.message);
    res.status(500).json({ msg: "Server error while fetching users" });
  }
};

const updateRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const requestedUser = await User.findById(req.user.userId);
    console.log(requestedUser.role);

    if (!requestedUser && requestedUser.role !== "admin" && requestedUser.role !== "superUser") {
      return res.status(403).json({ msg: "Unauthorized." });
    }

    const user = await User.findByIdAndUpdate(userId, { role });
    
    if(role === "superUser"){
      user.permissions = ["createBlog", "updateBlog", "deleteBlog", 'deleteOtherBlogs', 'updateUserPermissions']
    }
    if(role === "user"){
      user.permissions = ["createBlog", "updateBlog", "deleteBlog"]
    }

    await user.save();

    res.status(200).json({ msg: "User role updated", user });
  } catch (error) {
    console.error("Error in updateRole API: ", error.message);
    res.status(500).json({ msg: "Server error while updating user role" });
  }
};

const updateUserPermissions = async (req, res) => {
  try {
    const { permissions, userId } = req.body;

    const requestingUser = await User.findById(req.user.userId);
    if(!requestingUser || (requestingUser.role !== "superUser" && requestingUser.role !== "admin")){
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if(!user) return res.status(404).json({ msg: "User not found" });

    user.permissions = permissions;
    await user.save();

    res.status(200).json({ msg: "User permissions updated", user });  
  } catch (error) {
    console.error("Error in updateUserPermissions API: ", error.message);
    res.status(500).json({ msg: "Server error while updating user permissions" });
  }
}

module.exports = {
  signUp,
  login,
  getUserByToken,
  updatePassword,
  signOutApi,
  authUpdate,
  sendOtp,
  resetPassword,
  createSuperUser,
  deleteUser,
  getAllUsers,
  updateRole,
  updateUserPermissions
};
