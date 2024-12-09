import React, { useState } from "react";
import toast from "react-hot-toast";
// import SignInwithGoogle from "./signInWithGoogle";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/AuthContext";
import { useGlobal } from "../../hooks/global";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for show/hide password
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const { baseUrl } = useGlobal();

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    const userData = {
      firstName: fname,
      lastName: lname,
      email,
      password,
    };

    try {
        console.log(baseUrl);
      const res = await axios.post(`${baseUrl}/auth/sign-up`, userData, {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });

      if (res.status === 201) {
        toast.success("User registered successfully");
        sessionStorage.setItem('user',JSON.stringify(res.data.user))
        setCurrentUser(res.data.user);
        console.log(res.data.user);
        navigate("/");
      } else {
        toast.error(res.data.msg || "Signup failed. Please try again");
      }
    } catch (error) {
      toast.error("Server error. Please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen register flex items-center justify-center bg-[#4c9a2a10]">

        <div className=" register-wrapper flex bg-white shadow-lg mx-[10%] justify-center items-center">
          <div className="signup-client w-full flex justify-center items-center gap-8">
            <div className="hidden md:flex md:w-1/2">
              <img
                className=" h-[60vh] w-full"
                src="/images/john.webp"
                alt="House"
              />
            </div>

            <div className="w-[90%] md:w-1/2 p-5 py-10">
              <div className="flex justify-center items-center gap-5 admin-logo ">
                {/* <img
                  src="/logo.png"
                  alt="Propped up Logo"
                  className="h-10 mb-4"
                /> */}
                <h3 className="text-2xl font-bold uppercase text-red-800">DigitalInk</h3>
              </div>

              <form onSubmit={handleRegister} className="space-y-4 mt-6 register-form ">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="First name"
                    className="w-1/2 px-4 py-2 border rounded-md"
                    onChange={(e) => setFname(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    className="w-1/2 px-4 py-2 border rounded-md"
                    onChange={(e) => setLname(e.target.value)}
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="relative ">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded-md"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-sm text-gray-600"
                  >
                    {!showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-eye-off"
                      >
                        <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                        <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                        <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                        <path d="m2 2 20 20" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-eye"
                      >
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center terms mt-2 px-2 ">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-green-600  "
                    required
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    By proceeding you agree to the terms and conditions.
                  </label>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-2 bg-[#4C9A2A] text-white font-semibold rounded-md hover:bg-green-600 focus:ring focus:ring-green-200"
                >
                  {loading ? "Signing up..." : "Sign up with email"}
                </button>
              </form>

              <div className="grid grid-cols-3 text-[12px] my-4">
                <div className="justify-center items-center flex w-full ">
                  <div className="h-[1px] w-3/4 bg-gray-300 "></div>
                </div>
                <p className="text-center">Or</p>
                <div className="justify-center items-center flex w-full ">
                  <div className="h-[1px] w-3/4 bg-gray-300 "></div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                {/* <SignInwithGoogle /> */}
              </div>

              <p className="text-sm text-center mt-4 text-gray-500">
                Already have an account?{" "}
                <a href="/login" className="text-green-600 hover:underline">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
