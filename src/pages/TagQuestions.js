import React, { useEffect, useState } from "react";
import { Button, Container, Col, Row, Alert } from "react-bootstrap";
import NavBar from '../components/NavBar';
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTags } from "../contexts/TagsContext";
import '../styles.css';


function TagQuestions() {
	const { tag } = useParams();
	const [error, setError] = useState("");
	const { currentUser } = useAuth();
	const [questions, setQuestions] = useState([]);
	const { setTags } = useTags();
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
		getAllQuestions();
	}, [])

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
					{questions.map((question, i) => (
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
					))}
				</Row>
				<hr />
			</Container>
		</>
	)
}

export default TagQuestions;