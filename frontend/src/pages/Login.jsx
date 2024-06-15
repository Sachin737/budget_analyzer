import { Link, useLocation, useNavigate } from "react-router-dom";
import { React, useContext, useEffect, useState } from "react";
import axios from "axios";
import "../style.scss";
import { AuthContext } from "../Context/auth";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useContext(AuthContext);

  const formSubmitHandler = async (e) => {
    e.preventDefault(); // to avoid default page refresh in js
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/users/login`,
        { email, password }
      );

      if (data?.status) {
        // saving user info using context api
        setAuth({
          user: data?.data?.user,
          token: data?.token,
        });

        // Saving data in a cookie
        document.cookie = `token=${data?.token}; path=/; domain=${window.location.hostname};`;
        // console.log(data?.token);

        toast.success("Login successfully");
        navigate(location.state || "/user");
      } else {
        // Handle unsuccessful login
        toast.error("Email or password is incorrect");
      }
    } catch (err) {
      // Handle error
      toast.error("Email or password is incorrect");
    }
  };

  const parseCookies = () => {
    return document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[decodeURIComponent(key)] = decodeURIComponent(value);
      return acc;
    }, {});
  };

  useEffect(() => {
    const cookie = parseCookies();

    if (cookie.token) {
      navigate("/user");
    }
  }, []);

  return (
    <div className="container1">
      <div className="wrapper">
        <span className="logo">Budget Planner</span>
        <span className="title">LogIn</span>
        <form action="">
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={formSubmitHandler}>Log In</button>
        </form>
        <p>
          Don't have an account ?{" "}
          <Link className="text-black" to="/register">
            SignUp
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
