import React, { useState, useEffect } from 'react';
import {
    Clock,
    CheckCircle2,
    XCircle,
    User,
    MapPin,
    MessageSquare,
    Check,
    X,
    ChevronRight,
    Loader2
} from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const BookingRequests = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await API.get('/bookings/owner-requests');
            // Map backend statuses to simple lowercase for UI logic
            const mapped = response.data.map(b => ({
                ...b,
                id: b.id,
                buyer: b.buyerName || 'Unknown Buyer',
                land: b.landTitle || 'Unknown Land',
                message: b.message || 'No message provided',
                status: b.status.toLowerCase() === 'confirmed' ? 'approved' : b.status.toLowerCase(),
                date: formatDate(b.createdAt)
            }));
            setBookings(mapped);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateDemo = async () => {
        try {
            setGenerating(true);
            await API.post('/bookings/generate-demo-data');
            await fetchBookings();
        } catch (error) {
            console.error('Error generating demo data:', error);
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Just now';
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);

            if (diffInSeconds < 60) return 'Just now';
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
            const diffInHours = Math.floor(diffInMinutes / 60);
            if (diffInHours < 24) return `${diffInHours} hours ago`;
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays === 1) return 'Yesterday';
            return `${diffInDays} days ago`;
        } catch (e) {
            return 'Recently';
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const endpoint = newStatus === 'approved' ? 'approve' : 'reject';
            await API.put(`/bookings/${id}/${endpoint}`);
            // Optimistic update
            setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error(`Error updating status to ${newStatus}:`, error);
        }
    };

    const StatusSection = ({ title, status, icon: Icon, colorClass, accentColor }) => {
        const filtered = bookings.filter(b => b.status === status);

        return (
            <div className="flex-1 w-full" style={{ minWidth: '450px' }}>
                <div className="flex items-center gap-3 mb-10 px-4">
                    <div className={`p-2.5 rounded-xl ${colorClass} bg-opacity-10 shadow-sm`}>
                        <Icon size={22} className={colorClass.replace('bg-', 'text-')} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight uppercase text-white/90 leading-none mb-1">{title}</h2>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Total: {filtered.length}</p>
                    </div>
                </div>

                <div className="space-y-16 flex flex-col">
                    {filtered.length === 0 ? (
                        <div className="p-20 border-2 border-dashed border-border/30 rounded-3xl flex flex-col items-center justify-center text-center opacity-30 grayscale">
                            <Icon size={40} className="mb-4" />
                            <p className="text-sm font-bold uppercase tracking-wider">No {title.toLowerCase()} requests</p>
                        </div>
                    ) : (
                        filtered.map(booking => (
                            <div key={booking.id} className="card glass-effect relative overflow-hidden group border-white/5 hover:border-white/10 transition-all duration-500 shadow-2xl" style={{ padding: '0', marginBottom: '2rem' }}>
                                {/* Left Accent Border */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-[10px]"
                                    style={{ backgroundColor: accentColor }}
                                ></div>

                                <div className="p-12 pb-11 pl-16">
                                    {/* Top Row: Title & Status Badge */}
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="text-4xl font-black text-white tracking-tight mb-3 group-hover:text-primary transition-colors">{booking.land}</h3>
                                            <div className="flex items-center gap-2 text-muted">
                                                <Clock size={12} />
                                                <span className="text-[11px] font-black uppercase tracking-widest">{booking.date}</span>
                                            </div>
                                        </div>

                                        <div
                                            className="px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.15em] shadow-sm border"
                                            style={{
                                                backgroundColor: `${accentColor}15`,
                                                color: accentColor,
                                                borderColor: `${accentColor}30`
                                            }}
                                        >
                                            {status}
                                        </div>
                                    </div>

                                    {/* Middle Row: Horizontal Info List */}
                                    <div className="flex flex-wrap gap-x-12 gap-y-4 mb-10 pb-8 border-b border-white/[0.03]">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-white/5 rounded-xl text-muted">
                                                <User size={18} />
                                            </div>
                                            <span className="text-lg font-black text-white">{booking.buyer}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-white/5 rounded-xl text-muted">
                                                <MapPin size={18} />
                                            </div>
                                            <span className="text-lg font-black text-white">Main City Area</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-white/5 rounded-xl text-muted">
                                                <MessageSquare size={18} />
                                            </div>
                                            <span className="text-lg font-bold text-white/60">"{booking.message}"</span>
                                        </div>
                                    </div>

                                    {/* Bottom Row: Actions */}
                                    {status === 'pending' && (
                                        <div className="flex gap-6 justify-end pt-4">
                                            <button
                                                onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                                className="px-10 py-4.5 rounded-2xl bg-[#ef4444] text-white text-[12px] font-black uppercase tracking-widest hover:brightness-110 shadow-xl shadow-red-900/40 transition-all duration-300 flex items-center gap-3 min-h-[56px]"
                                                style={{ backgroundColor: '#ef4444' }}
                                            >
                                                <X size={18} /> Reject Request
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(booking.id, 'approved')}
                                                className="px-12 py-4.5 rounded-2xl bg-[#10b981] text-white text-[12px] font-black uppercase tracking-widest hover:brightness-110 shadow-xl shadow-emerald-900/40 transition-all duration-300 flex items-center gap-3 min-h-[56px]"
                                                style={{ backgroundColor: '#10b981' }}
                                            >
                                                <Check size={18} /> Approve Interest
                                            </button>
                                        </div>
                                    )}

                                    {status === 'approved' && (
                                        <div className="flex items-center gap-5 text-emerald-400 text-xs font-black uppercase tracking-[0.25em] bg-[#10b98115] py-5 px-10 rounded-2xl border border-[#10b98130] min-h-[60px] justify-center">
                                            <div className="w-10 h-10 rounded-full bg-[#10b98120] flex items-center justify-center text-emerald-400">
                                                <CheckCircle2 size={20} />
                                            </div>
                                            Documentation Pending for {booking.buyer}
                                        </div>
                                    )}

                                    {status === 'rejected' && (
                                        <div className="flex items-center gap-5 text-rose-400 text-xs font-black uppercase tracking-[0.25em] bg-[#ef444415] py-5 px-10 rounded-2xl border border-[#ef444430] min-h-[60px] justify-center">
                                            <div className="w-10 h-10 rounded-full bg-[#ef444420] flex items-center justify-center text-rose-400">
                                                <XCircle size={20} />
                                            </div>
                                            Request Denied by Owner
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted font-bold uppercase tracking-widest">Loading Live Requests...</p>
            </div>
        );
    }

    return (
        <div className="pb-10">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-black mb-1 tracking-tight">Booking Requests</h1>
                    <p className="text-muted text-base font-medium">Manage and verify incoming purchase interests</p>
                </div>
                <div className="flex items-center gap-4">
                    {bookings.length === 0 && (
                        <button
                            onClick={handleGenerateDemo}
                            disabled={generating}
                            className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-5 py-2.5 rounded-xl flex items-center gap-3 border border-white/10 transition-all text-xs font-black uppercase tracking-widest disabled:opacity-50"
                        >
                            {generating ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
                            Generate Demo Requests
                        </button>
                    )}
                    <div className="bg-primary/5 px-5 py-2.5 rounded-xl flex items-center gap-4 border border-primary/20">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                        <span className="text-xs font-black text-primary uppercase tracking-widest">Live Updates</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-16 items-start">
                <StatusSection
                    title="Pending"
                    status="pending"
                    icon={Clock}
                    colorClass="bg-warning text-warning"
                    accentColor="#f59e0b"
                />
                <StatusSection
                    title="Approved"
                    status="approved"
                    icon={CheckCircle2}
                    colorClass="bg-success text-success"
                    accentColor="#10b981"
                />
                <StatusSection
                    title="Rejected"
                    status="rejected"
                    icon={XCircle}
                    colorClass="bg-error text-error"
                    accentColor="#ef4444"
                />
            </div>
        </div>
    );
};

export default BookingRequests;
