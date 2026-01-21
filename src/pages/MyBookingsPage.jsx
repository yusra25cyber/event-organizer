import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Modal,
  Form,
} from "react-bootstrap";
import { UserContext } from "../contexts/UserContext.jsx";
import { EVENTS_API_URL } from "../apiConfig";

export default function MyBookingsPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      // Handle Firebase UID vs regular ID
      const userId = user?.uid || user?.id;

      if (!userId) return;

      setLoading(true);
      try {
        const response = await fetch(
          `${EVENTS_API_URL}/api/users/${userId}/bookings`,
        );
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const handleShowEditModal = (booking) => {
    setEditingBooking(booking);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingBooking(null);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!editingBooking) return;
    try {
      const updatedData = {
        number_of_tickets: editingBooking.number_of_tickets,
        notes: editingBooking.notes,
      };
      const response = await fetch(
        `${EVENTS_API_URL}/api/bookings/${editingBooking.booking_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        },
      );

      if (response.ok) {
        const updatedBooking = await response.json();
        // Update local state to show changes immediately
        setBookings(
          bookings.map((b) =>
            b.booking_id === editingBooking.booking_id
              ? { ...b, ...updatedBooking } // Merge new data (note: image comes from event, not booking update)
              : b,
          ),
        );
        handleCloseEditModal();
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const response = await fetch(
          `${EVENTS_API_URL}/api/bookings/${bookingId}`,
          {
            method: "DELETE",
          },
        );
        if (response.ok) {
          setBookings(bookings.filter((b) => b.booking_id !== bookingId));
        } else {
          const errorData = await response.json();
          alert(`Failed to cancel booking: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading your bookings...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h1 className="display-5">My Bookings</h1>
        </Col>
        <Col className="text-end">
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Col>
      </Row>

      <Row>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <Col key={booking.booking_id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                {/* ADDED IMAGE HERE */}
                <Card.Img
                  variant="top"
                  src={
                    booking.image_url ||
                    "https://via.placeholder.com/400x200?text=No+Image"
                  }
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{booking.title}</Card.Title>
                  <Card.Text>
                    <strong>Date:</strong>{" "}
                    {new Date(booking.event_date).toLocaleDateString()}
                  </Card.Text>
                  <Card.Text>
                    <strong>Location:</strong> {booking.location}
                  </Card.Text>
                  <Card.Text>
                    <strong>Tickets:</strong> {booking.number_of_tickets}
                  </Card.Text>
                  <Card.Text>
                    <strong>Notes:</strong> {booking.notes || "None"}
                  </Card.Text>

                  <div className="mt-3">
                    <Button
                      variant="outline-primary"
                      className="me-2"
                      size="sm"
                      onClick={() => handleShowEditModal(booking)}
                    >
                      Edit Details
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleCancel(booking.booking_id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p>You have no bookings yet. Go explore some events!</p>
            <Button variant="primary" onClick={() => navigate("/events")}>
              Browse Events
            </Button>
          </Col>
        )}
      </Row>

      {/* EDIT MODAL */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingBooking && (
            <Form onSubmit={handleSaveChanges}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Tickets</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={editingBooking.number_of_tickets}
                  onChange={(e) =>
                    setEditingBooking({
                      ...editingBooking,
                      number_of_tickets: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editingBooking.notes || ""}
                  onChange={(e) =>
                    setEditingBooking({
                      ...editingBooking,
                      notes: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
              <Button
                variant="secondary"
                onClick={handleCloseEditModal}
                className="ms-2"
              >
                Close
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
