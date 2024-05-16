import { useState, useEffect, createContext } from "react";

const AuthContext = createContext();

const AuthProvider = (props) => {
  const [auth, setAuth] = useState({
    token: "",
  });

  // Function to parse cookies
  const parseCookies = () => {
    return document.cookie.split('; ').reduce((acc, cookie) => {
      const [name, value] = cookie.split('=');
      acc[name] = value;
      return acc;
    }, {});
  };

  useEffect(() => {
    // Retrieve token from cookies
    const cookies = parseCookies();
    const token = cookies.token; // Adjust the cookie name as needed
    
    // console.log(cookies)

    if (token) {
      setAuth({
        ...auth,
        token: token,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
