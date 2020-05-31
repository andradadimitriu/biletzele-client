import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./Signup.css";

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });
  const history = useHistory();
  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }
    async function handleSubmit(event) {
      event.preventDefault();

      setIsLoading(true);

      try {
        const newUser = await Auth.signUp({
          username: fields.email,
          password: fields.password,
        });
        setIsLoading(false);
        setNewUser(newUser);
      } catch (e) {
        onError(e);
        setIsLoading(false);
      }
    }

    async function handleConfirmationSubmit(event) {
      event.preventDefault();

      setIsLoading(true);

      try {
        await Auth.confirmSignUp(fields.email, fields.confirmationCode);
        await Auth.signIn(fields.email, fields.password);

        userHasAuthenticated(true);
        history.push("/");
      } catch (e) {
        onError(e);
        setIsLoading(false);
      }
    }
  function renderConfirmationForm() {
    return (
        <Form onSubmit={handleConfirmationSubmit}>
          <Form.Group controlId="confirmationCode" bsSize="large">
            <Form.Label>Confirmation Code</Form.Label>

            <Form.Control
              autoFocus
              type="tel"
              value={fields.confirmationCode}
              onChange={handleFieldChange}
            />
            <p class="help-block"> Please check your email for the code.</p>
          </Form.Group>

        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>

        </Form>
    );
  }

  function renderForm() {
    return (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email" bsSize="large">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={fields.email}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="password" bsSize="large">
            <Form.Control
              value={fields.password}
              onChange={handleFieldChange}
              type="password"
            />
            </Form.Group>
            <Form.Group controlId="confirmPassword" bsSize="large">
            <Form.Control
              value={fields.confirmPassword}
              onChange={handleFieldChange}
              type="password"
            />
          </Form.Group>
          <LoaderButton
            block
            bsSize="large"
            disabled={!validateForm()}
            type="submit"
            isLoading={isLoading}
          >
            Signup
          </LoaderButton>

        </Form>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}