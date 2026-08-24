// App.jsx
// Root component — sets up React Router and all routes.
// AdminPanel is lazy-loaded with React.lazy + Suspense (Task 2)

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";

// Regular page imports
import LoginPage from "./pages/LoginPage";
import ClassesPage from "./pages/ClassesPage";
import MyBookingsPage from "./pages/MyBookingsPage";

// AdminPanel is lazy-loaded — only fetched when /admin is visited
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function App() {
  return (
    // AuthProvider wraps everything so any child can access auth state
    <AuthProvider>
      <BrowserRouter>
        {/* Navbar is shown on all pages */}
        <Navbar />

        <Routes>
          {/* Public route — the login page */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected route — redirect to / if no token */}
          <Route
            path="/classes"
            element={
              <ProtectedRoute>
                <ClassesPage />
              </ProtectedRoute>
            }
          />

          {/* Protected route */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />

          {/* Lazy-loaded admin panel — Suspense shows fallback while loading */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<p style={{ padding: "2rem" }}>Loading Admin Panel...</p>}>
                <AdminPanel />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
