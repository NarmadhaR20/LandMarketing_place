import React, { useState, useEffect } from 'react';
import {
    MapPin,
    Info,
    Edit3,
    Trash2,
    Layers,
    DollarSign,
    Maximize,
    ChevronRight,
    Loader2,
    Plus,
    CheckCircle2,
    AlertCircle,
    Home,
    Map,
    IndianRupee
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const MyListings = () => {
    const navigate = useNavigate();
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyLands = async () => {
        try {
            setLoading(true);
            const response = await API.get('/lands/my-lands');
            setListings(response.data);
        } catch (error) {
            console.error('Error fetching my lands:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyLands();
    }, []);

    const handleShowReason = (listing) => {
        setSelectedListing(listing);
        setShowReasonModal(true);
    };

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'AVAILABLE':
                return {
                    bg: 'bg-emerald-500/10',
                    text: 'text-emerald-400',
                    border: 'border-emerald-500/20',
                    label: 'Approved'
                };
            case 'UNDER_CONTRACT':
            case 'SOLD':
                return {
                    bg: 'bg-indigo-500/10',
                    text: 'text-indigo-400',
                    border: 'border-indigo-500/20',
                    label: 'Confirmed Interest'
                };
            case 'REJECTED':
                return {
                    bg: 'bg-rose-500/10',
                    text: 'text-rose-400',
                    border: 'border-rose-500/20',
                    label: 'Rejected'
                };
            case 'OFF_MARKET':
                return {
                    bg: 'bg-blue-500/10',
                    text: 'text-blue-400',
                    border: 'border-blue-500/20',
                    label: 'Off Market'
                };
            default:
                return {
                    bg: 'bg-amber-500/10',
                    text: 'text-amber-400',
                    border: 'border-amber-500/20',
                    label: 'Pending'
                };
        }
    };

    const getLandImage = (type) => {
        switch (type?.toUpperCase()) {
            case 'AGRICULTURAL': return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop';
            case 'COMMERCIAL': return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop';
            case 'RESIDENTIAL': return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop';
            case 'INDUSTRIAL': return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop';
            default: return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted font-black uppercase tracking-widest text-sm">Synchronizing Listings...</p>
            </div>
        );
    }

    return (
        <div className="pb-10">
            <div className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-black mb-1 tracking-tight text-white">My Land Listings</h1>
                    <p className="text-muted text-base font-medium">Manage your properties and track approval status</p>
                </div>
                <button
                    type="button"
                    onClick={() => navigate('/owner/add')}
                    className="btn-premium btn-premium-lg shadow-2xl shadow-primary/30 group active:scale-95"
                >
                    <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span className="text-white font-black text-sm uppercase tracking-wide">Add Land</span>
                </button>
            </div>

            {listings.length === 0 ? (
                <div className="p-20 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center glass-effect shadow-2xl">
                    <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center mb-8 text-muted shadow-inner">
                        <Layers size={48} />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">Portfolio is Empty</h3>
                    <p className="text-muted mb-10 max-w-sm text-lg leading-relaxed">Start your journey by listing your first property on the marketplace to reach verified buyers.</p>
                    <button
                        onClick={() => navigate('/owner/add-land')}
                        className="bg-success-solid hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] text-sm px-14 py-6 rounded-2xl shadow-2xl shadow-emerald-500/40 transition-all flex items-center gap-4 active:scale-95 border-none"
                        style={{ background: '#10b981' }}
                    >
                        Create First Listing <ChevronRight size={22} strokeWidth={3} />
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xxl:grid-cols-3 gap-8">
                    {listings.map(listing => {
                        const style = getStatusStyle(listing.landStatus);
                        const isApproved = listing.landStatus?.toUpperCase() === 'AVAILABLE';
                        const isBooked = listing.landStatus?.toUpperCase() === 'UNDER_CONTRACT' || listing.landStatus?.toUpperCase() === 'SOLD';
                        const isRejected = listing.landStatus?.toUpperCase() === 'REJECTED';

                        return (
                            <div
                                key={listing.id}
                                className={`card glass-effect group hover:border-white/10 transition-all duration-500 overflow-hidden flex flex-col border-white/5 shadow-2xl scale-100 hover:scale-[1.02] ${isApproved ? 'shadow-[0_0_40px_rgba(16,185,129,0.1)] border-emerald-500/20' :
                                    isBooked ? 'shadow-[0_0_40px_rgba(99,102,241,0.1)] border-indigo-500/20' :
                                        isRejected ? 'shadow-[0_0_40px_rgba(244,63,94,0.1)] border-rose-500/20' : ''
                                    }`}
                            >
                                {/* Header Image */}
                                <div className="h-48 relative flex items-center justify-center overflow-hidden bg-deep">
                                    <img
                                        src={listing.image || getLandImage(listing.landType)}
                                        alt={listing.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-transparent"></div>

                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${style.bg} ${style.text} border ${style.border} backdrop-blur-md z-20`}>
                                        {style.label}
                                    </div>
                                    <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 z-20">
                                        <AlertCircle size={14} className="text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-white/90">{listing.landType || 'Agricultural'}</span>
                                    </div>
                                </div>

                                <div className="p-10 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-primary transition-colors line-clamp-1">{listing.title}</h3>

                                    <div className="space-y-5 mb-10">
                                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-primary/20 transition-colors">
                                            <div className="p-2.5 bg-primary/10 rounded-xl text-primary mt-1"><Map size={18} /></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[9px] uppercase font-black tracking-widest text-muted/60 mb-1">Region & Address</p>
                                                <p className="text-sm font-bold text-white truncate">{listing.location}</p>
                                                <p className="text-xs font-medium text-muted line-clamp-2 mt-1">{listing.address || 'Address not provided'}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] uppercase font-black tracking-widest text-muted/60">Listed Price</span>
                                                <div className="flex items-center gap-1 text-white font-black">
                                                    <IndianRupee size={14} className="text-primary" />
                                                    <span className="text-xl">{Number(listing.price).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] uppercase font-black tracking-widest text-muted/60">Property Area</span>
                                                <div className="flex items-center gap-1 text-white font-black">
                                                    <Maximize size={14} className="text-success" />
                                                    <span className="text-xl">{listing.area} <span className="text-[10px] font-medium text-muted px-1">Acre</span></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                        {isRejected && (
                                            <button
                                                onClick={() => handleShowReason(listing)}
                                                className="flex items-center gap-2 text-[10px] font-black uppercase text-error px-4 py-2.5 rounded-xl border border-error/50 bg-error/10 hover:bg-error/20 transition-all shadow-lg"
                                            >
                                                <Info size={14} /> Rejection Reason
                                            </button>
                                        )}

                                        <div className="flex gap-3 ml-auto">
                                            {(listing.landStatus?.toUpperCase() === 'PENDING' || listing.landStatus?.toUpperCase() === 'REJECTED' || listing.landStatus?.toUpperCase() === 'OFF_MARKET') && (
                                                <>
                                                    <button
                                                        onClick={() => navigate(`/owner/edit-land/${listing.id}`)}
                                                        className="p-3 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all border border-blue-500/40 shadow-md hover:shadow-lg hover:shadow-blue-500/20"
                                                        title="Edit and Re-submit"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Are you sure you want to delete this listing?')) {
                                                                API.delete(`/lands/${listing.id}`)
                                                                    .then(() => {
                                                                        setListings(listings.filter(l => l.id !== listing.id));
                                                                    })
                                                                    .catch(err => console.error('Error deleting listing:', err));
                                                            }
                                                        }}
                                                        className="p-3 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-all border border-rose-500/40 shadow-md hover:shadow-lg hover:shadow-rose-500/20"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                            {listing.landStatus?.toUpperCase() === 'AVAILABLE' && (
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Updating this listing will take it offline for re-approval. Proceed?')) {
                                                                navigate(`/owner/edit-land/${listing.id}`);
                                                            }
                                                        }}
                                                        className="p-3 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all border border-amber-500/20"
                                                        title="Update Resource"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                </div>
                                            )}
                                            {listing.landStatus?.toUpperCase() === 'UNDER_CONTRACT' && (
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                                                        <CheckCircle2 size={14} className="text-indigo-500" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500/60">Secure Locked</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal isOpen={showReasonModal} onClose={() => setShowReasonModal(false)} title="Audit Feedback">
                {selectedListing && (
                    <div className="space-y-6">
                        <div className="p-2 relative overflow-hidden">
                            <p className="text-xs font-black uppercase text-rose-500 tracking-widest mb-4">Official Notice:</p>
                            <p className="text-xl font-black text-rose-500 italic leading-relaxed">
                                "{selectedListing.rejectionReason || 'No specific reason provided. Please contact support.'}"
                            </p>
                        </div>
                        <p className="text-sm text-muted px-2">
                            Our team has flagged issues with the documentation of this listing. You can provide stronger details and update the land info for re-approval.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <button className="btn-secondary flex-1 py-4 text-xs" onClick={() => setShowReasonModal(false)}>Acknowledge</button>
                            <button
                                className="btn-primary flex-1 py-4 text-xs bg-indigo-500 hover:bg-indigo-600 shadow-indigo-900/20 border-none"
                                onClick={() => {
                                    setShowReasonModal(false);
                                    navigate(`/owner/edit-land/${selectedListing.id}`);
                                }}
                            >
                                Edit & Resolve
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MyListings;
