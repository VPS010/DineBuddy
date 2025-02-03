import { useState } from "react";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";
import { WarningLink } from "../components/WarningLink";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    if (!user.name.trim()) newErrors.name = "Name is required";
    
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!user.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(user.email)) {
      newErrors.email = "Please provide a valid email address";
    }

    if (!user.password) {
      newErrors.password = "Password is required";
    } else if (user.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    const phoneRegex = /^\d{10}$/;
    if (!user.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(user.phone)) {
      newErrors.phone = "Please provide a valid 10-digit phone number";
    }

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
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const SignupHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
    <section className="h-screen flex flex-row bg-gray-50 justify-around items-center overflow-hidden">
      {/* Image container - hidden on small screens */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/5  items-center justify-center">
        <img
          src="https://i.ibb.co/kggpdn6m/herosec.png"
          className="w-96 h-96  object-contain rounded-lg shadow-lg"
          alt="Hero"
        />
      </div>

      {/* Form container */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex items-center justify-center p-3">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-3">
            <a href="/" className="inline-block">
              <h1 className="text-4xl md:text-4xl mb-2 text-green-800 font-mono font-extrabold">
                DineBuddy
              </h1>
            </a>
          </div>

          {/* Form Card */}
          <div className="bg-stone-100 rounded-lg shadow-md p-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
              Create an account
            </h2>

            <form className="space-y-2" onSubmit={SignupHandler}>
              <div>
                <InputBox
                  label="Your email"
                  iname="email"
                  placeholder="name@company.com"
                  onChange={InputHandler}
                  ivalue={user.email}
                />
                {errors.email && (
                  <p className="mt-0.5 text-xs text-red-600">{errors.email}</p>
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
                  <p className="mt-0.5 text-xs text-red-600">{errors.name}</p>
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
                  <p className="mt-0.5 text-xs text-red-600">{errors.phone}</p>
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
                  <p className="mt-0.5 text-xs text-red-600">
                    {errors.restaurantName}
                  </p>
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
                  <p className="mt-0.5 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-start space-x-2 mt-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-3 h-3 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-blue-300"
                  required
                />
                <label htmlFor="terms" className="text-xs text-gray-500">
                  I accept the{" "}
                  <a
                    className="font-medium hover:underline text-emerald-900"
                    href="#"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>

              <div className="pt-2">
                <Button label="Create an account" type="submit" />
              </div>
              
              <div className="pt-1">
                <WarningLink
                  label="Already have an account?"
                  buttonText="Login"
                  to="/admin/login"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminSignup;