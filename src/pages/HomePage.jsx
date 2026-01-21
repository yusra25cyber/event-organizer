import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const QUOTES = [
  "The best way to predict the future is to create it.",
  "Life is either a daring adventure or nothing at all.",
  "Do one thing every day that scares you.",
  "Happiness comes from your own actions.",
  "Turn your wounds into wisdom.",
  "Simplicity is the ultimate sophistication.",
];

export default function HomePage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  // --- 1. NAME LOGIC ---
  let formattedName = "Explorer"; // Default fallback
  if (user?.email) {
    // Take the part before @ (e.g. 'sara' from sara@gmail.com)
    const rawName = user.email.split("@")[0];
    // Capitalize first letter (e.g. 'Sara')
    formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  } else if (user?.displayName) {
    formattedName = user.displayName;
  }

  // --- 2. CUTE CARTOON AVATAR ---
  // We use the "Adventurer" style from DiceBear using your name as the seed
  const userAvatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${formattedName}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  return (
    <>
      <NavBar />

      <Container className="py-3">
        {/* WELCOME BANNER */}
        <div className="welcome-banner mb-5">
          <Row className="align-items-center">
            <Col md={3} className="text-center">
              <Image
                src={userAvatar}
                roundedCircle
                width={130}
                height={130}
                className="shadow-lg bg-light" // Added white bg behind avatar so it pops
                style={{
                  border: "4px solid rgba(255,255,255,0.5)",
                  padding: "2px",
                }}
              />
            </Col>
            <Col md={9}>
              <h1 className="display-4 fw-bold mb-3">
                Hello, {formattedName}!
              </h1>
              <p
                className="lead mb-0"
                style={{ color: "#e0e0e0", fontSize: "1.1rem" }}
              >
                Welcome to <strong>Eventizer</strong>. Your personal space for
                organizing memories. Manage your schedule, discover new places,
                and create unforgettable moments.
              </p>
            </Col>
          </Row>
        </div>

        {/* SECTION TITLE */}
        <h4
          className="mb-4 text-center text-uppercase"
          style={{ color: "#bcaaa4", letterSpacing: "2px", fontSize: "0.9rem" }}
        >
          — Dashboard —
        </h4>

        {/* ACTION CARDS */}
        <Row>
          {/* Card 1: Mocha */}
          <Col md={4} className="mb-4">
            <Card className="h-100 bg-mocha text-center">
              <Card.Body className="p-4 d-flex flex-column align-items-center">
                <div className="mb-3 fs-1">🌍</div>
                <Card.Title>Explore</Card.Title>
                <Card.Text style={{ color: "#ffecb3", fontSize: "0.9rem" }}>
                  Discover events near you.
                </Card.Text>
                <Button
                  className="btn-luxury mt-auto"
                  onClick={() => navigate("/events")}
                >
                  Browse
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 2: Caramel */}
          <Col md={4} className="mb-4">
            <Card className="h-100 bg-caramel text-center">
              <Card.Body className="p-4 d-flex flex-column align-items-center">
                <div className="mb-3 fs-1">✒️</div>
                <Card.Title>Creator Hub</Card.Title>
                <Card.Text style={{ color: "#f0f0f0", fontSize: "0.9rem" }}>
                  Plan and edit your events.
                </Card.Text>
                <Button
                  className="btn-luxury mt-auto"
                  onClick={() => navigate("/creator-hub")}
                >
                  Manage
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 3: Latte */}
          <Col md={4} className="mb-4">
            <Card className="h-100 bg-latte text-center">
              <Card.Body className="p-4 d-flex flex-column align-items-center">
                <div className="mb-3 fs-1">🎫</div>
                <Card.Title style={{ fontWeight: "bold", color: "#2b1b17" }}>
                  My Bookings
                </Card.Title>
                <Card.Text style={{ color: "#3e2723", fontSize: "0.9rem" }}>
                  View your tickets.
                </Card.Text>
                <Button
                  className="btn-luxury mt-auto"
                  onClick={() => navigate("/my-bookings")}
                >
                  View
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FOOTER QUOTE */}
        <div className="text-center pb-5">
          <div className="quote-pill">
            <p
              className="fst-italic mb-0"
              style={{ color: "#ffecb3", fontSize: "1.1rem" }}
            >
              "{quote}"
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
