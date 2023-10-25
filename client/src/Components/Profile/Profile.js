import React from "react";
import basestyle from "../Base.module.css";
import Board from "../Puzzle/board";
import { useEffect, useState } from "react";
import { updateURLParameter } from "../Puzzle/helpers";
// import classnames from 'classnames';
import axios from "axios";
import LoadingSpinner from "../Loading/LoadingSpinner";

import { server } from "../../server";

const Profile = ({ updateUser, user }) => {
  const [imgUrl, setImgUrl] = useState("");
  const [bestTime, setBestTime] = useState(0);
  const [loading , setLoading ] = useState(false);

  useEffect(() => {
    axios
      .get(`${server}/gettime`, {
        params: {
          email: user.email,
          active: user.active,
        },
      })
      .then((res) => {
        const temp = res.data.time;
        temp.sort((a, b) => a - b);
        console.log(temp);
        setBestTime(temp[0]);
      });

      const temp = async ()=> {
        setLoading(true)
        const response = await fetch("https://picsum.photos/500/500")
        await setImgUrl(response.url)
        setLoading(false)
        // fetch("https://picsum.photos/500/500")
        //   .then((response) => setImgUrl(response.url))
        //   .then(setLoading(false))
        //   .catch((error) => console.error(error));
      }
      temp()
  }, []);



  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const hoursStr = hours.toString().padStart(2, "0");
    const minutesStr = minutes.toString().padStart(2, "0");
    const secondsStr = remainingSeconds.toString().padStart(2, "0");
    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  };

  return (
    <>
      <div className={basestyle.navbar}>
        <h1 className={basestyle.navbar_username}>Hi {user.username} !</h1>
        <h1 className={basestyle.navbar_best_score}>
          Best Time : {formatTime(bestTime)}
        </h1>
        <button
          className={basestyle.navbar_logout}
          onClick={() => updateUser({})}
        >
          Logout
        </button>
      </div>
      
      <div>
        {loading ? (
          <LoadingSpinner></LoadingSpinner>
        ) : (
          <Board user={user} imgUrl = {imgUrl} />
        )}
      </div>

      {/* if(imgUrl===""){
        <LoadingSpinner></LoadingSpinner>
      }
      else{
        <Board user={user} imgUrl = {imgUrl} />
      } */}

      {/* <input value={imgUrl} onChange={handleImageChange} /> */}
    </>
  );
};

export default Profile;
