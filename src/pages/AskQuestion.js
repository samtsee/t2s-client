import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import axios from 'axios';
import { useTags } from "../contexts/TagsContext";


function AskQuestion() {
  const { currentUser } = useAuth();
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const tagsRef = useRef(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { tags, setTags } = useTags();

  console.log(tags)

  // Function to handle adding tags
  function handleAddTag() {
    const newTag = tagsRef.current.value.trim();
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag]);
      tagsRef.current.value = ''; // Clear input after adding tag
    }
  }

  // Function to handle removing tags
  function handleRemoveTag(tagToRemove) {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    // console.log(descriptionRef.current.value)
    console.log(selectedTags)
    const uniqueTags = new Set([...tags, ...selectedTags]); // Combine existing tags with new tags and convert to Set to remove duplicates
    setTags(Array.from(uniqueTags));

    currentUser.getIdToken()
      .then(async (token) => {
        // console.log(token);
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        await axios.post(
          `${process.env.REACT_APP_API_GATEWAY_URL}/question`,
          {
            user: currentUser.uid,
            title: titleRef.current.value,
            question: descriptionRef.current.value,
            tags: selectedTags
          },
          {
            headers: headers
          }
        ).then((response) => {
          console.log("Question post success:", response.data);
          navigate("/");
        }).catch((error) => {
          console.error("Error posting question:", error.response.status, error.response.data);
          setError(error);
        });
      })
      .catch((error) => {
        setError(error);
      });

    setLoading(false);
  }


  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Ask a Question</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group id="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="title" ref={titleRef} required />
            </Form.Group>

            <Form.Group id="description">
              <Form.Label>Description</Form.Label>
              <Form.Control type="description" as="textarea" rows={5} ref={descriptionRef} required />
            </Form.Group>

            <Form.Group id="tags">
              <Form.Label>Tags</Form.Label>
              <div>
                {/* Display selected tags */}
                {selectedTags.map(tag => (
                  <Button key={tag} variant="outline-primary" size="sm" className="mr-2 mb-2" onClick={() => handleRemoveTag(tag)} style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}>
                    {tag} <span aria-hidden="true">&times;</span>
                  </Button>
                ))}
              </div>
              {/* Input field for creating new tags */}
              <Form.Control type="text" ref={tagsRef} placeholder="Enter tag" className="mb-2" />
              {/* Button to add new tags */}
              <Button variant="primary" size="sm" onClick={handleAddTag}>Add Tag</Button>
            </Form.Group>

            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Post
            </Button>

            <Link to="/">
              <Button disabled={loading} className="w-100 mt-2" variant="secondary">
                Cancel
              </Button>
            </Link>
          </Form>

        </Card.Body>
      </Card>
    </>
  )
}

export default AskQuestion;
