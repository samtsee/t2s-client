import React, { useRef, useState } from "react";
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase-config.js";
import {
  signInWithEmailAndPassword
} from "firebase/auth";


function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in:", user);
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
      });

    setLoading(false);
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
  
            {error && <Alert variant="danger">{error}</Alert>}
  
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} />
              </Form.Group>
  
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} />
              </Form.Group>
  
              <Button disabled={loading} className="w-100 mt-3" type="submit">
                Login
              </Button>
            </Form>
  
          </Card.Body>
        </Card>
  
        <div className="w-100 text-center mt-2">
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </Container>
  );
}

export default Login;
