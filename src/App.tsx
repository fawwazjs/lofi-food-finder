import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PlaceList from "./pages/PlaceList";
import PlaceDetail from "./pages/PlaceDetail";
import PlaceForm from "./pages/PlaceForm";

const queryClient = new QueryClient();

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/places"
              element={
                <ProtectedRoute>
                  <PlaceList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/places/new"
              element={
                <ProtectedRoute>
                  <PlaceForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/places/:id"
              element={
                <ProtectedRoute>
                  <PlaceDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/places/:id/edit"
              element={
                <ProtectedRoute>
                  <PlaceForm />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
