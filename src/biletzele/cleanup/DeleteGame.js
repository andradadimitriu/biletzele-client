import Form from "react-bootstrap/Form";
import LoaderButton from "../../utils_components/LoaderButton";
import React, {useState} from "react";
import {deleteGame} from "../service/biletzele-service";
import {useParams} from "react-router-dom";

export default function DeleteGame(props) {
  let { gameId } = useParams();
  const [confirmGameId, setConfirmGameId] = useState("");
  const [done, setDone] = useState(undefined);
  const [error, setErr] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  function validateForm(){
    return confirmGameId === gameId;
  }

  async function handleDelete(){
    try {
      setIsLoading(true);
      await deleteGame(gameId);
      setDone(true);
      setIsLoading(false);
    }catch (e){
      setErr(e);
    }
  }

  function DeleteForm(){
    return <Form onSubmit={handleDelete}>
      <Form.Label>Confirm the game ID of the game you want to delete:</Form.Label>
      <Form.Group controlId="confirmGameId">
        <Form.Control
            autoFocus
            type="text"
            value={confirmGameId}
            onChange={(event)=>setConfirmGameId(event.target.value)}
        />
      </Form.Group>
      <LoaderButton
          variant="danger"
          block
          disabled={!validateForm()}
          type="submit"
          isLoading={isLoading}
      >
        Delete Game
      </LoaderButton>

    </Form>;
  }

  return  error ? <div>Could Not Delete</div> : (done ? <div>Game deleted</div> : <DeleteForm/>);
}


