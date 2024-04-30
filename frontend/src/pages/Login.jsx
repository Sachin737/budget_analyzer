import { Link, useLocation, useNavigate } from "react-router-dom";
import { React, useContext, useState } from "react";
import axios from "axios";
import "../style.scss";
import { AuthContext } from "../Context/auth";

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
        // setTimeout(() => {
        //   toast.success(data?.message);
        // }, 500);

        // saving user info using context api

        setAuth({
          user: data?.data?.user,
          token: data?.token,
        });

        // console.log(data?.data);

        // saving data in local storage
        localStorage.setItem("auth", JSON.stringify(data));

        navigate(location.state || "/user");
      } else {
        // toast.error(data?.message);
      }
    } catch (err) {
      console.log(err);
      // toast.error("Something went wrong!");
    }
  };

  return (
    <div className="container1">
      <div className="wrapper">
        <span className="logo">Chit Chat</span>
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
          Don't have an account ? <Link to="/register">SignUp</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
