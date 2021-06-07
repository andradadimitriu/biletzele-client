import React, { useState } from "react";
import { Auth } from "aws-amplify";
import Form from 'react-bootstrap/Form';
import LoaderButton from "../utils_components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import Confirm from './Confirm';

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [newUser, setNewUser] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
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
        if(e.code === "UsernameExistsException"){
          setUserExists(true);
        }
        setIsLoading(false);
      }
    }

  function renderForm() {
    return (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={fields.email}
              onChange={handleFieldChange}
            />
            {userExists && <Form.Text className="text-danger">User already exists.</Form.Text>}
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={fields.password}
              onChange={handleFieldChange}
              type="password"
            />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
              value={fields.confirmPassword}
              onChange={handleFieldChange}
              type="password"
            />
          </Form.Group>
          <LoaderButton
            block
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
    <div className="Signup center-form">
      {newUser === null ? renderForm() : <Confirm email={fields.email} password={fields.password}/>}
    </div>
  );
}