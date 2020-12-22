import React, { useState } from "react";
import { Auth } from "aws-amplify";
import Form from 'react-bootstrap/Form';
import LoaderButton from "../utils_components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "../biletzele/game_room/Forms.css";

export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="center-form">
      <Form onSubmit={handleSubmit}>
        <Form.Label>Email</Form.Label>
        <Form.Group controlId="email">
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Group controlId="password">
          <Form.Control
            value={fields.password}
            onChange={handleFieldChange}
            type="password"
          />
        </Form.Group>
        <LoaderButton
          block
          bsSize="large"
          type="submit"
          disabled={!validateForm()}
          isLoading={isLoading}
        >
          Login
        </LoaderButton>

      </Form>
    </div>
  );
}