import React, { useEffect, useState } from "react";
import { Button, Container, Col, Row, Alert, Card } from "react-bootstrap";
import NavBar from '../components/NavBar';
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function QuestionsAsked() {
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  function getAllQuestions() {
    currentUser.getIdToken()
      .then(async (token) => {
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
          const filteredQuestions = response.data.filter(question => question.user === currentUser.uid);
          setQuestions(filteredQuestions);
          console.log(response.data)
        }).catch((error) => {
          console.error("Error fetching questions:", error.response.status, error.response.data);
          setError(error.toString());
        });
      });
  }


  useEffect(() => {
    getAllQuestions();
  }, []);

  function askQuestion() {
    navigate("/ask-question");
  }

  // Styles
  const forumStyle = {
    marginTop: "20px",
  };

  const questionCardStyle = {
    marginBottom: "15px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "0.3s",
    borderRadius: "5px", // rounded corners
  };

  const questionTitleStyle = {
    color: "#007bff", // Bootstrap primary color
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "1.25rem",
  };

  const questionContentStyle = {
    color: "#333", // Darker text for readability
  };

  return (
    <>
      <NavBar />

      {error && <Alert variant="danger">{error}</Alert>}

      <Container style={forumStyle}>
        <Row>
          <Col>
            <h2 className="mb-4">Questions you have asked</h2>
          </Col>
        </Row>
        <Row>
          {questions.map((question, i) => (
            <Card key={i} style={questionCardStyle}>
              <Card.Body>
                <Link to={`/question/${question.id}`} style={questionTitleStyle}>
                  <Card.Title>{question.title}</Card.Title>
                </Link>
                <Card.Text style={questionContentStyle}>
                  {question.question}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default QuestionsAsked;
