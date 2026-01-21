import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";
import { EVENTS_API_URL } from "../apiConfig";
import { useNavigate } from "react-router-dom";

export default function CreatorHubPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [myEvents, setMyEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchMyEvents = async () => {
    const userId = user?.uid || user?.id;
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${EVENTS_API_URL}/api/users/${userId}/events`,
      );
      if (!response.ok) throw new Error("Failed to fetch your events.");
      const data = await response.json();
      setMyEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Could not load your events.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, [user]);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure? This will delete the event.")) return;
    try {
      const res = await fetch(`${EVENTS_API_URL}/api/events/${eventId}`, {
        method: "DELETE",
      });
      if (res.ok) setMyEvents(myEvents.filter((e) => e.id !== eventId));
      else alert("Failed to delete event.");
    } catch (err) {
      alert("Error deleting event.");
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent({ ...event });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${EVENTS_API_URL}/api/events/${editingEvent.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editingEvent.title,
            description: editingEvent.description,
            event_date: editingEvent.event_date.split("T")[0],
            event_time: editingEvent.event_time,
            location: editingEvent.location,
            image_url: editingEvent.image_url,
          }),
        },
      );

      if (!res.ok) throw new Error("Update failed");
      fetchMyEvents();
      setShowEditModal(false);
      alert("Event updated!");
    } catch (err) {
      alert("Failed to update event.");
    }
  };

  if (isLoading)
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="light" />
      </Container>
    );

  return (
    <Container className="py-5">
      {/* HEADER WITH BUTTONS */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-white">Creator Hub</h1>
        <div>
          <Button
            variant="light"
            className="me-2"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </Button>
          <Button variant="success" onClick={() => navigate("/create-event")}>
            + Create New Event
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {myEvents.length === 0 ? (
          <Col>
            <Card className="text-center p-5">
              <Card.Body>
                <h3>No events yet</h3>
                <p>Start your journey by creating your first event.</p>
                <Button
                  variant="primary"
                  onClick={() => navigate("/create-event")}
                >
                  Create Event
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          myEvents.map((event) => (
            <Col key={event.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={event.image_url || "https://via.placeholder.com/400x200"}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Text className="text-muted small">
                    {new Date(event.event_date).toLocaleDateString()} at{" "}
                    {event.location}
                  </Card.Text>
                  <div className="d-flex gap-2 mt-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditClick(event)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingEvent && (
            <Form onSubmit={handleEditSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editingEvent.description}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Control
                    type="date"
                    value={
                      editingEvent.event_date
                        ? new Date(editingEvent.event_date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        event_date: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="time"
                    value={editingEvent.event_time}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        event_time: e.target.value,
                      })
                    }
                  />
                </Col>
              </Row>
              <Button variant="primary" type="submit" className="mt-3 w-100">
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
