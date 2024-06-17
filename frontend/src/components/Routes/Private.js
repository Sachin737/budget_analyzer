import React, { useEffect } from "react";

import { AuthContext } from "../../Context/auth";
import { useContext, useState } from "react";
import axios from "axios";
import { Link, Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = () => {
  const [auth] = useContext(AuthContext);
  const [ok, setOk] = useState(false);
  const navigate = useNavigate();

  // //console.log(auth.user);
  const parseCookies = () => {
    return document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[decodeURIComponent(key)] = decodeURIComponent(value);
      return acc;
    }, {});
  };

  useEffect(() => {

    const cookie = parseCookies();

    const checkUser = async () => {

      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/users/user-auth`,
        {
          headers: {
            authorization: `Bearer ${cookie.token}`,
          }
        }
      );

      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };

    if (auth?.token) {
      checkUser();
    }
  }, [auth?.token]);
  return ok ? <Outlet /> : <div className="container1">
    <div className="wrapper">
      <span className="logo">Budget Analyzer</span>
      <button onClick={() => { navigate("/") }}>
        Login Please
      </button>
    </div>
  </div>;
};



export default PrivateRoute;