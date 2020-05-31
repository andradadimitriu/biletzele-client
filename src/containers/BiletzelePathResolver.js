import React from "react";
import {ToggleButton, ButtonGroup, ToggleButtonGroup} from "react-bootstrap";
import NewGame from "./NewGame";
import {Biletzele} from "./Biletzele";
import BiletzeleWrite from "./BiletzeleWrite";
import {useParams} from "react-router-dom";

export default function BiletzelePathResolver(){
  const params = useParams();
  return (params.gameId && params.teamName) ? <BiletzeleWrite/> : <Biletzele/>;
}