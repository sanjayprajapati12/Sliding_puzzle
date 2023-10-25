import "./App.css";
import Profile from "./Components/Profile/Profile";
import Login from "./Components/Login/Login";
import Verify from "./Components/Verify/verify";
import Register from "./Components/Register/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css'

function App() {
  const [userstate, setUserState] = useState({});

  useEffect(()=>{
    console.log(userstate);
    setUserState(JSON.parse(localStorage.getItem("MyUser")));
    return ()=>{}
  },[])

  const updateUser = (user) =>{
    localStorage.setItem("MyUser" , JSON.stringify(user));
    setUserState(user);
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              userstate && userstate.username ? (
                <Profile
                  updateUser={updateUser}
                  user={userstate}
                />
              ) : (
                <Login updateUser={updateUser} />
              )
            }
          ></Route>
          <Route
            path="/login"
            element={<Login updateUser={updateUser} />}
          ></Route>
          <Route
            path="/verify"
            element={<Verify updateUser={updateUser} />}
          ></Route>
          <Route path="/signup" element={<Register />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
