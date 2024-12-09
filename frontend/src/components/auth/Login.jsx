import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobal } from "../../hooks/global";
import { useAuth } from "../../hooks/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { baseUrl } = useGlobal();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseUrl}/auth/login`,
        { email, password },
        { withCredentials: true, validateStatus: function (status) {
          return status < 500; 
        }}
      );
      console.log(res.data)
      if (res.status === 200) {
        setCurrentUser(res.data.user); //? setting up current user
        sessionStorage.setItem('user',JSON.stringify(res.data.user))
        toast.success("User logged in Successfully");
        navigate("/"); //? navigate to home page
      } else {
        toast.error(res.data.msg ||"Login failed. Please try again");
      }
    } catch (error) {
      toast.error("Server error. Please try again");
      console.log("something went wrong, try again later", error.message);
    }
    setLoading(false);
  }

  return (
    <>
      <div className="h-screen register flex items-center justify-center bg-[#4c9a2a10]">
        <div className="flex register-wrapper bg-white shadow-lg lg:w-[70%] w-[90%] justify-center items-center">
          <div className="login-client signup-client w-full flex justify-center items-center gap-8">
            <div className="hidden md:flex md:w-1/2">
              <img
                className=" h-[60vh] w-full"
                src="/images/john.webp"
                alt="House"
              />
            </div>
            <div className="w-[90%] sm:w-3/4 lg:w-1/2 p-5 flex flex-col gap-4 py-8">
              <div className="flex items-center justify-center mb-6 gap-5 admin-logo">
                {/* <img src="/logo.png" alt="Propped up Logo" className="h-10" /> */}
                <h3 className="font-bold text-2xl uppercase text-red-800 ">DigitalInk</h3>
              </div>
              <form onSubmit={handleSubmit} className="register-form" >
                <div className="mb-4 ">
                  <label className="block text-sm font-semibold text-[#101010]">
                    Email
                  </label>
                  <input
                    type="email"
                    aria-label="Email"
                    className="mt-1 block w-full p-2 border border-gray-300 bg-[#FCFDFE] rounded-md shadow-sm "
                    placeholder="someone@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#101010]">
                    Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 block w-full p-2 border border-gray-300 bg-[#FCFDFE] rounded-md shadow-sm "
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-2 px-4 bg-[#4C9A2A] text-white font-semibold rounded-md shadow-sm hover:bg-green-600"
                >
                  {loading ? "submitting..." : "Log In"}
                </button>
              </form>
              <div className="grid grid-cols-3 text-[12px] ">
                <div className="justify-center items-center flex w-full ">
                  <div className="h-[1px] w-3/4 bg-gray-300 "></div>
                </div>
                <p className="text-center">Or </p>
                <div className="justify-center items-center flex w-full ">
                  <div className="h-[1px] w-3/4 bg-gray-300 "></div>
                </div>
              </div>
              <div className="w-full flex flex-col items-center justify-center gap-5">
                {/* <LoginWithGoogle /> */}
                <p className="text-sm text-gray-500 text-center">
                  Don’t have an account?{" "}
                  <a href="/signup" className="text-green-500 hover:underline">
                    Sign up
                  </a>
                </p>
                {/* <Link to={'/user/reset-pass'} className="text-xs text-gray-500 underline" >Forgot password</Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
