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
import NavBar from "../components/NavBar";

export default function MyBookingsPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
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
        setBookings(
          bookings.map((b) =>
            b.booking_id === editingBooking.booking_id
              ? { ...b, ...updatedBooking }
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
          { method: "DELETE" },
        );
        if (response.ok)
          setBookings(bookings.filter((b) => b.booking_id !== bookingId));
        else {
          const errorData = await response.json();
          alert(`Failed to cancel: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error cancelling:", error);
      }
    }
  };

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="light" />
      </Container>
    );

  return (
    <>
      <NavBar />
      <Container className="py-4">
        <div className="mb-5">
          <h1 className="display-5 fw-bold text-white">My Bookings</h1>
          <p className="text-white-50">Your ticket wallet.</p>
        </div>

        <Row>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <Col key={booking.booking_id} md={6} lg={4} className="mb-4">
                {/* USING CARAMEL THEME FOR BOOKINGS */}
                <Card className="h-100 bg-caramel shadow-lg">
                  <Card.Img
                    variant="top"
                    src={
                      booking.image_url ||
                      "https://via.placeholder.com/400x200?text=No+Image"
                    }
                    style={{
                      height: "180px",
                      objectFit: "cover",
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                    }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold text-white">
                      {booking.title}
                    </Card.Title>
                    <Card.Text className="small text-white-50">
                      📅 {new Date(booking.event_date).toLocaleDateString()}{" "}
                      <br />
                      📍 {booking.location}
                    </Card.Text>

                    <div
                      className="p-3 mb-3 rounded"
                      style={{ background: "rgba(0,0,0,0.2)" }}
                    >
                      <div className="d-flex justify-content-between text-white">
                        <span>Tickets:</span>{" "}
                        <strong>{booking.number_of_tickets}</strong>
                      </div>
                      {booking.notes && (
                        <div className="text-white-50 small mt-1">
                          Note: {booking.notes}
                        </div>
                      )}
                    </div>

                    <div className="mt-auto d-flex gap-2">
                      <Button
                        className="btn-luxury w-100"
                        onClick={() => handleShowEditModal(booking)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        style={{ borderRadius: "50px" }}
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
              <Card className="text-center p-5 bg-caramel">
                <Card.Body>
                  <h3 className="text-white">No bookings yet</h3>
                  <p className="text-white-50">Go find something fun to do!</p>
                  <Button
                    className="btn-luxury mt-3"
                    onClick={() => navigate("/events")}
                  >
                    Browse Events
                  </Button>
                </Card.Body>
              </Card>
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
                <Button className="btn-luxury w-100" type="submit">
                  Save Changes
                </Button>
              </Form>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}
