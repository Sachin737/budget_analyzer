import React from "react";
// import avatar from "../images/man.png";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="container1">
      <div className="wrapper" >
        <span className="logo">Chit Chat</span>
        <span className="title">Register</span>
        <form action="">
          <input type="text" id="name" placeholder="Display name" />
          <input type="email" id="email" placeholder="Email" />
          <input type="password" id="password" placeholder="Password" />

          <button>Sign Up</button>
        </form>
        <p>
          Already Registered ? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
