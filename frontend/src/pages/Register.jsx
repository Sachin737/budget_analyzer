import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import zxcvbn from "zxcvbn";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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

    return errors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
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
        toast.success("Signed up successfully");
        navigate("/");
      } catch (error) {
        toast.error("server error");
      } finally {
        setIsSigningUp(false);
      }
    } else {
      if (errors.emptyFields) {
        toast.error("Empty fields");
      }
      if (errors.passwordMismatch) {
        toast.error("password don't match");
      }
      if (errors.invalidEmail) {
        toast.error("invalid email address");
      }
      if (errors.weakPassword) {
        toast.error("password is weak");
      }
    }
  };

  return (
    <div className="container1">
      <div className="wrapper">
        <span className="logo">Budget Planner</span>
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

          <button onClick={handleSignUp} disabled={isSigningUp}>
            {isSigningUp ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p>
          Already Registered ? <Link className="text-black" to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
