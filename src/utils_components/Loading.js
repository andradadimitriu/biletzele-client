import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./loaderButton.css";

export default function Loading({size}){
  return <FontAwesomeIcon  style={{margin: "0 10"}} icon='spinner' size={size || "6x"}  spin />;
}
