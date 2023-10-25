import React, { useEffect, useState } from "react";
import basestyle from "../Base.module.css";
import registerstyle from "./Register.module.css";
import axios from "axios";
import { server } from "../../server";

import { useNavigate, NavLink } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.username) {
      error.username = "First Name is required";
    }
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "This is not a valid email format!";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 6) {
      error.password = "Password must be at least 6 characters";
    } else if (values.password.length > 15) {
      error.password = "Password cannot exceed more than 15 characters";
    }
    if (!values.password2) {
      error.password2 = "Confirm Password is required";
    } else if (values.password2 !== values.password) {
      error.password2 = "Confirm password and password should be same";
    }
    return error;
  };

  const signupHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(user);
      axios.post(`${server}/`, user).then((res) => {
        console.log("here" , res.data);
        if (res.data.valid === true) {
          alert(res.data.message);
          navigate("/verify", { replace: true });
        } else {
          alert(res.data.message);
        }
      })
      .catch((res)=>{
        console.log(res);
      })
    }
  }, [formErrors]);

  return (
    <>
      <div className={registerstyle.register}>
        <form>
          <h1>Create your account</h1>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="User Name"
            onChange={changeHandler}
            value={user.username}
          />
          <p className={basestyle.error}>{formErrors.username}</p>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={changeHandler}
            value={user.email}
          />
          <p className={basestyle.error}>{formErrors.email}</p>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={changeHandler}
            value={user.password}
          />
          <p className={basestyle.error}>{formErrors.password}</p>
          <input
            type="password"
            name="password2"
            id="password2"
            placeholder="Confirm Password"
            onChange={changeHandler}
            value={user.password2}
          />
          <p className={basestyle.error}>{formErrors.password2}</p>
          <button className={basestyle.button_common} onClick={signupHandler}>
            Register
          </button>
        </form>
        <div className="container">
          <div className="row">
            <NavLink className="centre" to="/login">
              Already registered? Login
            </NavLink>
            <NavLink className="centre" to="/verify">
              {" "}
              Want to verify your mail ? Verify{" "}
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;
