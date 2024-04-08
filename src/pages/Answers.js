// import React, { useState, useEffect } from "react"
// import { Form, Button, Card, Alert, Container, Row } from "react-bootstrap";
// import { useAuth } from "../contexts/AuthContext";
// import axios from "axios";

// function Answer(props) {
// 	const { currentUser } = useAuth();
// 	const [answers, setAnswers] = useState([]);
// 	const [answer, setAnswer] = useState("");
// 	const [userName, setUserName] = useState("");
// 	const [error, setError] = useState("");
// 	const [loading, setLoading] = useState(false);
// 	const { qid } = props;

// 	function getDateTime(nanosec, sec) {
// 		const time = {
// 			nanoseconds: nanosec,
// 			seconds: sec
// 		}

// 		const fireBaseTime = new Date(
// 			time.seconds * 1000 + time.nanoseconds / 1000000,
// 		);
// 		const date = fireBaseTime.toDateString();
// 		const atTime = fireBaseTime.toLocaleTimeString();

// 		return `${date} ${atTime}`
// 	}

// 	async function getName(uid) {
// 		currentUser.getIdToken()
// 			.then(async (token) => {
// 				// console.log(token);
// 				const headers = {
// 					"Content-Type": "application/json",
// 					"Authorization": `Bearer ${token}`
// 				};
// 				await axios.get(
// 					`${process.env.REACT_APP_API_GATEWAY_URL}/user/${uid}`,
// 					{
// 						headers: headers
// 					}
// 				).then((response) => {
// 						console.log(response.data.firstName)
// 						return response.data.firstName
// 				}).catch((error) => {
// 					console.error("Error fetching answers:", error.response.status, error.response.data);
// 					setError(error);
// 				});
// 			});
// 	};

// 	async function getAnswers() {
// 		currentUser.getIdToken()
// 			.then(async (token) => {
// 				// console.log(token);
// 				const headers = {
// 					"Content-Type": "application/json",
// 					"Authorization": `Bearer ${token}`
// 				};
// 				await axios.get(
// 					`${process.env.REACT_APP_API_GATEWAY_URL}/answer/${qid}/all`,
// 					{
// 						headers: headers
// 					}
// 				).then((response) => {
// 					const formattedAnswers = response.data.map(answer => ({
// 						...answer.data,
// 						date: getDateTime(answer.data.answered_at._nanoseconds, answer.data.answered_at._seconds), // Convert date to JavaScript Date object and format it
// 						id: answer.id
// 					}));

// 					setAnswers(formattedAnswers);
// 				}).catch((error) => {
// 					console.error("Error fetching answers:", error.response.status, error.response.data);
// 					setError(error);
// 				});
// 			});
// 	};

// 	useEffect(() => {
// 		getAnswers();
// 	}, [answers]);

// 	function handleDeleteAnswer(answerId) {
// 		// console.log(answerId)
// 		currentUser.getIdToken()
// 			.then(async (token) => {
// 				// console.log(token);
// 				const headers = {
// 					"Content-Type": "application/json",
// 					"Authorization": `Bearer ${token}`
// 				};
// 				await axios.delete(
// 					`${process.env.REACT_APP_API_GATEWAY_URL}/answer/${answerId}`,
// 					{
// 						headers: headers
// 					}
// 				).then((response) => {
// 					console.log("Answer deleted successfully");
// 					setAnswers(prevAnswers => prevAnswers.filter(answer => answer.id !== answerId));
// 				}).catch((error) => {
// 					console.error("Error deleting post:", error.response.status, error.response.data);
// 				});
// 			})
// 			.catch((error) => {
// 				setError(error);
// 			});
// 	}

// 	async function handleSubmit(e) {
// 		e.preventDefault();
// 		setError("");
// 		setLoading(true);

// 		currentUser.getIdToken()
// 			.then(async (token) => {
// 				// console.log(token);
// 				const headers = {
// 					"Content-Type": "application/json",
// 					"Authorization": `Bearer ${token}`
// 				};

