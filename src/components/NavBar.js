import React, { useState } from "react";
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';

function NavBar() {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchValue.trim() === "") {
      navigate("/");
    } else {
      navigate(`/questions/tagged/${searchValue}`);
    }
  };

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <Navbar href="/" bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Link to="/" className="navbar-brand">Teacher2Student</Link>
      
        <Form className="d-flex mx-auto my-2 my-lg-0">
          <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
            value={searchValue}
            onChange={handleInputChange}
          />
          <Button variant="secondary" className="search-button" onClick={handleSearch}>Search</Button>
        </Form>

        <Nav className="ms-auto">
          <Link to="/profile" className="nav-link">Profile</Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
