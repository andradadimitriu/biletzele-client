import React, { useState } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./NewGame.css";

export default function NewGame() {
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    gameName: "",
    team1Name: "",
    team2Name: "",
  });

  function validateForm() {
    return fields.gameName.length > 0 && fields.game.length > 0 ;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {

    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="NewGame">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="gameName" bsSize="large">
          <ControlLabel>Game Name:</ControlLabel>
          <FormControl
            autoFocus
            type="gameName"
            value={fields.gameName}
            onChange={handleFieldChange}
          />
        </FormGroup>
                <FormGroup controlId="team1Name" bsSize="large">
                  <ControlLabel>Team 1 Name:</ControlLabel>
                  <FormControl
                    autoFocus
                    type="team1Name"
                    value={fields.team1Name}
                    onChange={handleFieldChange}
                  />
                </FormGroup>
                                <FormGroup controlId="team2Name" bsSize="large">
                                  <ControlLabel>Team 2 Name:</ControlLabel>
                                  <FormControl
                                    autoFocus
                                    type="team2Name"
                                    value={fields.team2Name}
                                    onChange={handleFieldChange}
                                  />
                                </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
      );
}
