// App.jsx

import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import UserProvider, { UserContext } from "./contexts/UserContext"; // Import both
import AuthPage from "./pages/AuthPage";
import EventsPage from "./pages/EventsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import HomePage from "./pages/HomePage"; // Import your new HomePage

// This component protects routes that require a logged-in user
function ProtectedRoutes() {
  const { authToken } = useContext(UserContext);
  // If there's no token, redirect to the login page
  return authToken ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    // STEP 1: Wrap the entire app in UserProvider
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route: Anyone can see the login page */}
          <Route path="/login" element={<AuthPage />} />

          {/* Protected Routes: Only logged-in users can access these */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            {/* Add other protected routes here, like creating an event */}
          </Route>

          {/* Fallback Route: If no other path matches, go to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
