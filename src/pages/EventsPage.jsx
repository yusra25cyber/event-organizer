import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { UserContext } from "../contexts/UserContext.jsx";
import { EVENTS_API_URL } from "../apiConfig";

export default function EventsPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`${EVENTS_API_URL}/api/events`);
        if (!response.ok) throw new Error("Failed to fetch events from API");
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message || "Unknown error occurred");
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Booking handler
  const handleBook = async (eventId, eventTitle) => {
    if (!user?.id) {
      alert("Could not verify user. Please log in first.");
      return;
    }

    try {
      const response = await fetch(`${EVENTS_API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          event_id: eventId,
          number_of_tickets: 1,
          notes: "",
        }),
      });

      if (response.ok) {
        alert(`Successfully booked "${eventTitle}"!`);
        navigate("/my-bookings");
      } else {
        const data = await response.json();
        alert(`Booking failed: ${data.error || "Try again later."}`);
      }
    } catch (err) {
      console.error("Error booking event:", err);
      alert("Network error. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading upcoming events...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h1 className="display-5">Explore Upcoming Events</h1>
        </Col>
        <Col className="text-end">
          <Button
            variant="outline-primary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Col>
      </Row>

      <Row>
        {events.length === 0 ? (
          <Col>
            <p>No upcoming events found. Check back soon!</p>
          </Col>
        ) : (
          events.map((event) => {
            const dateString = event.event_date
              ? new Date(event.event_date).toLocaleDateString()
              : "No date";
            const description = event.description || "No description provided.";

            return (
              <Col key={event.id} md={4} lg={3} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={
                      event.image_url ||
                      "https://via.placeholder.com/400x250.png?text=Event+Image"
                    }
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{event.title || "Untitled Event"}</Card.Title>
                    <Card.Text className="text-muted small">
                      {dateString} at {event.location || "TBA"}
                    </Card.Text>
                    <Card.Text style={{ flexGrow: 1, fontSize: "0.9rem" }}>
                      {description.length > 100
                        ? description.substring(0, 100) + "..."
                        : description}
                    </Card.Text>
                    <Button
                      variant="primary"
                      className="mt-auto"
                      onClick={() => handleBook(event.id, event.title)}
                    >
                      Book Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </Container>
  );
}
