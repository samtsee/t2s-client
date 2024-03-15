import React, { useEffect, useState } from "react";
import { Button, Container, Col, Row, Alert } from "react-bootstrap";
import NavBar from '../components/NavBar';
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";


function Questions() {
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  function getAllQuestions() {
    currentUser.getIdToken()
      .then(async (token) => {
        // console.log(token);
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };
        await axios.get(
          `${process.env.REACT_APP_API_GATEWAY_URL}/questions`,
          {
            headers: headers
          }
        ).then((response) => {
          // console.log("User post success:", response.data);
          setQuestions(response.data);
        }).catch((error) => {
          console.error("Error fetching questions:", error.response.status, error.response.data);
          setError(error)
        });
      });

  }

  useEffect(() => {
    getAllQuestions();
  }, [])

  function askQuestion() {
    navigate("/ask-question");
  }

  return (
    <>
      <NavBar />

      {error && <Alert variant="danger">{error}</Alert>}

      <Container>
        <Row>
          <Col>
            <h2 className="mb-4">All Questions</h2>
          </Col>
          <Col className="d-flex justify-content-end">
            <Button className="mt-3 py-2" onClick={askQuestion}>
              Ask Question
            </Button>
          </Col>
        </Row>
      </Container>

      <Container>
        {questions.map((question, i) => (
          <div key={i}>
            <Link to={`/question/${question.id}`}>
              <h3>{question.title}</h3>
            </Link>
            <p>{question.question}</p>
          </div>
        ))}
      </Container>
    </>
  )
}

export default Questions;
