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

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const loginHandler = (e) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      alert("Email and password are required.");
      return;
    }

    axios
      .post("http://localhost:3000/api/v1/admin/signin", user)
      .then((result) => {
        localStorage.setItem("authorization", `Bearer ${result.data.token}`);
        navigate("/admin/dashboard");
        setUser({
          email: "",
          password: "",
        });
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
    <section className="flex bg-gray-50 min-h-screen items-center justify-center">
      <div className="hidden md:block ml-52 mr-0">
        <img
          src="/herosec.png"
          className="h-96 w-[500px] rounded-md m-8"
          alt="Hero section"
        />
      </div>
      <div className="w-full md:w-[90%]">
        <div className="flex flex-col items-center w-[500px] justify-center px-8 py-8 mx-auto lg:py-0">
          <a
            href="/"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
          >
            <p className="text-5xl md:text-5xl font-mono text-center sm:text-left font-extrabold text-stone-800">
              DineBuddy
            </p>
          </a>
          <div className="w-full bg-stone-100 rounded-lg shadow sm:max-w-md">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Sign in to your account
              </h1>
              <form
                className="space-y-4 md:space-y-6 text-left"
                onSubmit={loginHandler}
              >
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
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500">
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="/forgot-password"
                    className="text-sm font-medium text-emerald-900 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Button type="submit" label="Sign in" />
                <WarningLink
                  label="Don't have an account yet?"
                  buttonText="Sign up"
                  to="/admin/signup"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
