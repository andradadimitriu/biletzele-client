import React, { useState, useEffect } from "react";
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
// import { fas } from '@fortawesome/free-brands-svg-icons';
import { faSpinner} from '@fortawesome/free-solid-svg-icons';

library.add( faSpinner);

function App() {
    const history = useHistory();

  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  useEffect(() => {
    onLoad();
  }, []);

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
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#pricing">Pricing</Nav.Link>
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
        <Routes />
      </AppContext.Provider>
    </>
  )
);
}

export default App;