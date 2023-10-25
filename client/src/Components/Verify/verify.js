import React, { useState, useEffect } from "react";
import basestyle from "../Base.module.css";
import verifystyle from "./verify.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { server } from "../../server";
import LoadingSpinner from "../Loading/LoadingSpinner";

const Verify = ({ updateUser }) => {
  const navigate = useNavigate();
  const [load , setLoad] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    secretToken : ""
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
    if (!values.secretToken) {
      error.secretToken = "Secret Token is required";
    }
    return error;
  };

  const verifyHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(user);
      setLoad(true)
      axios.post(`${server}/verify`, user).then((res) => {
        alert(res.data.message);
        if(res.data.ok === true ){
          updateUser(res.data.user); 
          navigate("/", { replace: true });
        }
        else{
          navigate("/verify",{replace:true});
        }
      }).finally(()=>{
        setLoad(false);
      })
    }
  }, [formErrors]);

  return (
    <>
      {load ? (
          <LoadingSpinner></LoadingSpinner>
        ) : (
        <div className={verifystyle.verify}>
          <form>
            <h1>Verify</h1>
            <input
              type="text"
              name="secretToken"
              id="secretToken"
              placeholder="secretToken"
              onChange={changeHandler}
              value={user.secretToken}
            />
            <p className={basestyle.error}>{formErrors.secretToken}</p>
            <button className={basestyle.button_common} onClick={verifyHandler}>
              Verify
            </button>
          </form>
          <div className="container"> 
            <div className="row">
              <NavLink className="centre" to="/signup"> Not yet Register ? Register Now</NavLink>
              <NavLink className="centre" to="/login"> Want to login ? login</NavLink>
            </div>
          </div>
          {/* <NavLink to="/log">Not yet registered? Register Now</NavLink> */}
        </div>
      )}
    </>
  );
};
export default Verify;
