import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./LoaderButton.css";

export default function Loading(){
  return <div style={{margin: 20, alignSelf:"center", display: "flex", justifyContent: "center"}}>
    <FontAwesomeIcon icon='spinner' size="6x"  spin />
  </div>
}