// 				const newAnswerJson = {
// 					uid: currentUser.uid,
// 					qid: qid,
// 					body: answer
// 				}

// 				await axios.post(
// 					`${process.env.REACT_APP_API_GATEWAY_URL}/answer`,
// 					newAnswerJson,
// 					{
// 						headers: headers
// 					}
// 				).then((response) => {
// 					console.log("Answer post success:", response.data);
// 					setAnswers([...answers, newAnswerJson]);
// 				}).catch((error) => {
// 					console.error("Error posting answer:", error.response.status, error.response.data);
// 					setError(error);
// 				});
// 			})
// 			.catch((error) => {
// 				setError(error);
// 			});

// 		setLoading(false);
// 		setAnswer("");
// 	}


// 	return (
// 		<>
// 			<Container>
// 				<hr />
// 				<h5 style={{ marginBottom: "15px" }}>Answers</h5>
// 				<Row>
// 					{answers.map((answer, i) => (
// 						<div key={i} style={{ marginBottom: "5px", marginTop: "5px" }}>
// 							<div style={{ display: "flex", justifyContent: "space-between" }}>
// 								<div>
// 									<p>Answer: {answer.body}</p>
// 									<p>Answered by: {getName(answer.uid)}</p>
// 									<p>Answered At: {answer.date}</p>
// 								</div>
// 								<div>
// 									{answer.uid === currentUser.uid && (
// 										<Button variant="danger" onClick={() => handleDeleteAnswer(answer.id)}>
// 											Delete
// 										</Button>
// 									)}
// 								</div>
// 							</div>
// 							{i !== answers.length - 1 && <hr />}
// 						</div>
// 					))}
// 				</Row>
// 				<hr />
// 			</Container>

// 			<Card>
// 				<Card.Body>
// 					{error && <Alert variant="danger">{error}</Alert>}

// 					<Form onSubmit={handleSubmit}>
// 						<Form.Group id="answer">
// 							<Form.Label>Your Answer</Form.Label>
// 							<Form.Control type="answer" as="textarea" rows={5} value={answer} onChange={(e) => setAnswer(e.target.value)} required />
// 						</Form.Group>

// 						<Button disabled={loading} className="w-100 mt-3" type="submit">
// 							Post
// 						</Button>
// 					</Form>

// 				</Card.Body>
// 			</Card>
// 		</>
// 	)
// }

// export default Answer;

import React, { useState, useEffect } from "react"
import { Form, Button, Card, Alert, Container, Row } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

