import React from "react";
import { Link } from "react-router-dom";
import "../style.scss";

const Login = () => {
  return (
    <div className="container1">
      <div className="wrapper">
        <span className="logo">Chit Chat</span>
        <span className="title">LogIn</span>
        <form action="">
          <input type="email" id="email" placeholder="Email" />
          <input type="password" id="password" placeholder="Password" />

          <button>Log In</button>
        </form>
        <p>
          Don't have an account ? <Link to="/register">SignUp</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
