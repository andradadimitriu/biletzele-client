import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import LoaderButton from "../utils_components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./Signup.css";

export default function Confirm({email, password}) {
  const [fields, handleFieldChange] = useFormFields({
    confirmationCode: ""
  });
  const history = useHistory();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleConfirmationSubmit(event) {
      event.preventDefault();

      setIsLoading(true);

      try {
        await Auth.confirmSignUp(email, fields.confirmationCode);
        if(password) {
          await Auth.signIn(email, password);
          userHasAuthenticated(true);
        }
        else history.push("/login");

      } catch (e) {
        onError(e);
        setIsLoading(false);
      }
  }

  return (
    <div className="Signup">
      <Form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode">
          <Form.Label>Confirmation Code</Form.Label>

          <Form.Control
              autoFocus
              type="tel"
              value={fields.confirmationCode}
              onChange={handleFieldChange}
          />
          <p className="help-block"> Please check your email for the code.</p>
        </Form.Group>

        <LoaderButton
            block
            type="submit"
            isLoading={isLoading}
            disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>

      </Form>
    </div>
  );
}