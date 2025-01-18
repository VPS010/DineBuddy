import { useState } from "react";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";
import { WarningLink } from "../components/WarningLink";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const AdminSignup = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    name: "",
    password: "",
    phone: "",
    restaurantName: "",
  });

  const InputHandler = (e) => {
    const { name, value } = e.target;

    setUser((user) => ({
      ...user,
      [name]: value,
    }));
  };
  const SignupHandler = async (e) => {
    e.preventDefault();

    // Basic validation
    const { email, name, password, phone, restaurantName } = user;
    if (!email || !name || !password || !phone || !restaurantName) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/admin/signup",
        user
      );
      const token = response.data.token;

      // Save token to localStorage
      localStorage.setItem("authorization", `Bearer ${token}`);

      // Navigate to dashboard
      navigate("/admin/dashboard");

      // Clear form
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
    <>
      <section className="flex bg-gray-50 align-middle items-center justify-center ">
        <div className="ml-52 mr-0 hidden md:block">
          <img
            src="/herosec.png"
            className="h-[400px] w-[400px] mt-0 rounded-md  m-8"
            alt=""
          />
        </div>
        <div className="md:w-[90%] w-[100%]">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a
              href="./Signup.jsx"
              className="flex items-center mb-6 text-2xl font-semibold text-gray-900 "
            >
              <p className="text-7xl font-mono text-center flex flex-col sm:text-left font-extrabold text-stone-800 md:text-5xl">
                SERVIT
              </p>
            </a>
            <div className="w-full bg-stone-100 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
              <div className="p-6 space-y-4  sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                  Create an account
                </h1>
                <form className="space-y-3 text-left" action="#">
                  <InputBox
                    label={"Your email"}
                    iname={"email"}
                    placeholder={"name@company.com"}
                    onChange={InputHandler}
                    ivalue={user.email}
                  />
                  <InputBox
                    label={"Name"}
                    iname={"name"}
                    placeholder={"Atul Patel"}
                    onChange={InputHandler}
                    ivalue={user.firstname}
                  />
                  <InputBox
                    label={"Phone"}
                    iname={"phone"}
                    placeholder={"1234567890"}
                    onChange={InputHandler}
                    ivalue={user.firstname}
                  />
                  <InputBox
                    label={"Restaurant name"}
                    iname={"restaurantName"}
                    placeholder={"Royal Dines"}
                    onChange={InputHandler}
                    ivalue={user.firstname}
                  />

                  <InputBox
                    label={"Password"}
                    iname={"password"}
                    ivalue={user.password}
                    onChange={InputHandler}
                    placeholder={"••••••••"}
                  />

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
                        <a
                          className="font-medium hover:underline text-emerald-900"
                          href="#"
                        >
                          Terms and Conditions
                        </a>
                      </label>
                    </div>
                  </div>
                  <Button label={"Create an account"} onClick={SignupHandler} />
                  <WarningLink
                    label={"Already have an account?"}
                    buttonText={"Login"}
                    to={"/admin/login"}
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

export default AdminSignup;
