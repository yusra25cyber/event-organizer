import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext"; // Make sure this path is correct

export default function HomePage() {
  const [quote, setQuote] = useState("Loading your daily spark...");
  const { user } = useContext(UserContext); // Get the user from context

  // Use the username from the decoded token, with a fallback
  const username = user?.username || "there";

  // Fetch quote on load - This is already correctly set up
  useEffect(() => {
    fetch("https://api.quotable.io/random")
      .then((res) => res.json())
      .then((data) => setQuote(`"${data.content}"\n— ${data.author}`))
      .catch(() => setQuote("Even quotes take breaks. You don't have to."));
  }, []);

  return (
    <Container className="py-5" style={{ minHeight: "90vh" }}>
      {/* Welcome Section */}
      <Row className="mb-5">
        <Col md={8}>
          <h1 className="display-4">👋 Welcome back, {username}!</h1>
          <p className="lead">This is your space. Your events. Your rules.</p>
        </Col>

        {/* THIS IS THE MISSING PIECE - The "Today's Spark" card */}
        <Col
          md={4}
          className="d-flex align-items-center justify-content-center"
        >
          <div
            style={{
              padding: "1.5rem",
              background: "#f8f9fa",
              borderRadius: "12px",
              border: "1px solid #e9ecef",
            }}
          >
            <h5>✨ Today's Spark</h5>
            <blockquote
              style={{
                fontSize: "1rem",
                fontStyle: "italic",
                whiteSpace: "pre-line",
                margin: 0,
              }}
            >
              {quote} {/* We are now using the 'quote' state here */}
            </blockquote>
          </div>
        </Col>
      </Row>

      {/* Action Buttons - These are already correct */}
      <Row className="g-4">
        <Col md={4}>
          <div className="p-4 border rounded text-center bg-light h-100">
            <h3>📅 Browse Events</h3>
            <p>Find new events or book your spot.</p>
            <Link to="/events">
              <Button variant="primary" size="lg">
                Explore Now
              </Button>
            </Link>
          </div>
        </Col>

        <Col md={4}>
          <div className="p-4 border rounded text-center bg-light h-100">
            <h3>🎟️ My Bookings</h3>
            <p>Manage, edit, or cancel your bookings.</p>
            <Link to="/my-bookings">
              <Button variant="success" size="lg">
                View My Bookings
              </Button>
            </Link>
          </div>
        </Col>

        {/* We can add another card for "Create Event" later if needed */}
      </Row>
    </Container>
  );
}
