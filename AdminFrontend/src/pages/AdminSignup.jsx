import { useState } from "react";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";
import { WarningLink } from "../components/WarningLink";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    email: "",
    name: "",
    password: "",
    phone: "",
    restaurantName: "",
  });

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!user.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!user.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(user.email)) {
      newErrors.email = "Please provide a valid email address";
    }

    // Password validation
    if (!user.password) {
      newErrors.password = "Password is required";
    } else if (user.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!user.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(user.phone)) {
      newErrors.phone = "Please provide a valid 10-digit phone number";
    }

    // Restaurant name validation
    if (!user.restaurantName.trim()) {
      newErrors.restaurantName = "Restaurant name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const InputHandler = (e) => {
    const { name, value } = e.target;
    setUser((user) => ({
      ...user,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const SignupHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/admin/signup",
        user
      );
      const token = response.data.token;
      localStorage.setItem("authorization", `Bearer ${token}`);
      navigate("/admin/dashboard");
      setUser({
        email: "",
        name: "",
        password: "",
        phone: "",
        restaurantName: "",
      });
    } catch (error) {
      console.error(
        "Signup error:",
        error.response?.data?.message || error.message
      );
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <section className="flex bg-gray-50 align-middle items-center justify-center">
      <div className="ml-52 mr-0 hidden md:block">
        <img
          src="/herosec.png"
          className="h-[400px] w-[500px] mt-0 rounded-md m-8"
          alt=""
        />
      </div>
      <div className="md:w-[90%] w-[100%]">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="./Signup.jsx" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
            <p className="text-7xl font-mono text-center flex flex-col sm:text-left font-extrabold text-stone-800 md:text-5xl">
              DineBuddy
            </p>
          </a>
          <div className="w-full bg-stone-100 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Create an account
              </h1>
              <form className="space-y-3 text-left" action="#">
                <div>
                  <InputBox
                    label="Your email"
                    iname="email"
                    placeholder="name@company.com"
                    onChange={InputHandler}
                    ivalue={user.email}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <InputBox
                    label="Name"
                    iname="name"
                    placeholder="Atul Patel"
                    onChange={InputHandler}
                    ivalue={user.name}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <InputBox
                    label="Phone"
                    iname="phone"
                    placeholder="1234567890"
                    onChange={InputHandler}
                    ivalue={user.phone}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <InputBox
                    label="Restaurant name"
                    iname="restaurantName"
                    placeholder="Royal Dines"
                    onChange={InputHandler}
                    ivalue={user.restaurantName}
                  />
                  {errors.restaurantName && (
                    <p className="mt-1 text-sm text-red-600">{errors.restaurantName}</p>
                  )}
                </div>

                <div>
                  <InputBox
                    label="Password"
                    iname="password"
                    type="password"
                    ivalue={user.password}
                    onChange={InputHandler}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-light text-gray-500">
                      I accept the{" "}
                      <a className="font-medium hover:underline text-emerald-900" href="#">
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                <Button label="Create an account" onClick={SignupHandler} />
                <WarningLink
                  label="Already have an account?"
                  buttonText="Login"
                  to="/admin/login"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminSignup;