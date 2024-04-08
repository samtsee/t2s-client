import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { Container, Button, Alert } from "react-bootstrap";
import NavBar from '../components/NavBar';
import Answer from "./Answers";

function QuestionDetails() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [question, setQuestion] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function getQuestion() {
    currentUser.getIdToken()
      .then(async (token) => {
        // console.log(token);
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };
        await axios.get(
          `${process.env.REACT_APP_API_GATEWAY_URL}/question/${id}`,
          {
            headers: headers
          }
        ).then((response) => {
          const data = response.data.data;
          const questionData = {
            id: response.data.id,
            user: data.user,
            title: data.title,
            question: data.question,
            tags: data.tags
          };
          setQuestion(questionData);          
        }).catch((error) => {
          console.error("Error fetching question:", error.response.status, error.response.data);
          setError(error);
        });
      });
  };

  useEffect(() => {
    getQuestion();
  }, [id]);

  function handleDeleteQuestion(questionId) {
    // console.log(questionId)
    currentUser.getIdToken()
      .then(async (token) => {
        // console.log(token);
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };
        await axios.delete(
          `${process.env.REACT_APP_API_GATEWAY_URL}/question/${questionId}`,
          {
            headers: headers
          }
        ).then((response) => {
          console.log('Question deleted successfully');
          setQuestion({});
          navigate("/");
        }).catch((error) => {
          console.error("Error deleting question:", error.response.status, error.response.data);
        });
      })
      .catch((error) => {
        setError(error);
      });
  }


  return (
    <>
      <NavBar />

      {error && <Alert variant="danger">{error}</Alert>}

      <Container>
        <div>
          <p className="mt-3">Asked By: {question.user}</p>
          <h1>{question.title}</h1>
          <p className="text-sm">{question.question}</p>
          <div>
              {/* Display selected tags */}
              {question.tags && question.tags.map(tag => (
                <Button
                  key={tag}
                  variant="primary"
                  size="sm"
                  className="mr-2 mb-2 tag-button"
                >
                  {tag} 
                </Button>
              ))}
            </div>
        </div>
        <div>
          {question.user === currentUser.uid && (
            <Button variant="danger" onClick={() => handleDeleteQuestion(question.id)}>
              Delete
            </Button>
          )}
        </div>

      </Container>

      <Container>
        <Answer qid={id} />
      </Container>
    </>

  )

}

export default QuestionDetails;

