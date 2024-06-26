import React, { useEffect, useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Questions from "./pages/Questions";
import QuestionDetails from "./pages/QuestionDetails";
import AskQuestion from "./pages/AskQuestion";
import TagQuestions from "./pages/TagQuestions";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import QuestionsAsked from "./pages/QuestionsAsked";
import QuestionsAnswered from "./pages/QuestionsAnswered";
import { TagsProvider } from "./contexts/TagsContext";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, width: "100%", height: "100%" }}>
      <div style={{ height: "100%" }}>
        <BrowserRouter>
          <AuthProvider>
            <TagsProvider>
            <Routes>
              <Route path="/" element={currentUser ? <Questions /> : <Navigate to="/login" />} />
              <Route path="/signup" element={currentUser ? <Navigate to="/" /> : <Signup />} />
              <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
              <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/question/:id" element={currentUser ? <QuestionDetails /> : <Navigate to="/login" />} />
              <Route path="/ask-question" element={currentUser ? <AskQuestion /> : <Navigate to="/login" />} />
              <Route path="/questions-asked" element={currentUser ? <QuestionsAsked /> : <Navigate to="/login" />} />
              <Route path="/questions-answered" element={currentUser ? <QuestionsAnswered /> : <Navigate to="/login" />} />
              <Route path="/questions/tagged/:tag" element={currentUser ? <TagQuestions /> : <Navigate to="/login" />} />
            </Routes>
            </TagsProvider>
          </AuthProvider>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
