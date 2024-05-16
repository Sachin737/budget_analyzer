import { Link, useLocation, useNavigate } from "react-router-dom";
import { React, useContext, useEffect, useState } from "react";
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
        // saving user info using context api
        setAuth({
          user: data?.data?.user,
          token: data?.token,
        });
        
        // Saving data in a cookie
        document.cookie = `token=${data?.token}`;
        // console.log(data?.token);

        navigate(location.state || "/user");
      } else {
        // Handle unsuccessful login
      }
    } catch (err) {
      console.log(err);
      // Handle error
    }
  };

  useEffect(()=>{
    
  },[])

  return (
    <div className="container1">
      <div className="wrapper">
        <span className="logo">Budget Analyzer</span>
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
