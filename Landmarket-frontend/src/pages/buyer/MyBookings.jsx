import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { Phone, Mail, MapPin, Calendar, User, ShieldCheck, ExternalLink, MessageSquare } from 'lucide-react';
import API from '../../api/axios';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showContactModal, setShowContactModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await API.get('/bookings/my-bookings');
            setBookings(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleContact = (booking) => {
        setSelectedBooking(booking);
        setShowContactModal(true);
    };

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'APPROVED':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'PENDING':
                return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'REJECTED':
                return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'CANCELLED':
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black font-outfit mb-2 tracking-tight">Land <span className="gradient-primary">Engagements</span></h1>
                    <p className="text-muted font-medium">Track your property interests and secure owner commitments</p>
                </div>
            </div>

            <div className="card p-0 overflow-hidden border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Land Assets</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Authority</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Current Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Timeline</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Interactions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                            <p className="text-muted font-black uppercase tracking-[0.2em] text-[10px]">Retrieving Asset Commitments...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-muted text-xs font-black uppercase tracking-widest italic">
                                        No active engagements found in the registry
                                    </td>
                                </tr>
                            ) : (
                                bookings.map(booking => (
                                    <tr key={booking.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <MapPin size={18} />
                                                </div>
                                                <span className="font-bold text-white group-hover:text-primary transition-colors">{booking.landTitle || 'Unknown Asset'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                                                <User size={14} className="text-muted" />
                                                {booking.ownerName || 'Verified Owner'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-muted text-sm font-medium">
                                                <Calendar size={14} />
                                                {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) : new Date().toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {booking.status?.toUpperCase() === 'APPROVED' || booking.status?.toUpperCase() === 'CONFIRMED' ? (
                                                <button
                                                    className="btn-premium w-auto inline-flex px-4 py-2 text-[10px]"
                                                    onClick={() => handleContact(booking)}
                                                >
                                                    <MessageSquare size={14} className="mr-2" />
                                                    Contact Owner
                                                </button>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted/40 italic">Locked</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title="Security Protocol: Owner Contact">
                {selectedBooking && (
                    <div className="space-y-6 no-scrollbar">
                        <div className="relative p-7 rounded-[2rem] bg-gradient-to-br from-primary/30 via-primary/5 to-transparent border border-white/10 overflow-hidden text-center shadow-inner">
                            <div className="absolute top-0 right-0 p-6 opacity-5 z-0 pointer-events-none" style={{ opacity: 0.05 }}>
                                <ShieldCheck size={80} className="text-primary" />
                            </div>
                            <div className="w-20 h-20 bg-surface rounded-full mx-auto mb-4 border-4 border-primary/40 flex items-center justify-center text-3xl font-black text-white shadow-2xl relative z-10">
                                {selectedBooking.ownerName?.charAt(0) || 'O'}
                            </div>
                            <h3 className="text-xl font-black text-white tracking-tight relative z-10">{selectedBooking.ownerName || 'Verified Owner'}</h3>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-full text-[9px] font-black uppercase tracking-widest border border-success/20 mt-3 relative z-10">
                                <ShieldCheck size={12} /> Identity Verified
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <div className="group p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/40 transition-all flex items-center gap-5 hover:bg-white/[0.08]">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                                    <Phone size={22} strokeWidth={2.5} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] text-muted font-black uppercase tracking-[0.2em] mb-0.5">Direct Line</p>
                                    <p className="text-lg font-black text-white tracking-tight">{selectedBooking.ownerPhone || 'Direct Dial Restricted'}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                    <ExternalLink size={14} />
                                </div>
                            </div>

                            <div className="group p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-indigo-500/40 transition-all flex items-center gap-4 hover:bg-white/[0.08]">
                                <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                                    <Mail size={18} />
                                </div>
                                <div className="flex-1 truncate">
                                    <p className="text-[9px] text-muted font-black uppercase tracking-[0.2em] mb-0.5">E-Mail</p>
                                    <p className="text-xs font-bold text-white truncate">{selectedBooking.ownerEmail || 'Email Channel Encrypted'}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            className="btn-premium btn-premium-lg w-full mt-2"
                            onClick={() => setShowContactModal(false)}
                        >
                            Acknowledge Documentation
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MyBookings;
