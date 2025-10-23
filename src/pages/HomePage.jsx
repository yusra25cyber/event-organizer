import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function HomePage() {
  const { user } = useContext(UserContext);
  const username = user?.username || "Superstar";

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <HeroSection username={username} />
      <Container className="py-5">
        <MainGrid />
      </Container>
      <FooterBar />
    </div>
  );
}

function HeroSection({ username }) {
  const avatarUrl = `https://api.dicebear.com/8.x/thumbs/svg?seed=${username}`;
  return (
    <div
      className="p-5 text-white bg-dark"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1505238680356-667803448bb6?q=80&w=2070&auto=format&fit=crop)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "0 0 1rem 1rem",
      }}
    >
      <Container>
        <Row className="align-items-center">
          <Col md="auto">
            <img
              src={avatarUrl}
              alt="User Avatar"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "3px solid white",
                backgroundColor: "#fff",
              }}
            />
          </Col>
          <Col>
            <h1 className="display-4">Welcome back, {username}.</h1>
            <p className="lead">
              Your mission control for creating unforgettable experiences.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function MainGrid() {
  const myBookingsCount = 0; // Placeholder
  const myHostedEventsCount = 0; // Placeholder

  return (
    <Row xs={1} md={2} lg={4} className="g-4">
      <Col>
        <ActionCard
          icon="bi-search-heart"
          title="Explore Events"
          text="Discover and book your next great experience."
          buttonText="Browse All"
          buttonVariant="primary"
          linkTo="/events"
        />
      </Col>
      <Col>
        <ActionCard
          icon="bi-plus-circle-dotted"
          title="Create New Event"
          text="Have an idea? Bring it to life and invite others."
          buttonText="Start Building"
          buttonVariant="outline-primary"
          linkTo="/create-event"
        />
      </Col>
      <Col>
        <ActionCard
          icon="bi-calendar-heart"
          title="My Creator Hub"
          text={`Manage your ${myHostedEventsCount} hosted events.`}
          buttonText="Go to Hub"
          buttonVariant="success"
          linkTo="/creator-hub"
        />
      </Col>
      <Col>
        <ActionCard
          icon="bi-ticket-perforated"
          title="My Bookings"
          text={`You have ${myBookingsCount} upcoming bookings.`}
          buttonText="View Bookings"
          buttonVariant="info"
          linkTo="/my-bookings"
        />
      </Col>
    </Row>
  );
}

function ActionCard({ icon, title, text, buttonText, buttonVariant, linkTo }) {
  return (
    <Card className="h-100 text-center shadow-sm">
      <Card.Body className="d-flex flex-column">
        <i
          className={`bi ${icon}`}
          style={{ fontSize: "3rem", color: "#0d6efd" }}
        ></i>
        <Card.Title className="mt-3">{title}</Card.Title>
        <Card.Text className="flex-grow-1">{text}</Card.Text>
        <Link to={linkTo}>
          <Button variant={buttonVariant} className="mt-auto">
            {buttonText}
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

function FooterBar() {
  const [quote, setQuote] = useState("Loading inspiration...");

  useEffect(() => {
    fetch("https://api.quotable.io/random?maxLength=100")
      .then((res) => res.json())
      .then((data) => setQuote(`${data.content} — ${data.author}`))
      .catch(() => setQuote("The journey is the reward."));
  }, []);

  return (
    <div
      className="fixed-bottom bg-white shadow-lg"
      style={{ borderTop: "1px solid #e9ecef" }}
    >
      <Container className="d-flex justify-content-between align-items-center py-2">
        <span className="text-primary">
          <strong>Today's Thought:</strong>{" "}
          <em className="text-muted">{quote}</em>
        </span>
        <Button variant="link">
          <i className="bi bi-gear" style={{ fontSize: "1.2rem" }}></i>
        </Button>
      </Container>
    </div>
  );
}
