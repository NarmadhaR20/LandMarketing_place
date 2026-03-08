import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

const DashboardHeader = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <header className="flex justify-between items-center mb-10 px-2">
            <div>
                {/* Space for breadcrumbs or title if needed later */}
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted leading-none mb-1.5">WELCOME {user.role}</p>
                    <p className="text-sm font-black text-primary leading-none uppercase">{user.name || user.username}</p>
                </div>
                <button
                    onClick={logout}
                    className="w-12 h-12 flex items-center justify-center bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10 group"
                    title="Logout"
                >
                    <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </header>
    );
};

export default DashboardHeader;
