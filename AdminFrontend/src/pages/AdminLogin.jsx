import { useState } from "react";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";
import { WarningLink } from "../components/WarningLink";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 6 characters long";
    return "";
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(user.email),
      password: validatePassword(user.password),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const loginHandler = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios
      .post("http://localhost:3000/api/v1/admin/signin", user)
      .then((result) => {
        localStorage.setItem("authorization", `Bearer ${result.data.token}`);
        navigate("/admin/dashboard");
        setUser({ email: "", password: "" });
      })
      .catch((error) => {
        console.log(
          "Login error:",
          error.response?.data?.error || error.message
        );
        alert("Invalid email or password.");
      });
  };

  return (
    <section className="h-screen flex flex-row bg-gray-50 overflow-hidden">
      {/* Image container - hidden on small screens */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/5 items-center justify-center p-4">
        <img
          src="https://i.ibb.co/kggpdn6m/herosec.png"
          className="h-96 w-96 object-contain rounded-lg shadow-lg"
          alt="Hero"
        />
      </div>

      {/* Form container */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex items-center justify-center p-3">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-4">
            <a href="/" className="inline-block">
              <h1 className="text-4xl md:text-4xl font-mono font-extrabold text-green-800">
                DineBuddy
              </h1>
            </a>
          </div>

          {/* Form Card */}
          <div className="bg-stone-100 rounded-lg mx-2 shadow-md p-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Sign in to your account
            </h2>

            <form className="space-y-3" onSubmit={loginHandler} noValidate>
              <div>
                <InputBox
                  label="Your email"
                  iname="email"
                  id="admin-email"
                  type="email"
                  placeholder="name@company.com"
                  onChange={inputHandler}
                  value={user.email}
                  required
                />
                {errors.email && (
                  <p className="mt-0.5 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <InputBox
                  label="Password"
                  iname="password"
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  onChange={inputHandler}
                  value={user.password}
                  required
                />
                {errors.password && (
                  <p className="mt-0.5 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-3 h-3 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-blue-300"
                  />
                  <label htmlFor="remember" className="text-xs text-gray-500">
                    Remember me
                  </label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-xs font-medium text-emerald-900 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <div className="pt-2">
                <Button type="submit" label="Sign in" />
              </div>
              
              <div className="pt-1">
                <WarningLink
                  label="Don't have an account yet?"
                  buttonText="Sign up"
                  to="/admin/signup"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;