import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Ruler, Tag, ShieldCheck, Phone, Mail, ArrowLeft, ShieldAlert, AlertCircle } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Modal from '../../components/ui/Modal';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const LandDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [land, setLand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reporting, setReporting] = useState(false);
    const [bookingStatus, setBookingStatus] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        const fetchLandAndBooking = async () => {
            try {
                setLoading(true);
                const [landRes, bookingsRes] = await Promise.all([
                    API.get(`/lands/${id}`),
                    user?.role === 'buyer' ? API.get('/bookings/my-bookings') : Promise.resolve({ data: [] })
                ]);

                setLand(landRes.data);

                if (user?.role === 'buyer') {
                    const existingBooking = (bookingsRes.data || []).find(b => b.landId === parseInt(id));
                    if (existingBooking) {
                        setBookingStatus(existingBooking.status);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchLandAndBooking();
    }, [id, user]);

    const handleBooking = async () => {
        if (!user || user.role !== 'buyer') {
            alert('Please login as a buyer to book land.');
            return;
        }

        try {
            setBookingLoading(true);
            await API.post(`/bookings/land/${id}`, { message: 'Interested in this property.' });
            setBookingStatus('PENDING');
            setBookingLoading(false);
            alert('Your interest request has been sent to the owner.');
        } catch (error) {
            console.error('Error booking land:', error);
            setBookingLoading(false);
            alert(error.response?.data?.message || 'Failed to send interest request.');
        }
    };

    const handleReport = async (e) => {
        e.preventDefault();
        if (!user || user.role !== 'buyer') return;

        try {
            setReporting(true);
            await API.post(`/reports/buyer/${user.id}/land/${id}`, { reason: reportReason });
            setShowReportModal(false);
            setReportReason('');
            setReporting(false);
            alert('Report submitted successfully. Our safety team will review it.');
        } catch (error) {
            console.error('Error submitting report:', error);
            setReporting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-deep flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-muted font-black uppercase tracking-[0.4em] text-xs">Retrieving Asset Intelligence...</p>
                </div>
            </div>
        );
    }

    if (!land) {
        return (
            <div className="min-h-screen bg-deep flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-white">Asset Not Found</h2>
                    <Link to="/buyer/lands" className="btn-premium">Back to Inventory</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-deep">
            <Navbar />

            <main className="max-w-6xl mx-auto p-6 md:p-12">
                <Link
                    to={user?.role === 'buyer' ? "/buyer/lands" : "/"}
                    className="group inline-flex items-center gap-3 text-muted hover:text-primary mb-10 transition-all font-black uppercase tracking-[0.2em] text-[10px]"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Return to Asset Inventory
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Details & Map */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="card p-0 overflow-hidden border-white/5 shadow-2xl">
                            <div className="relative group/img" style={{ height: '400px' }}>
                                <img
                                    src={land.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop'}
                                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover/img:scale-110"
                                    alt={land.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-transparent opacity-80" />
                                <div className="absolute top-8 left-8 flex gap-3">
                                    <div className="bg-primary/90 backdrop-blur-xl text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                                        FOR SALE
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-xl text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-white/20">
                                        {land.landType}
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h1 className="text-4xl font-bold font-outfit mb-2">{land.title}</h1>
                                        <p className="text-muted flex items-center gap-2 text-lg"><MapPin size={20} className="text-primary" /> {land.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-primary">₹{land.price}</p>
                                        <p className="text-muted text-sm">Financing Available</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 py-6 border-y border-border mb-8">
                                    <div className="text-center">
                                        <p className="text-muted text-xs uppercase mb-1">Total Area</p>
                                        <p className="font-bold flex items-center justify-center gap-2"><Ruler size={16} /> {land.area} {land.areaUnit}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-muted text-xs uppercase mb-1">Land Category</p>
                                        <p className="font-bold flex items-center justify-center gap-2"><Tag size={16} /> {land.landType}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-muted text-xs uppercase mb-1">Availability</p>
                                        <p className="font-bold text-success">Immediate</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">About this Property</h3>
                                    <p className="text-muted leading-relaxed">{land.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div className="card">
                            <h3 className="text-xl font-bold mb-4">Location Map</h3>
                            <div style={{
                                height: '350px',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div className="text-center">
                                    <MapPin size={48} className="text-primary/40 mb-3 mx-auto" />
                                    <p className="text-muted">Interactive Google Maps Widget</p>
                                    <p className="text-[10px] text-muted/60 mt-1">Coordinates: 39.1911° N, 106.8175° W</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Owner & Action */}
                    <div className="space-y-6">
                        <div className="card border-white/5 bg-surface/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group/owner">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl transition-all group-hover/owner:bg-primary/20" />

                            <div className="relative z-10 px-4 py-2">
                                {land.landStatus === 'AVAILABLE' ? (
                                    <div className="flex items-center justify-center gap-2 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] mb-8 bg-emerald-500/5 py-2 rounded-lg border border-emerald-500/10">
                                        <ShieldCheck size={14} /> Identity Verified Asset
                                    </div>
                                ) : null}

                                <div className="relative mb-6">
                                    <div className="w-24 h-24 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-4xl font-black mx-auto shadow-2xl group-hover/owner:scale-105 transition-transform">
                                        {land.ownerName?.charAt(0) || 'O'}
                                    </div>
                                    <div className="absolute bottom-1 right-[calc(50%-40px)] w-6 h-6 bg-emerald-500 rounded-full border-4 border-deep flex items-center justify-center">
                                        <ShieldCheck size={12} className="text-white" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-1 tracking-tight">{land.ownerName || 'Verified Owner'}</h3>
                                <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-10">Exclusive Asset Provider</p>

                                <button
                                    className={`btn-premium btn-premium-lg w-full flex items-center justify-center gap-3 py-5 rounded-2xl group/btn ${bookingStatus || land.landStatus !== 'AVAILABLE' ? 'opacity-80 cursor-not-allowed !from-surface !to-surface border-white/10' : ''}`}
                                    onClick={handleBooking}
                                    disabled={bookingLoading || !!bookingStatus || land.landStatus !== 'AVAILABLE'}
                                >
                                    {bookingLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : land.landStatus !== 'AVAILABLE' ? (
                                        <>
                                            <AlertCircle size={18} className="text-amber-500" />
                                            <span>Awaiting Approval</span>
                                        </>
                                    ) : bookingStatus ? (
                                        <>
                                            <ShieldCheck size={18} className="text-emerald-400" />
                                            <span>Interest Submitted</span>
                                        </>
                                    ) : (
                                        <>
                                            <Mail size={18} className="group-hover/btn:scale-110 transition-transform" />
                                            <span>Secure Engagement</span>
                                        </>
                                    )}
                                </button>

                                <div className="mt-8 pt-8 border-t border-white/5 space-y-5">
                                    <div className="space-y-3">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted text-center italic">Communication Portal</p>
                                        <div className="flex flex-col gap-2">
                                            <a href={`tel:${land.ownerPhone}`} className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white hover:border-primary/40 hover:bg-white/10 transition-all flex items-center justify-center gap-3 font-bold group/contact">
                                                <Phone size={16} className="text-primary group-contact:scale-110" />
                                                <span className="text-sm tracking-tight">{land.ownerPhone || 'Direct Dial Restricted'}</span>
                                            </a>
                                            <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white flex items-center justify-center gap-3 font-bold">
                                                <Mail size={16} className="text-primary" />
                                                <span className="text-sm tracking-tight">{land.ownerEmail || 'Email Channel Encrypted'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {user?.role === 'buyer' && (
                                        <button
                                            onClick={() => setShowReportModal(true)}
                                            className="w-full mt-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-error bg-error/5 border border-error/20 hover:bg-error/10 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <ShieldAlert size={14} /> Report Malfunction
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="card bg-primary/5 border-primary/20">
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                                <ShieldCheck size={18} className="text-primary" /> Why buy with us?
                            </h4>
                            <ul className="text-sm text-muted space-y-3 text-left">
                                <li className="flex items-start gap-2">• Legally verified land documents</li>
                                <li className="flex items-start gap-2">• Direct communication with owners</li>
                                <li className="flex items-start gap-2">• Transparent pricing and history</li>
                                <li className="flex items-start gap-2">• Secure transaction assistance</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main >

            <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Report Listing: Platform Integrity">
                <form className="space-y-6" onSubmit={handleReport}>
                    <div className="bg-error/5 p-4 rounded-xl border border-error/20 flex gap-4">
                        <AlertCircle className="text-error flex-shrink-0" size={24} />
                        <div>
                            <p className="text-white font-bold text-sm">Community Safety Protocol</p>
                            <p className="text-error text-[10px] font-black uppercase tracking-widest mt-1">Reporting: {land.title}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted px-1">Reason for Report (Required)</label>
                        <textarea
                            rows="4"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-xs focus:border-error/50 transition-colors"
                            placeholder="Please describe why you are reporting this listing (e.g., misleading info, fraudulent documents...)"
                            required
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={reporting}
                        className="btn-premium bg-error hover:bg-error/80 w-full py-4 text-[10px] uppercase font-black tracking-widest disabled:opacity-50"
                    >
                        {reporting ? 'Submitting Report...' : 'Finalize Submission'}
                    </button>
                </form>
            </Modal>
        </div >
    );
};

export default LandDetails;
