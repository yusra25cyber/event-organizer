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
  Form,
} from "react-bootstrap";
import { UserContext } from "../contexts/UserContext.jsx";
import { EVENTS_API_URL } from "../apiConfig";
import NavBar from "../components/NavBar";

export default function EventsPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [events, setEvents] = useState([]);
  // --- NEW SEARCH STATE ---
  const [searchTerm, setSearchTerm] = useState("");
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

  // --- FILTER LOGIC ---
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleBook = async (eventId, eventTitle) => {
    const userId = user?.uid || user?.id;
    if (!userId) {
      alert("Please log in.");
      return;
    }

    try {
      const response = await fetch(`${EVENTS_API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          event_id: eventId,
          number_of_tickets: 1,
        }),
      });
      if (response.ok) {
        alert(`Booked "${eventTitle}"!`);
        navigate("/my-bookings");
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (err) {
      alert("Network error");
    }
  };

  return (
    <>
      <NavBar />
      <Container className="py-4">
        <Row className="mb-4 align-items-center">
          <Col md={6}>
            <h1 className="display-5 fw-bold">Explore</h1>
          </Col>
          <Col md={6}>
            {/* --- SEARCH INPUT --- */}
            <Form.Control
              type="text"
              placeholder="Search events or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: "10px", fontSize: "1rem" }}
            />
          </Col>
        </Row>

        {isLoading && (
          <div className="text-center mt-5">
            <Spinner animation="border" variant="light" />
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}

        {!isLoading && !error && (
          <Row>
            {filteredEvents.length === 0 ? (
              <Col className="text-center mt-5">
                <h3 className="text-white-50">
                  No events found matching "{searchTerm}"
                </h3>
              </Col>
            ) : (
              filteredEvents.map((event) => {
                const dateString = event.event_date
                  ? new Date(event.event_date).toLocaleDateString()
                  : "TBA";

                return (
                  <Col key={event.id} md={4} lg={3} className="mb-4">
                    <Card className="h-100 bg-mocha shadow-sm">
                      <Card.Img
                        variant="top"
                        src={
                          event.image_url ||
                          "https://via.placeholder.com/400x250.png?text=Event"
                        }
                        style={{
                          height: "180px",
                          objectFit: "cover",
                          borderTopLeftRadius: "15px",
                          borderTopRightRadius: "15px",
                        }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title
                          className="fw-bold"
                          style={{ color: "#ffecb3" }}
                        >
                          {event.title}
                        </Card.Title>
                        <Card.Text
                          className="small"
                          style={{ color: "#d7ccc8" }}
                        >
                          📅 {dateString} <br /> 📍 {event.location}
                        </Card.Text>
                        <Button
                          className="btn-luxury mt-auto w-100"
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
        )}
      </Container>
    </>
  );
}
