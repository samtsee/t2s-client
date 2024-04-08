import { updateCurrentUser, signOut } from "firebase/auth";
import React, { useState } from "react";
import { Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../config/firebase-config.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from '../components/NavBar';

function Profile() {
	const [error, setError] = useState("");
	const [profileData, setProfileData] = useState({});
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	function handleLogout() {
		signOut(auth).then(() => {
			navigate("/login");
		}).catch((error) => {
			setError(error);
		});
	}

	function goToQuestionsAsked() {
		navigate("/questions-asked")
	}

	function goToQuestionsAnswered() {
		navigate("/questions-answered")
	}
	function getUserProfile() {
		currentUser.getIdToken()
			.then(async (token) => {
				console.log(token);
				const headers = {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				};
				console.log(currentUser.uid);
				console.log(currentUser.displayName);
				await axios.get(
					process.env.REACT_APP_API_GATEWAY_URL + "/user/" + currentUser.uid,
					{
						headers: headers
					}
				).then((response) => {
					// console.log("User post success:", response.data);
					setProfileData(JSON.parse(response.data));
					console.log("User post success:", JSON.parse(response.data));
				}).catch((error) => {
					console.error("Error fetching user:", error.response.status, error.response.data);
				});
			});
	}


	return (
		<>
			<NavBar />

			<Card>
				<Card.Body>
					<h2 className="text-center mb-4">Profile</h2>

					{error && <Alert variant="danger">{error}</Alert>}

					<strong>Email: </strong> {currentUser.email}

				</Card.Body>
			</Card>

			<div className="w-100 text-center mt-2">
				<Button variant="link" onClick={goToQuestionsAsked}>Questions Asked</Button>
			</div>

			<div className="w-100 text-center mt-2">
				<Button variant="link" onClick={goToQuestionsAnswered}>Questions Answered</Button>
			</div>
			
		</>
	)
}

export default Profile;
