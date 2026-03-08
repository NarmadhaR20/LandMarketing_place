import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import LandDetails from './pages/public/LandDetails';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import PendingApprovals from './pages/admin/PendingApprovals';
import AllLands from './pages/admin/AllLands';
import Reports from './pages/admin/Reports';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddLand from './pages/owner/AddLand';
import EditLand from './pages/owner/EditLand';
import MyListings from './pages/owner/MyListings';
import BookingRequests from './pages/owner/BookingRequests';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import MyBookings from './pages/buyer/MyBookings';
import BrowseLands from './pages/buyer/BrowseLands';

// Shared
import Profile from './pages/shared/Profile';

function App() {
    return (
        <Router>
            <ErrorBoundary>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/land/:id" element={<LandDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<DashboardLayout allowedRoles={['admin']}><AdminDashboard /></DashboardLayout>} />
                    <Route path="/admin/users" element={<DashboardLayout allowedRoles={['admin']}><Users /></DashboardLayout>} />
                    <Route path="/admin/approvals" element={<DashboardLayout allowedRoles={['admin']}><PendingApprovals /></DashboardLayout>} />
                    <Route path="/admin/lands" element={<DashboardLayout allowedRoles={['admin']}><AllLands /></DashboardLayout>} />
                    <Route path="/admin/reports" element={<DashboardLayout allowedRoles={['admin']}><Reports /></DashboardLayout>} />

                    {/* Owner Routes */}
                    <Route path="/owner" element={<DashboardLayout allowedRoles={['owner']}><OwnerDashboard /></DashboardLayout>} />
                    <Route path="/owner/add" element={<DashboardLayout allowedRoles={['owner']}><AddLand /></DashboardLayout>} />
                    <Route path="/owner/edit-land/:id" element={<DashboardLayout allowedRoles={['owner']}><EditLand /></DashboardLayout>} />
                    <Route path="/owner/listings" element={<DashboardLayout allowedRoles={['owner']}><MyListings /></DashboardLayout>} />
                    <Route path="/owner/bookings" element={<DashboardLayout allowedRoles={['owner']}><BookingRequests /></DashboardLayout>} />
                    <Route path="/owner/profile" element={<DashboardLayout allowedRoles={['owner']}><Profile /></DashboardLayout>} />

                    {/* Buyer Routes */}
                    <Route path="/buyer" element={<DashboardLayout allowedRoles={['buyer']}><BuyerDashboard /></DashboardLayout>} />
                    <Route path="/buyer/lands" element={<DashboardLayout allowedRoles={['buyer']}><BrowseLands /></DashboardLayout>} />
                    <Route path="/buyer/bookings" element={<DashboardLayout allowedRoles={['buyer']}><MyBookings /></DashboardLayout>} />
                    <Route path="/buyer/profile" element={<DashboardLayout allowedRoles={['buyer']}><Profile /></DashboardLayout>} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </ErrorBoundary>
        </Router>
    );
}

export default App;
