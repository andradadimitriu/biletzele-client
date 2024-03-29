import React, {useEffect, useState} from "react";
import moment from "moment";
import "./timer.css";
import {COLOR_CODES} from "../utils/constants";
import { Storage } from "aws-amplify";

const FULL_DASH_ARRAY = 285;
const COUNTDOWN_SECONDS = 60;
const TIMER_UPDATE_PERIOD = 1000;
export default function Timer({startTime, setOutOfTime, content}) {
  const [sounds, setSounds]=useState(undefined);
  const [innerOutOfTime, setInnerOutOfTime] = useState(false);
  const [countDown, setCountDown] = useState(getCountDown(startTime));
  const [timerAnimationStarted, setTimerAnimationStarted] = useState(false);
  useEffect( () => {
    (async function getSounds() {
      const alarmSoundLink = await Storage.get("alarm.mp3");
      const stopWatchSoundLink = await Storage.get("stopwatch.mp3");
      const alarmSound = new Audio(alarmSoundLink);
      const stopWatchSound = new Audio(stopWatchSoundLink);
      setSounds({alarmSound,stopWatchSound});
  })();
  }, []);
  useEffect(() => {
    if(!startTime)
      return;
    function updateCountDown(){
        return setInterval(() => {
          if (countDown <= 0) {
            sounds.stopWatchSound.pause();
            sounds.alarmSound.play();
            setInnerOutOfTime(true);
          }
          else if(countDown <= COLOR_CODES.warning.threshold){
            sounds.stopWatchSound.play();
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

  }, [countDown, startTime, setOutOfTime, sounds], timerAnimationStarted);

  useEffect(() => {
    if(innerOutOfTime){
      setTimeout(()=>{
        sounds.alarmSound.pause();
        setOutOfTime(true);
      }, 2000);
    }
    return () => {
      //sometimes, if multiple actions are happening at the same time,
      // (e.g. pressing next a couple of times when the time expires)
      //the component is unmounted before it gets to stop the sounds
      if(sounds && innerOutOfTime){
        sounds.alarmSound.pause();
        sounds.stopWatchSound.pause();}}
  }, [innerOutOfTime, setOutOfTime, sounds]);

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
        />}
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