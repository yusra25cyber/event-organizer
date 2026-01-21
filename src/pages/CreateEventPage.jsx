// src/pages/CreateEventPage.jsx
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";
import { EVENTS_API_URL } from "../apiConfig";

export default function CreateEventPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = user?.uid || user?.id;

    if (!userId) {
      setError("Authentication error. User ID not found.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let uploadedImageUrl = "";
      if (file) {
        try {
          const storageRef = ref(storage, `events/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          uploadedImageUrl = await getDownloadURL(storageRef);
        } catch (uploadErr) {
          throw new Error("Failed to upload image.");
        }
      }

      const eventData = {
        title,
        description,
        event_date: eventDate,
        event_time: eventTime,
        location,
        image_url: uploadedImageUrl,
        creator_id: userId,
      };

      const response = await fetch(`${EVENTS_API_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Server error.");

      alert("Event created successfully!");
      navigate("/events");
    } catch (serverError) {
      setError(serverError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      {/* Header with Back Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-white">Create a New Event</h1>
        <Button variant="light" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </Button>
      </div>

      <Card className="p-4 shadow-lg">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Event Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Time</Form.Label>
                <Form.Control
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Event Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept="image/*"
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <Button
            variant="primary"
            size="lg"
            className="w-100"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Publish Event"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
