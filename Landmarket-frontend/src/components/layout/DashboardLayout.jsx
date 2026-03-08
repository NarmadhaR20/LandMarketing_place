import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import ProfileModal from '../auth/ProfileModal';

const DashboardLayout = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <DashboardHeader />
                {children}
                <ProfileModal />
            </main>
        </div>
    );
};

export default DashboardLayout;
