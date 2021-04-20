import React, { useState, useEffect, useRef } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import "./App.css";
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { onError } from "./libs/errorLib";
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner} from '@fortawesome/free-solid-svg-icons';
import config from './config';

library.add( faSpinner);

function App() {
    const history = useHistory();

  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

    const clientRef = useRef(null);
    const [waitingToReconnect, setWaitingToReconnect] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [gameId, setGameId] = useState(undefined);

    useEffect(() => {
        function addMessage(message) {
            setMessages([...messages, message]);
        }
        if (waitingToReconnect) {
            return;
        }

        // Only set up the websocket once
        if (!clientRef.current) {
            const client = new WebSocket(config.websocketHostname);
            clientRef.current = client;
            client.onerror = (e) => console.error(e);
            client.onopen = () => {
                setIsOpen(true);
                console.log('ws opened');
            };
            client.onclose = () => {
                if (clientRef.current) {
                    // Connection failed
                    console.log('ws closed by server');
                } else {
                    // Cleanup initiated from app side, can return here, to not attempt a reconnect
                    console.log('ws closed by app component unmount');
                    return;
                }

                if (waitingToReconnect) {
                    return;
                }
                setIsOpen(false);
                console.log('ws closed');
                setWaitingToReconnect(true);
                setTimeout(() => setWaitingToReconnect(null), 5000);
            };

            client.onmessage = message => {
                console.log('received message', message);
                addMessage(`received '${message.data}'`);
                debugger;
            };


            return () => {
                console.log('Cleanup');
                // Dereference, so it will set up next time
                clientRef.current = null;
                client.close();
            }
        }

    }, [waitingToReconnect, messages]);

    useEffect(() => {
        console.log("[gameId, isOpen]");
        //TODO should trigger a reconnect now if no clientRef?
        if(!gameId || !clientRef || !clientRef.current) return;
        if(isOpen) {
            clientRef.current.send(JSON.stringify({ action: "enterroom", data: gameId}));
        }
    }, [gameId, isOpen]);

  useEffect(() => {
    onLoad();
  }, []);

  function setAppLevelGameId(routeGameId){
      if(gameId) return;
      setGameId(routeGameId);
  }

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);      }
    }

    setIsAuthenticating(false);
  }
    async function handleLogout() {
      await Auth.signOut();

      userHasAuthenticated(false);
      history.push("/login");
    }
return (
  !isAuthenticating && (
    <>
        <div className="bar">
            <Navbar bg="light" variant="light">
              <Navbar.Brand href="#home">Biletzele</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="/biletzele">Home</Nav.Link>
              </Nav>
              <Nav className="justify-content-end">
                {isAuthenticated ? (
                              <>
                                <Nav.Item onClick={handleLogout}>Logout</Nav.Item>
                              </>
                            ) : (
                              <>
                                <Nav.Link href="/signup">Signup</Nav.Link>
                                <Nav.Link href="/login">Login</Nav.Link>
                              </>
                            )}
              </Nav>
            </Navbar>
      </div>
      <AppContext.Provider
        value={{ isAuthenticated, userHasAuthenticated }}
      >
        <Routes setAppLevelGameId={setAppLevelGameId} websocket={clientRef.current}/>
          <div>
              <h1>Websocket {isOpen ? 'Connected' : 'Disconnected'}</h1>
              {clientRef && clientRef.current && <h1>Websocket {clientRef.current.readyState === WebSocket.OPEN ? 'Connected' : 'Disconnected'}</h1>}
              {waitingToReconnect && <p>Reconnecting momentarily...</p>}
              {messages.map(m => <p>{JSON.stringify(m, null, 2)}</p>)}
          </div>
      </AppContext.Provider>
    </>
  )
);
}

export default App;