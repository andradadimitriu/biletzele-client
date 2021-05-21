import React, {useEffect, useState} from "react";
import moment from "moment";
const COUNTDOWN_SECONDS = 60;
const TIMER_UPDATE_PERIOD = 1000;
export default function Timer({startTime, outOfTime, setOutOfTime}) {
  const [countDown, setCountDown] = useState(getCountDown(startTime));
  useEffect(() => {
    function updateCountDown(){
      if(!outOfTime) {
        return setInterval(() => {
          if (countDown <= 0) {
            setOutOfTime(true);
          }
          setCountDown(getCountDown(startTime));
        }, TIMER_UPDATE_PERIOD);
      }
    }
    const intervalId = updateCountDown();
    return () => clearInterval(intervalId);

  }, [countDown, startTime, outOfTime, setOutOfTime]);

  return <React.Fragment> {countDown}</React.Fragment>;
}

export function getCountDown(startTime){
  const countDown = COUNTDOWN_SECONDS - Math.round(moment.duration(moment.utc().diff(startTime)).asSeconds());
  return Math.max(countDown, 0);
}