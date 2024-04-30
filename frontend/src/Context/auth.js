import { useState, useEffect, createContext } from "react";

const AuthContext = createContext();

const AuthProvider = (props) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  //   whenever we refresh page auth will get set to
  //   it value again by using local storage
  // Else if we dont do this then : it will be stored only
  // in local storage but not in out auth context
  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("auth"));
    // //console.log(data?.token, "adfa");

    if (data?.success) {
      setAuth({
        ...auth,
        user: data.user,
        token: data.token,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {props.children}
    </AuthContext.Provider>
  );
};

// const useAuth = () => {
//   useContext(AuthContext);
// };

export { AuthContext, AuthProvider };