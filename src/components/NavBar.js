import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from React Router

function NavBar() {
  return (
    <Navbar bg="dark" variant="dark">
      <Container fluid>
        <Link to="/" className="navbar-brand">Teacher2Student</Link>
        <Nav className="ml-auto">
          <Link to="/profile" className="nav-link">Profile</Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
