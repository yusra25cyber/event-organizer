import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"; // Make sure useNavigate is imported
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { EVENTS_API_URL } from "../apiConfig";

// --- Main HomePage Component ---
export default function HomePage() {
  const { user, setAuthToken } = useContext(UserContext); // Get user AND setAuthToken
  const navigate = useNavigate(); // Hook for navigation

  const username = user?.username || "Superstar";

  const handleLogout = () => {
    setAuthToken(null); // This clears the token
    navigate("/login"); // This redirects to the login page
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <HeroSection username={username} onLogout={handleLogout} />
      <Container className="py-5">
        <MainGrid />
      </Container>
      <FooterBar />
    </div>
  );
}

// --- Sub-component: HeroSection (Accepts onLogout prop) ---
function HeroSection({ username, onLogout }) {
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
          <Col md="auto" className="ms-auto">
            {/* This is now a button that calls the onLogout function */}
            <Button variant="outline-light" onClick={onLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// --- Sub-component: MainGrid (Data-Driven) ---
function MainGrid() {
  const { user } = useContext(UserContext);
  const [hostedEventsCount, setHostedEventsCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [hostedEventsResponse, bookingsResponse] = await Promise.all([
          fetch(`${EVENTS_API_URL}/api/users/${user.id}/events`),
          fetch(`${EVENTS_API_URL}/api/users/${user.id}/bookings`),
        ]);

        if (hostedEventsResponse.ok) {
          const hostedEvents = await hostedEventsResponse.json();
          setHostedEventsCount(hostedEvents.length);
        }

        if (bookingsResponse.ok) {
          const bookings = await bookingsResponse.json();
          setBookingsCount(bookings.length);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return <p className="text-center py-5">Loading your mission control...</p>;
  }

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
          text={`You are hosting ${hostedEventsCount} events.`}
          buttonText="Go to Hub"
          buttonVariant="success"
          linkTo="/creator-hub"
        />
      </Col>
      <Col>
        <ActionCard
          icon="bi-ticket-perforated"
          title="My Bookings"
          text={`You have ${bookingsCount} upcoming bookings.`}
          buttonText="View Bookings"
          buttonVariant="info"
          linkTo="/my-bookings"
        />
      </Col>
    </Row>
  );
}

// --- Reusable Component: ActionCard ---
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

// --- Sub-component: FooterBar ---
function FooterBar() {
  const [quote, setQuote] = useState("Loading inspiration...");

  useEffect(() => {
    fetch("https://api.quotable.io/random?maxLength=100")
      .then((res) => {
        if (!res.ok) throw new Error("API not available");
        return res.json();
      })
      .then((data) => setQuote(`${data.content} — ${data.author}`))
      .catch(() =>
        setQuote(
          "The only way to do great work is to love what you do. — Steve Jobs"
        )
      );
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
