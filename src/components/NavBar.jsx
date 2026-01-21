import React, { useContext } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

// 1. IMPORT FIREBASE AUTH FUNCTIONS
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function NavBar() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      console.log("Attempting to log out...");
      // 2. ACTUALLY SIGN OUT FROM FIREBASE
      await signOut(auth);
      console.log("Sign out successful!");

      // 3. GO TO LOGIN PAGE
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
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
            <button className="nav-btn" onClick={() => navigate("/dashboard")}>
              Home
            </button>
            <button className="nav-btn" onClick={() => navigate("/events")}>
              Explore
            </button>
            <button
              className="nav-btn"
              onClick={() => navigate("/creator-hub")}
            >
              Creator Hub
            </button>
            <button
              className="nav-btn"
              onClick={() => navigate("/my-bookings")}
            >
              My Bookings
            </button>

            {/* LOGOUT BUTTON */}
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
