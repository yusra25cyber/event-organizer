import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
// We only need UserContext now
import UserProvider, { UserContext } from "./contexts/UserContext";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import CreateEventPage from "./pages/CreateEventPage";
import CreatorHubPage from "./pages/CreatorHubPage";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
// Ensure your CSS is imported if not done in main.jsx
import "./index.css";

function ProtectedRoutes() {
  // FIX: Destructure 'user' and 'loading', NOT 'authToken'
  const { user, loading } = useContext(UserContext);

  // 1. Wait for Firebase to check if we are logged in
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-white">
        Loading...
      </div>
    );
  }

  // 2. If user exists, let them in. If not, kick them to login.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    // Removed AuthProvider (it's duplicate/unnecessary)
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/creator-hub" element={<CreatorHubPage />} />

            {/* Redirect root url to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Catch all - send to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
