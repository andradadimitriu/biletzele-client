import React from "react";
import { Button } from "react-bootstrap";

import "./loaderButton.css";
import Loading from "./Loading";

export default function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <Button
      className={`LoaderButton ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loading size={"xs"}/>}
      {props.children}
    </Button>
  );
}