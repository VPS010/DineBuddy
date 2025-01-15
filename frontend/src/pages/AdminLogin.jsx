import { useState } from "react";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";
import { WarningLink } from "../components/WarningLink";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const AdminLogin = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const InputHandler = (e) => {
    const { name, value } = e.target;
    setUser((user) => ({
      ...user,
      [name]: value,
    }));
  };

  
  const LoginHandler = (e) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      alert("Email and password are required.");
      return;
    }

    // Send login request to the backend
    axios
      .post("http://localhost:3000/api/v1/admin/signin", user)
      .then((result) => {
        localStorage.setItem("authorization", `Bearer ${result.data.token}`); // Save JWT
        navigate("/admin/dashboard"); // Redirect to dashboard or another page
        setUser({
          email: "",
          password: "",
        });
      })
      .catch((error) => {
        console.log("Login error:", error.response?.data?.error || error.message);
        alert("Invalid email or password.");
      });
  };

  return (
    <>
      <section className="flex bg-gray-50 align-middle items-center justify-center  ">
        <div className="ml-52 mr-0 hidden md:block">
        <img
            src="/herosec.png"
            className="h-[400px] w-[400px] mt-0 rounded-md  m-8"
            alt=""
          />
        </div>
        <div className="md:w-[90%] w-[100%]">
          <div className="flex flex-col items-center w-[500px] justify-center px-8 py-8 mx-auto md:h-screen  lg:py-0">
            <a
              href="./Login.jsx"
              className="flex items-center mb-6 text-2xl font-semibold text-gray-900 "
            >
             <p className="text-7xl font-mono text-center flex flex-col sm:text-left font-extrabold text-stone-800 md:text-5xl">
                SERVIT
              </p>
            </a>
            <div className="w-full bg-stone-100 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                  Sign in to your account
                </h1>
                <form className="space-y-4 md:space-y-6 text-left" action="#">
                  <InputBox
                    label={"Your email"}
                    iname={"email"}
                    placeholder={"name@company.com"}
                    onChange={InputHandler}
                    ivalue={user.username}
                  />

                  <InputBox
                    label={"Password"}
                    iname={"password"}
                    ivalue={user.password}
                    onChange={InputHandler}
                    placeholder={"••••••••"}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="remember"
                          aria-describedby="remember"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 "
                          required=""
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label className="text-gray-500">Remember me</label>
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-sm font-medium text-emerald-900 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Button label={"Sign in"} onClick={LoginHandler} />
                  <WarningLink
                    label={"Don’t have an account yet?"}
                    buttonText={"Sign up"}
                    to={"/admin/signup"}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminLogin;
