import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Calendar, Clock, User, ShieldCheck, MailCheck, CheckCircle2, XCircle, AlertCircle, Landmark, DollarSign, FileText, X } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import API from '../../api/axios';

const PendingApprovals = () => {
    const [showOwnerModal, setShowOwnerModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedLand, setSelectedLand] = useState(null);
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectReason, setRejectReason] = useState('');

    const fetchPendingLands = async () => {
        try {
            setLoading(true);
            const response = await API.get('/lands');
            // Filter only PENDING lands for this view
            setLands(response.data.filter(l => l.landStatus === 'PENDING'));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching pending lands:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingLands();
    }, []);

    const handleAction = (land, action) => {
        setSelectedLand(land);
        if (action === 'view') setShowOwnerModal(true);
        if (action === 'approve') setShowConfirmModal(true);
        if (action === 'reject') setShowRejectModal(true);
    };

    const handleApprove = async () => {
        try {
            await API.put(`/lands/${selectedLand.id}/approve`);
            setShowConfirmModal(false);
            fetchPendingLands(); // Refresh list
        } catch (error) {
            console.error('Error approving land:', error);
        }
    };

    const handleReject = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/lands/${selectedLand.id}/reject`, null, { params: { reason: rejectReason } });
            setShowRejectModal(false);
            setRejectReason('');
            fetchPendingLands(); // Refresh list
        } catch (error) {
            console.error('Error rejecting land:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-surface/50 p-6 rounded-2xl border border-white/5 backdrop-blur-xl">
                <div>
                    <h1 className="font-outfit text-3xl font-black text-white tracking-tight">Vetting Protocol</h1>
                    <p className="text-muted text-sm mt-1">Acquisition clearance and property validation queue</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                    <Clock size={18} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{lands.length} Awaiting Review</span>
                </div>
            </div>

            <div className="table-container border border-white/5 shadow-2xl">
                <table>
                    <thead>
                        <tr>
                            <th className="py-5">Land Designation</th>
                            <th>Ownership Identity</th>
                            <th>Geographical Domain</th>
                            <th>Commercial Value</th>
                            <th>Vetting State</th>
                            <th className="text-right px-8">Decision Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                                        <p className="text-muted font-black uppercase tracking-[0.2em] text-[10px]">Accessing Vetting Queue...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : lands.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-20 text-center">
                                    <p className="text-muted font-black uppercase tracking-[0.2em] text-[10px]">All protocols clear: No pending validations remaining</p>
                                </td>
                            </tr>
                        ) : (
                            lands.map(land => (
                                <tr key={land.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-lg">
                                                <Landmark size={20} />
                                            </div>
                                            <div className="font-black text-white tracking-tight text-lg">{land.title}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 text-white font-bold">
                                            <User size={14} className="text-muted" /> {land.ownerName}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 text-muted text-xs">
                                            <MapPin size={14} /> {land.location}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1 text-white font-black">
                                            <DollarSign size={14} className="text-success" /> {land.price}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20 bg-amber-500/5 text-amber-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                            {land.landStatus}
                                        </span>
                                    </td>
                                    <td className="px-8 flex justify-end gap-2">
                                        <button
                                            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-all shadow-lg hover:-translate-y-1 group/btn"
                                            title="Audit Owner Details"
                                            onClick={() => handleAction(land, 'view')}
                                        >
                                            <FileText size={18} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                        <button
                                            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-success/20 hover:text-success hover:border-success/40 transition-all shadow-lg hover:-translate-y-1 group/btn"
                                            title="Authorize Listing"
                                            onClick={() => handleAction(land, 'approve')}
                                        >
                                            <CheckCircle2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                        <button
                                            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-error/20 hover:text-error hover:border-error/40 transition-all shadow-lg hover:-translate-y-1 group/btn"
                                            title="Reject Submission"
                                            onClick={() => handleAction(land, 'reject')}
                                        >
                                            <X size={18} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Owner Details Modal */}
            <Modal isOpen={showOwnerModal} onClose={() => setShowOwnerModal(false)} title="Security Audit: Owner Profile">
                {selectedLand && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-6 bg-white/5 p-6 rounded-2xl border border-white/5 shadow-inner">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-2xl shadow-xl">
                                {selectedLand.ownerName.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-white tracking-tight leading-none">{selectedLand.ownerName}</h4>
                                <div className="text-[10px] text-muted flex items-center gap-2 uppercase tracking-[0.2em] font-black mt-2">
                                    <Mail size={12} className="text-primary" /> {selectedLand.ownerEmail || 'Email unverified'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1.5 px-0.5">Cellular Liaison</p>
                                <div className="flex items-center gap-2 text-white font-bold text-sm bg-white/5 p-2 rounded-lg">
                                    <Phone size={14} className="text-primary" /> {selectedLand.ownerPhone || 'N/A'}
                                </div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1.5 px-0.5">Vetting Status</p>
                                <div className="flex items-center gap-2 text-success font-bold text-sm bg-success/5 p-2 px-3 rounded-lg border border-success/10">
                                    <ShieldCheck size={14} /> Verified Legal Entity
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1.5 px-0.5">Registered Identity Domain</p>
                            <div className="flex items-center gap-2 text-muted text-xs bg-white/5 p-3 rounded-lg">
                                <MapPin size={16} className="text-primary" /> {selectedLand.ownerAddress || 'Address details in document'}
                            </div>
                        </div>

                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-3">
                            <p className="text-[9px] font-black text-muted uppercase tracking-widest px-0.5">Administrative Proof</p>
                            <div className="group relative overflow-hidden p-4 bg-gradient-to-br from-primary/5 to-primary/20 rounded-xl border border-primary/20 text-center transition-all hover:border-primary/40">
                                <FileText size={24} className="mx-auto text-primary mb-2 transition-transform group-hover:scale-110" />
                                <span className="text-white text-[10px] font-black uppercase tracking-widest block">Authority_Clearance.pdf</span>
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Reject Modal */}
            <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Security Protocol: Rejection">
                <div className="space-y-6 py-2">
                    <div className="flex items-start gap-4 bg-error/5 p-5 rounded-2xl border border-error/20">
                        <AlertCircle size={24} className="text-error flex-shrink-0" />
                        <div>
                            <p className="text-white font-bold text-sm">Listing Disapproval Mandate</p>
                            <p className="text-error text-[10px] font-black uppercase tracking-widest mt-1">Property: {selectedLand?.title}</p>
                        </div>
                    </div>

                    <form className="space-y-2" onSubmit={handleReject}>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted px-1">Disapproval Justification (Required)</label>
                        <textarea
                            rows="4"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-xs focus:border-error/50 transition-colors"
                            placeholder="Detail non-compliance or document irregularities..."
                            required
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="btn-premium bg-error hover:bg-error/80 w-full py-5 h-auto text-[10px] mt-4"
                        >
                            Execute Disapproval Protocol
                        </button>
                    </form>
                </div>
            </Modal>

            {/* Confirm Approve Modal */}
            <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Security Clearance: Approval">
                <div className="space-y-6 text-center py-4">
                    <div className="mx-auto w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center shadow-2xl shadow-success/20 border border-success/20 relative">
                        <CheckCircle2 size={48} className="relative z-10" />
                        <div className="absolute inset-0 rounded-full border border-success/30 animate-ping opacity-20" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black text-white tracking-tight">Final Authorization</h3>
                        <p className="text-muted text-[10px] px-8 tracking-[0.1em] leading-relaxed uppercase">Confirmed: Identity verified and land ownership documents validated for <br /><strong className="text-white">{selectedLand?.title}</strong>.</p>
                    </div>
                    <div className="flex flex-col gap-3 px-6 pb-2">
                        <button className="btn-premium w-full py-5 text-[10px]" onClick={handleApprove}>Execute Market Activation</button>
                        <button className="btn-outline w-full py-5 text-[10px] opacity-60 hover:opacity-100" onClick={() => setShowConfirmModal(false)}>Abort Authorization</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PendingApprovals;
