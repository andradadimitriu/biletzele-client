import React, { useState } from "react";
import LoginForm from "./LoginForm"
import "../biletzele/game_room/forms.css";
import Confirm from "./Confirm";

export default function Login() {
  const [userUnconfirmed, setUserUnconfirmed] = useState(false);
  const [authDetails, setAuthDetails] = useState(undefined);

  return (
    <div className="center-form">
      {userUnconfirmed ? <Confirm email={authDetails.email} password={authDetails.password}/>:<LoginForm setAuthDetails={setAuthDetails} setUserUnconfirmed={setUserUnconfirmed}/>}
    </div>
  );
}
