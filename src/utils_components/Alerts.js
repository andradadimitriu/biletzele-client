import React from "react";
import {Alert} from "react-bootstrap";

export default function Alert({children, type}){
  return <Alert variant={type} className="p-1"
                style={{marginTop: 10, fontSize: "0.8rem"}}>{children}</Alert>
}