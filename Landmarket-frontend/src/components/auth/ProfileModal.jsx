import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from '../ui/Modal';
import { useAuth } from '../../context/AuthContext';

const ProfileModal = () => {
    const { user, isProfileComplete } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Hide if no user, profile complete, admin, or already on the profile page
    if (!user || isProfileComplete || user.role === 'admin' || location.pathname.endsWith('/profile')) return null;

    const handleGoToProfile = () => {
        navigate(`/${user.role}/profile`);
    };

    return (
        <Modal
            isOpen={true}
            onClose={() => { }} // Keep open until redirection
            title="Complete Your Profile"
        >
            <div className="text-center p-4">
                <p className="mb-6 text-muted">
                    Welcome! Please complete your profile details to unlock all features of the Land Marketplace.
                </p>
                <button
                    onClick={handleGoToProfile}
                    className="btn-primary"
                >
                    Update My Profile
                </button>
            </div>
        </Modal>
    );
};

export default ProfileModal;
