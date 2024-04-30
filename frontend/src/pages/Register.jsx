import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import zxcvbn from "zxcvbn";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({});
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({}); // Clear any previous errors
  };

  const validateForm = () => {
    const errors = {};

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.passwordConfirm
    ) {
      errors.emptyFields = true;
    }

    if (formData.password !== formData.passwordConfirm) {
      errors.passwordMismatch = true;
    }

    if (!validator.isEmail(formData.email)) {
      errors.invalidEmail = true;
    }

    // Password strength validation using zxcvbn
    const passwordStrength = zxcvbn(formData.password);
    if (passwordStrength.score < 3) {
      errors.weakPassword = true;
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      try {
        setIsSigningUp(true);

        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/users/signup`,
          formData
        );
        
        // console.log(data);
        // Optionally, you can reset the form after successful signup
        setFormData({
          name: "",
          email: "",
          password: "",
          passwordConfirm: "",
        });
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsSigningUp(false);
      }
    }
  };

  return (
    <div className="container1">
      <div className="wrapper">
        <span className="logo">Chit Chat</span>
        <span className="title">Register</span>
        <form>
          <input
            type="text"
            id="name"
            placeholder="Display name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            id="passwordConfirm"
            placeholder="Confirm Password"
            value={formData.passwordConfirm}
            onChange={handleChange}
          />
          {errors.emptyFields && (
            <p className="error">All fields are required.</p>
          )}
          {errors.passwordMismatch && (
            <p className="error">Passwords don't match.</p>
          )}
          {errors.invalidEmail && (
            <p className="error">Invalid email address.</p>
          )}
          {errors.weakPassword && (
            <p className="error">Password is too weak.</p>
          )}
          <button onClick={handleSignUp} disabled={isSigningUp}>
            {isSigningUp ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p>
          Already Registered ? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
