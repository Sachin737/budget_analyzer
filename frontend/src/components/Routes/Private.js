import React, { useEffect } from "react";

import { AuthContext } from "../../Context/auth";
import { useContext, useState } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const [auth] = useContext(AuthContext);
  const [ok, setOk] = useState(false);

  // //console.log(auth.user);

  useEffect(() => {
    const checkUser = async () => {
     
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/user-auth`,
        {
          headers: {
            authorization: auth?.token,
          },
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
  return ok ? <Outlet /> : <div></div>;
};

export default PrivateRoute;