import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../config/firebase-config.js";
import {
	createUserWithEmailAndPassword
} from "firebase/auth";


function Signup() {
	const emailRef = useRef();
	const passwordRef = useRef();
	const firstNameRef = useRef();
	const lastNameRef = useRef();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);

		createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
			.then((userCredential) => {
				const user = userCredential.user;
				user.getIdToken()
					.then(async (token) => {
						// console.log(token);
						const headers = {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						};

						await axios.post(
							`${process.env.REACT_APP_API_GATEWAY_URL}/user`,
							{
								id: user.uid,
								firstName: firstNameRef.current.value,
								lastName: lastNameRef.current.value,
								email: emailRef.current.value
							},
							{
								headers: headers
							}
						).then((response) => {
							console.log("User post success:", response.data);
						}).catch((error) => {
							console.error("Error saving user:", error.response.status, error.response.data);
						});
					});
				navigate("/");
			})
			.catch((error) => {
				setError(error.message);
			});

		setLoading(false);
	}


	return (
		<>
			<Card>
				<Card.Body>
					<h2 className="text-center mb-4">Sign Up</h2>

					{error && <Alert variant="danger">{error}</Alert>}

					<Form onSubmit={handleSubmit}>
						<Form.Group id="firstName">
							<Form.Label>First Name</Form.Label>
							<Form.Control type="firstName" ref={firstNameRef} required />
						</Form.Group>

						<Form.Group id="lastName">
							<Form.Label>Last Name</Form.Label>
							<Form.Control type="lastName" ref={lastNameRef} required />
						</Form.Group>

						<Form.Group id="email">
							<Form.Label>Email</Form.Label>
							<Form.Control type="email" ref={emailRef} />
						</Form.Group>

						<Form.Group id="password">
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" ref={passwordRef} />
						</Form.Group>

						<Button disabled={loading} className="w-100 mt-3" type="submit">
							Sign Up
						</Button>
					</Form>

				</Card.Body>
			</Card>

			<div className="w-100 text-center mt-2">
				Already have an account? <Link to="/login">Log In</Link>
			</div>

		</>
	)
}

export default Signup;
