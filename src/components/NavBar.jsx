import React, { useContext } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function NavBar() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="py-3" style={{ background: "transparent" }}>
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/dashboard")}
          style={{
            cursor: "pointer",
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.5rem",
            color: "#d7ccc8",
          }}
        >
          EventBooker.
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" variant="dark" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Button className="nav-btn" onClick={() => navigate("/dashboard")}>
              Home
            </Button>
            <Button className="nav-btn" onClick={() => navigate("/events")}>
              Explore
            </Button>
            <Button
              className="nav-btn"
              onClick={() => navigate("/creator-hub")}
            >
              Creator Hub
            </Button>
            <Button
              className="nav-btn"
              onClick={() => navigate("/my-bookings")}
            >
              My Bookings
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleLogout}
              style={{ borderRadius: "20px" }}
            >
              Log Out
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
