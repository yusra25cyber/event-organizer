import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Tab,
  Tabs,
  Alert,
} from "react-bootstrap";
import { UserContext } from "../contexts/UserContext.jsx";
import { EVENTS_API_URL } from "../apiConfig";

export default function CreatorHubPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [hostedEvents, setHostedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch hosted events for the current user
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchHostedEvents = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${EVENTS_API_URL}/api/users/${user.id}/events`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch your events from the server.");
        }

        const data = await response.json();

        setHostedEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching hosted events:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHostedEvents();
  }, [user]);

  // Split events into upcoming and past
  const now = new Date();
  const upcomingEvents = hostedEvents.filter(
    (event) => event?.event_date && new Date(event.event_date) >= now
  );
  const pastEvents = hostedEvents.filter(
    (event) => event?.event_date && new Date(event.event_date) < now
  );

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="display-5">My Creator Hub</h1>
          <p className="text-muted">Manage all the events you've created.</p>
        </Col>
        <Col xs="auto">
          <Button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </Col>
      </Row>

      <Tabs defaultActiveKey="upcoming" id="creator-hub-tabs" className="mb-3">
        <Tab eventKey="upcoming" title={`Upcoming (${upcomingEvents.length})`}>
          <EventGrid events={upcomingEvents} />
        </Tab>
        <Tab eventKey="past" title={`Past / Completed (${pastEvents.length})`}>
          <EventGrid events={pastEvents} />
        </Tab>
      </Tabs>
    </Container>
  );
}

// --- EventGrid Component ---
function EventGrid({ events }) {
  const navigate = useNavigate();

  if (!events || events.length === 0) {
    return (
      <div className="text-center p-5 bg-light rounded">
        <p>No events in this category.</p>
      </div>
    );
  }

  const handleManage = (eventId) => {
    // Placeholder for future edit functionality
    navigate(`/edit-event/${eventId}`);
  };

  return (
    <Row>
      {events.map(
        (event) =>
          event?.id && (
            <Col key={event.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={event.image_url || "https://via.placeholder.com/400x250"}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{event.title || "Untitled Event"}</Card.Title>
                  <Card.Text className="small text-muted">
                    {event.event_date
                      ? new Date(event.event_date).toLocaleDateString()
                      : "No date"}
                  </Card.Text>
                  <Card.Text className="text-truncate">
                    {event.description || "No description provided."}
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mt-auto"
                    onClick={() => handleManage(event.id)}
                  >
                    Manage
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )
      )}
    </Row>
  );
}
