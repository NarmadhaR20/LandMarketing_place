import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] public-navbar-fixed nav-glow transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 h-24 flex justify-between items-center">
                <Link to="/" className="text-3xl font-black tracking-[0.2em] text-white uppercase group">
                    Land<span className="text-primary group-hover:text-accent transition-colors">Market</span>
                </Link>

                <nav className="flex items-center gap-12">
                    <NavLink to="/" end className={({ isActive }) => `text-base font-black uppercase tracking-widest transition-colors ${isActive ? 'text-primary' : 'text-muted hover:text-white'}`}>Home</NavLink>
                    {user ? (
                        <div className="flex items-center gap-8">
                            <Link to={`/${user.role?.toLowerCase()}`} className="text-sm font-black uppercase tracking-widest text-primary hover:text-white transition-all underline-offset-8 hover:underline italic font-bold">Dashboard</Link>

                            <div className="flex items-center gap-6 pl-8 border-l border-white/10">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted leading-none mb-1.5">Signed in as</p>
                                    <p className="text-sm font-black text-white leading-none uppercase tracking-tight">{user.name || user.username}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-12 h-12 flex items-center justify-center bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10 group/logout"
                                    title="Logout"
                                >
                                    <LogOut size={20} className="group-hover/logout:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-10">
                            <Link to="/login" className="text-sm font-black uppercase tracking-widest text-primary hover:text-white transition-all font-bold">Login</Link>
                            <Link to="/register" className="btn-premium px-10 py-4 shadow-2xl shadow-primary/20">Get Started</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