function Answer(props) {
	const { currentUser } = useAuth();
	const [answers, setAnswers] = useState([]);
	const [answer, setAnswer] = useState("");
	const [userNames, setUserNames] = useState({}); // Store user names
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { qid } = props;

	useEffect(() => {
		getAnswers();
	}, [answers]); // Fetch answers only once when the component mounts

	function getDateTime(nanosec, sec) {
		const time = {
			nanoseconds: nanosec,
			seconds: sec
		}

		const fireBaseTime = new Date(
			time.seconds * 1000 + time.nanoseconds / 1000000,
		);
		const date = fireBaseTime.toDateString();
		const atTime = fireBaseTime.toLocaleTimeString();

		return `${date} ${atTime}`
	}

	async function getAnswers() {
		try {
			const token = await currentUser.getIdToken();
			const headers = {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			};
			const response = await axios.get(
				`${process.env.REACT_APP_API_GATEWAY_URL}/answer/${qid}/all`,
				{ headers: headers }
			);
			const formattedAnswers = response.data.map(answer => ({
				...answer.data,
				date: getDateTime(answer.data.answered_at._nanoseconds, answer.data.answered_at._seconds), // Convert date to JavaScript Date object and format it
				id: answer.id
			}));
			setAnswers(formattedAnswers);
			// Fetch user names for each answer asynchronously
			fetchUserNames(formattedAnswers);
		} catch (error) {
			console.error("Error fetching answers:", error);
			setError(error.message || "Error fetching answers");
		}
	}

	async function fetchUserNames(answers) {
		try {
			const uniqueUids = [...new Set(answers.map(answer => answer.uid))];
			const fetchedUserNames = {};
			await Promise.all(uniqueUids.map(async uid => {
				try {
					const userName = await getName(uid);
					fetchedUserNames[uid] = userName;
				} catch (error) {
					console.error("Error fetching user name for uid:", uid, error);
					fetchedUserNames[uid] = "Unknown";
				}
			}));
			setUserNames(fetchedUserNames);
		} catch (error) {
			console.error("Error fetching user names:", error);
		}
	}

	async function getName(uid) {
		try {
			const token = await currentUser.getIdToken();
			const headers = {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			};
			const response = await axios.get(
				`${process.env.REACT_APP_API_GATEWAY_URL}/user/${uid}`,
				{ headers: headers }
			);
			return response.data.firstName;
		} catch (error) {
			console.error("Error fetching user name for uid:", uid, error);
			throw error;
		}
	}

	function handleDeleteAnswer(answerId) {
		console.log(answerId)
		currentUser.getIdToken()
			.then(async (token) => {
				// console.log(token);
				const headers = {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				};
				await axios.delete(
					`${process.env.REACT_APP_API_GATEWAY_URL}/answer/${answerId}`,
					{
						headers: headers
					}
				).then((response) => {
					console.log("Answer deleted successfully");
					setAnswers(prevAnswers => prevAnswers.filter(answer => answer.id !== answerId));
				}).catch((error) => {
					console.error("Error deleting post:", error.response.status, error.response.data);
				});
			})
			.catch((error) => {
				setError(error);
			});
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);

		currentUser.getIdToken()
			.then(async (token) => {
				// console.log(token);
				const headers = {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				};

				const newAnswerJson = {
					uid: currentUser.uid,
					qid: qid,
					body: answer
				}

				await axios.post(
					`${process.env.REACT_APP_API_GATEWAY_URL}/answer`,
					newAnswerJson,
					{
						headers: headers
					}
				).then((response) => {
					console.log("Answer post success:", response.data);
					setAnswers([...answers, newAnswerJson]);
				}).catch((error) => {
					console.error("Error posting answer:", error.response.status, error.response.data);
					setError(error);
				});
			})
			.catch((error) => {
				setError(error);
			});

		setLoading(false);
		setAnswer("");
	}

	return (
		<>
			<Container>
				<hr />
				<h5 style={{ marginBottom: "15px" }}>Answers</h5>
				<Row>
					{answers.map((answer, i) => (
						<div key={i} style={{ marginBottom: "5px", marginTop: "5px" }}>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<div>
									<p>Answer: {answer.body}</p>
									<p>Answered by: {userNames[answer.uid] || "Loading..."}</p>
									<p>Answered At: {answer.date}</p>
								</div>
								<div>
									{answer.uid === currentUser.uid && (
										<Button variant="danger" onClick={() => handleDeleteAnswer(answer.id)}>
											Delete
										</Button>
									)}
								</div>
							</div>
							{i !== answers.length - 1 && <hr />}
						</div>
					))}
				</Row>
				<hr />
			</Container>

			<Card>
				<Card.Body>
					{error && <Alert variant="danger">{error}</Alert>}

					<Form onSubmit={handleSubmit}>
						<Form.Group id="answer">
							<Form.Label>Your Answer</Form.Label>
							<Form.Control type="answer" as="textarea" rows={5} value={answer} onChange={(e) => setAnswer(e.target.value)} required />
						</Form.Group>

						<Button disabled={loading} className="w-100 mt-3" type="submit">
							Post
						</Button>
					</Form>

				</Card.Body>
			</Card>
		</>
	)
}

export default Answer;

