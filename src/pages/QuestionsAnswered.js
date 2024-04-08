import React, { useEffect, useState } from "react";
import { Button, Container, Col, Row, Alert, Card } from "react-bootstrap";
import NavBar from '../components/NavBar';
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function QuestionsAnswered() {
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState([]);
//   const [questionsAnswered, setQuestionsAnswered] = useState([])
  const navigate = useNavigate();
  var questionsAnswered = []

  function getAllQuestions() {
    currentUser.getIdToken()
      .then(async (token) => {
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };
        await axios.get(
          `${process.env.REACT_APP_API_GATEWAY_URL}/questions`,
          { headers: headers }
        ).then((response) => {
          // Use map() to create an array of user IDs
          const userIds = response.data.map(question => question.id);
          // Use the Set constructor to remove duplicates, converting back to array
          const uniqueUserIds = Array.from(new Set(userIds));
          
          //console.log(uniqueUserIds); // For debugging: logs the array of unique user IDs
          // If you need to do something with these IDs (e.g., store in state), you can do so here
          getQuestionsWithUserAnswers(uniqueUserIds)
          getAnsweredQuestions();
  
        }).catch((error) => {
          console.error("Error fetching questions:");
          setError(error.toString());
        });
      });
  }

  function getQuestionsWithUserAnswers(qid) {
    qid.forEach(element => {
        getAnswers(element);
    });
    console.log(questionsAnswered)

  }

  async function getAnswers(qid) {
    currentUser.getIdToken()
        .then(async (token) => {
            // console.log(token);
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };
            await axios.get(
                `${process.env.REACT_APP_API_GATEWAY_URL}/answer/${qid}/all`,
                {
                    headers: headers
                }
            ).then((response) => {
                if (response.data.length !== 0) {
                    response.data.forEach(element => {
                        if (!questionsAnswered.includes(element.qid)) {
                            questionsAnswered.push(element.qid);
                        }
                    } 

                )}
                
            }).catch((error) => { 
                console.error("Error fetching answers:", error.response.status, error.response.data);
                setError(error);
            });
        });
    };
  
  function getAnsweredQuestions() {
    currentUser.getIdToken()
      .then(async (token) => {
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };
        await axios.get(
          `${process.env.REACT_APP_API_GATEWAY_URL}/questions`,
          { headers: headers }
        ).then((response) => {
          // Use map() to create an array of user IDs
          console.log("LOGGING")
          console.log(questionsAnswered)
          const userIds = response.data.filter(question => questionsAnswered.includes(question.id));
          console.log(userIds)
          setQuestions(userIds)
          // Use the Set constructor to remove duplicates, converting back to array
    
        }).catch((error) => {
          console.error("Error fetching questions:");
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
            <h2 className="mb-4">Questions you have answered</h2>
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

export default QuestionsAnswered;
