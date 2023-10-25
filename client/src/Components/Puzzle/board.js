import React, { useEffect , useState } from "react";
import Tile from "./tile";
import { TILE_COUNT, GRID_SIZE, BOARD_SIZE } from "./constants"
import { canSwap, shuffle, swap, isSolved } from "./helpers"
import basestyle from "../Base.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { server } from "../../server";
import basic from "./basic.css"

function Board(props){

  const user = props.user;
  const imgUrl = props.imgUrl

  const navigate = useNavigate();
  const [tiles, setTiles] = useState([...Array(TILE_COUNT).keys()]);
  const [isStarted, setIsStarted] = useState(false);
  const [hasWon , setHasWon] = useState(false);
  // timer
  const [time, setTime] = useState(0);
  const [reset, setReset] = useState(false);
  
  useEffect(() => {
    if(isStarted===true){
      setHasWon(isSolved(tiles));
    }
    if(hasWon === true && isStarted === true) {
      user.time = time ;  
      console.log(time);
      axios.post(`${server}/addtime`, user).then((res) => {
        if (res.data.ok === true) {
          alert("Congratulations , You win !");
          setIsStarted(false);
          navigate("/", { replace: true });
        } 
      }).finally(()=>{
        setIsStarted(false)
        setTime(0)
        setHasWon(false)
      })
    }
  }, [time,tiles,isStarted]);
  
  useEffect(() => {
    if (isStarted) {
      let startTime = null;
      let animationFrameId;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;
        setTime(Math.floor(elapsedTime / 1000)); // Update time in seconds

        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [reset , isStarted, setTime]);

  const formatTime = (seconds) => {
     const hours = Math.floor(seconds / 3600);
     const minutes = Math.floor((seconds % 3600) / 60);
     const remainingSeconds = seconds % 60;
     const hoursStr = hours.toString().padStart(2, '0');
     const minutesStr = minutes.toString().padStart(2, '0');
     const secondsStr = remainingSeconds.toString().padStart(2, '0');
     return `${hoursStr}:${minutesStr}:${secondsStr}`;
    }
    
    const handleReset = () => {
      setTime(0);
      setReset(prevReset => !prevReset);
    }
    
    const shuffleTiles = () => {
      const shuffledTiles = shuffle(tiles)
      setTiles(shuffledTiles);
    }
    
    const swapTiles = (tileIndex) => {
      if (canSwap(tileIndex, tiles.indexOf(tiles.length - 1))) {
        const swappedTiles = swap(tiles, tileIndex, tiles.indexOf(tiles.length - 1))
        setTiles(swappedTiles)
      }
    }
    
    const handleTileClick = (index) => {
      swapTiles(index)
    }
    
    const handleShuffleClick = () => {
        shuffleTiles()
      handleReset();
    }
  
  const handleStartClick = () => {
    shuffleTiles()
    handleReset();
    setIsStarted(true)
  }
  
  const pieceWidth = Math.round(BOARD_SIZE / GRID_SIZE);
  const pieceHeight = Math.round(BOARD_SIZE / GRID_SIZE);
  const style = {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
  };

  return (
    <> 
      <h1>Time :- {formatTime(time)}</h1>
      <div className="main">
        <div className="preview">
            <img src={imgUrl}></img>
        </div>
        <div style={style} className="board">
          {tiles.map((tile, index) => (
            <Tile
              key={tile}
              index={index}
              imgUrl={imgUrl}
              tile={tile}
              width={pieceWidth}
              height={pieceHeight}
              handleTileClick={handleTileClick}
            />
          ))}
        </div>

      </div>
      
      {/* {hasWon && isStarted && <div>Puzzle solved 🧠 🎉🎉🎉🎉</div> && console.log("s")} */}
      {/* {hasWon && store_score} */}

      {!isStarted ?
        (<button className={basestyle.button_common_start} onClick={() => handleStartClick()}>Start game</button>) :
        (<button className={basestyle.button_common_start} onClick={() => handleShuffleClick()}>Restart game</button>)}
    </> 
  );
}

export default Board;