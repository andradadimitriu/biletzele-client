import React, {useEffect, useState} from "react";
import moment from "moment";
import "./timer.css";
import {COLOR_CODES} from "../utils/constants";

const FULL_DASH_ARRAY = 285;
const COUNTDOWN_SECONDS = 60;
const TIMER_UPDATE_PERIOD = 1000;
export default function Timer({startTime, setOutOfTime, content}) {
  const [innerOutOfTime, setInnerOutOfTime] = useState(false);
  const [countDown, setCountDown] = useState(getCountDown(startTime));
  const [timerAnimationStarted, setTimerAnimationStarted] = useState(false);
  useEffect(() => {
    if(!startTime)
      return;
    function updateCountDown(){
        return setInterval(() => {
          if (countDown <= 0) {
            setInnerOutOfTime(true);
          }
          setCountDown(getCountDown(startTime));
        }, TIMER_UPDATE_PERIOD);
    }
    const intervalId = updateCountDown();
    setTimeout(()=>
    {
      setTimerAnimationStarted(true);
    }, 200);
    return () => clearInterval(intervalId);

  }, [countDown, startTime, setOutOfTime], timerAnimationStarted);

  useEffect(() => {
    if(innerOutOfTime){
      setTimeout(()=>{
        setOutOfTime(true);
      }, 2000);
    }
  }, [innerOutOfTime, setOutOfTime]);

    function calculateTimeFraction() {
      if(innerOutOfTime){
        return 1;
      }
      const timeFraction = countDown/ COUNTDOWN_SECONDS;
      // const smoothedTimeFraction =  timeFraction - (1 / COUNTDOWN_SECONDS) * (1 - timeFraction);

      return startTime ? timeFraction : 0;
  }

  function decideColor() {
    if(!startTime){
      return "";
    }
    if(innerOutOfTime){
      return COLOR_CODES.alert.color;
    }
    return countDown <= COLOR_CODES.warning.threshold ? COLOR_CODES.warning.color : COLOR_CODES.info.color;
  }

  return <div className="base-timer">
    <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g className="base-timer__circle">
        <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45"/>
        {startTime && <path
            strokeDasharray={`${(
            calculateTimeFraction() * FULL_DASH_ARRAY
        ).toFixed(0)} 283`}
            className={`base-timer__path-remaining ${decideColor()} ${(timerAnimationStarted && !innerOutOfTime) ? "path-remaining-transition": ""}`}
            d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
        ></path>}
      </g>
    </svg>
    <span id="base-timer-label" className="base-timer__label">
      {innerOutOfTime ? <span>Out of time!</span> : content}
  </span>
  </div>;
}

export function getCountDown(startTime){
  const countDown = COUNTDOWN_SECONDS - Math.round(moment.duration(moment.utc().diff(startTime)).asSeconds());
  return Math.max(countDown, 0);
}