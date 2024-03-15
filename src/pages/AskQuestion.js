import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import axios from 'axios';


function AskQuestion() {
  const { currentUser } = useAuth();
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    // console.log(descriptionRef.current.value)

    currentUser.getIdToken()
      .then(async (token) => {
        // console.log(token);
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        await axios.post(
          `${process.env.REACT_APP_API_GATEWAY_URL}/question`,
          {
            user: currentUser.uid,
            title: titleRef.current.value,
            question: descriptionRef.current.value
          },
          {
            headers: headers
          }
        ).then((response) => {
          console.log("Question post success:", response.data);
          navigate("/");
        }).catch((error) => {
          console.error("Error posting question:", error.response.status, error.response.data);
          setError(error);
        });
      })
      .catch((error) => {
        setError(error);
      });

    setLoading(false);
  }


  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Ask a Question</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group id="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="title" ref={titleRef} required />
            </Form.Group>

            <Form.Group id="description">
              <Form.Label>Description</Form.Label>
              <Form.Control type="description" as="textarea" rows={5} ref={descriptionRef} required />
            </Form.Group>

            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Post
            </Button>

            <Link to="/">
              <Button disabled={loading} className="w-100 mt-2" variant="secondary">
                Cancel
              </Button>
            </Link>
          </Form>

        </Card.Body>
      </Card>
    </>
  )
}

export default AskQuestion;
