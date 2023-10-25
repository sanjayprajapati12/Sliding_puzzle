import React, { useState, useEffect } from "react";
import basestyle from "../Base.module.css";
import loginstyle from "./Login.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { server } from "../../server.js";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import LoadingSpinner from "../Loading/LoadingSpinner";

const Login = ({ updateUser }) => {
  const [load , setLoad] = useState(false);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
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
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "Please enter a valid email address";
    }
    if (!values.password) {
      error.password = "Password is required";
    }
    return error;
  };

  const loginHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(user);
      setLoad(true);
      axios.post(`${server}/login`, user).then((res) => {
        alert(res.data.message);
        if (res.data.ok === true) {
          updateUser(res.data.user); 
          navigate("/", { replace: true });
        }
      })
      .finally(()=>{
        setLoad(false);
      })
    }
  }, [formErrors]);

  return (
    <>
    {load ? (
          <LoadingSpinner></LoadingSpinner>
        ) : (
          <div className={loginstyle.login}>
            <form>
              <h1>Login</h1>
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
              <button className={basestyle.button_common} onClick={loginHandler}>
                Login
              </button>
            </form>
            <div className="container"> 
              <div className="row">
                <NavLink className="centre" to="/signup"> Not yet Register ? Register Now</NavLink>
                <NavLink className="centre" to="/verify"> Want to verify your mail ? Verify Now</NavLink>
              </div>
            </div>
          </div>
      )}
    </>
  );
};
export default Login;
