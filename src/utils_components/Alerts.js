import React from "react";
import {Alert} from "react-bootstrap";

export function ErrorAlert({children}){
  return <Alert variant="danger" className="p-1"
                style={{marginTop: 10, fontSize: "0.8rem"}}>{children}</Alert>
}
