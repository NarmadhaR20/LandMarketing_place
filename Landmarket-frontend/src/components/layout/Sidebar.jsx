import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    PlusSquare,
    List,
    BookOpen,
    User,
    LogOut,
    Search,
    Clock,
    Users,
    BarChart3,
    Map
} from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

const Sidebar = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    const menuItems = {
        admin: [
            { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
            { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
            { name: 'Pending Land Approvals', icon: <Clock size={20} />, path: '/admin/approvals' },
            { name: 'All Lands', icon: <Map size={20} />, path: '/admin/lands' },
            { name: 'Reports', icon: <BarChart3 size={20} />, path: '/admin/reports' },
        ],
        owner: [
            { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/owner' },
            { name: 'Add Land', icon: <PlusSquare size={20} />, path: '/owner/add' },
            { name: 'My Listings', icon: <List size={20} />, path: '/owner/listings' },
            { name: 'Booking Requests', icon: <BookOpen size={20} />, path: '/owner/bookings' },
            { name: 'Profile', icon: <User size={20} />, path: '/owner/profile' },
        ],
        buyer: [
            { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/buyer' },
            { name: 'Browse Lands', icon: <Search size={20} />, path: '/buyer/lands' },
            { name: 'My Bookings', icon: <BookOpen size={20} />, path: '/buyer/bookings' },
            { name: 'Profile', icon: <User size={20} />, path: '/buyer/profile' },
        ]
    };

    const items = menuItems[user.role] || [];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Link to="/" className="logo text-main">Land<span>Market</span></Link>
            </div>

            <nav className="sidebar-nav">
                {items.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/' || item.path === '/admin' || item.path === '/owner' || item.path === '/buyer'}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button
                    className="logout-pill"
                    onClick={logout}
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>

                <div className="sidebar-user">
                    <div className="user-avatar">{user.name.charAt(0)}</div>
                    <div className="user-info">
                        <p className="user-name">{user.name}</p>
                        <p className="user-role">{user.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
