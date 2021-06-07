import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import LoaderButton from "../utils_components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import Button from "react-bootstrap/Button";
import {Alert} from "react-bootstrap";

export default function Confirm({email, password}) {
  const [fields, handleFieldChange] = useFormFields({
    confirmationCode: ""
  });
  const history = useHistory();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [emailResent, setEmailResent] = useState({resent: false, error: null});

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }
  async function resendEmail(){
    try {
      await Auth.resendSignUp(email);
      setEmailResent({resent: true, error: null})

    } catch (e) {
      setEmailResent({resent: false, error: e})
    }
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
          <p className="help-block"> Please check your email for the code.
            <Button variant="link" style={{margin:0, padding:0}} onClick={resendEmail}>Resend email</Button>
          </p>
          {emailResent.resent && <Alert variant="success" className="p-1" style={{fontSize: "0.8rem"}}>
            A new code has been sent to your email.
          </Alert>}
          {emailResent.error && <Alert variant="danger" className="p-1" style={{fontSize: "0.8rem"}}>
            Something went wrong when trying to resend code. Please try again.
          </Alert>}
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