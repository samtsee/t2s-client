import React, { useEffect, useState } from "react";
import { Button, Container, Col, Row, Alert } from "react-bootstrap";
import NavBar from '../components/NavBar';
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import '../styles.css';


function TagQuestions() {
	const { tag } = useParams();
	const [error, setError] = useState("");
	const { currentUser } = useAuth();
	const [questions, setQuestions] = useState([]);
	const navigate = useNavigate();

	function getTagQuestions() {
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
					const formattedQuestions = response.data.map(question => ({
						...question.data,
						id: question.id
					}));
					const filteredQuestions = formattedQuestions.filter(question => question.tags.includes(tag));
					setQuestions(filteredQuestions);
				}).catch((error) => {
					console.error("Error fetching questions:", error.response.status, error.response.data);
					setError(error)
				});
			});
	}

	useEffect(() => {
		getTagQuestions();
	}, [tag]); // Re-run effect whenever tag changes

	function askQuestion() {
		navigate("/ask-question");
	}

	function goToTaggedQuestions(tag) {
		navigate(`/questions/tagged/${tag}`);
	}

	return (
		<>
			<NavBar />

			{error && <Alert variant="danger">{error.message}</Alert>}

			<Container>
				<Row>
					<Col>
						<h2 className="mb-4">Questions Tagged [{tag}]</h2>
					</Col>
					<Col className="d-flex justify-content-end">
						<Button className="mt-3 py-2" onClick={askQuestion}>
							Ask Question
						</Button>
					</Col>
				</Row>
			</Container>

			<Container>
				<hr />
				<Row>
					{questions.length > 0 ? (
						// Render questions if the array is not empty
						questions.map((question, i) => (
							<div key={i}>
								<Link to={`/question/${question.id}`} className="link-no-underline">
									<h4>{question.title}</h4>
								</Link>
								<p>{question.question}</p>
								<div>
									{/* Display selected tags */}
									{question.tags.map(tag => (
										<Button
											key={tag}
											variant="primary"
											size="sm"
											className="mr-2 mb-2 tag-button"
											onClick={() => goToTaggedQuestions(tag)}
										>
											{tag}
										</Button>
									))}
								</div>
								{i !== questions.length - 1 && <hr />}
							</div>
						))
					) : (
						// Render a message if the array is empty
						<p>No results for [{tag}].</p>
					)}
				</Row>
				<hr />
			</Container>
		</>
	)
}

export default TagQuestions;