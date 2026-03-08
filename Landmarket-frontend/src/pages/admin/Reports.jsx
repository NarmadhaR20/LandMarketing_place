import React, { useState, useEffect } from 'react';
import { AlertCircle, User, MessageSquare, CheckCircle2, ShieldAlert, Search, XCircle, Info, Hammer } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import API from '../../api/axios';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [resolutionData, setResolutionData] = useState({
        action: 'Warning',
        comments: ''
    });

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await API.get('/reports');
            setReports(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const activeCases = reports.filter(r => r.status === 'OPEN').length;

    const handleOpenResolve = (report) => {
        setSelectedReport(report);
        setShowResolveModal(true);
    };

    const handleExecuteResolution = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/reports/${selectedReport.id}/resolve`, {
                action: resolutionData.action,
                comments: resolutionData.comments
            });
            setShowResolveModal(false);
            setSelectedReport(null);
            setResolutionData({ action: 'Warning', comments: '' });
            fetchReports();
        } catch (error) {
            console.error('Error resolving report:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-surface/50 p-6 rounded-2xl border border-white/5 backdrop-blur-xl">
                <div>
                    <h1 className="font-outfit text-3xl font-black text-white tracking-tight">Case Management</h1>
                    <p className="text-muted text-sm mt-1">Resolution protocol for platform integrity reports</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-error/5 border border-error/20 rounded-xl">
                    <ShieldAlert size={18} className="text-error" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-error">
                        {activeCases} {activeCases === 1 ? 'Active Case' : 'Active Cases'}
                    </span>
                </div>
            </div>

            <div className="table-container border border-white/5 shadow-2xl">
                <table>
                    <thead>
                        <tr>
                            <th className="py-5">Target Asset</th>
                            <th>Reporting Identity</th>
                            <th>Violation Details</th>
                            <th>Lifecycle Status</th>
                            <th className="text-right px-8">Resolution</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-error/30 border-t-error rounded-full animate-spin" />
                                        <p className="text-muted font-black uppercase tracking-[0.2em] text-[10px]">Accessing Platform Integrity Records...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : reports.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-20 text-center">
                                    <p className="text-muted font-black uppercase tracking-[0.2em] text-[10px]">System Clean: No active reports in the ledger</p>
                                </td>
                            </tr>
                        ) : (
                            reports.map(report => (
                                <tr key={report.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl border shadow-lg ${report.status === 'OPEN' ? 'bg-error/10 text-error border-error/20' : 'bg-success/10 text-success border-success/20'}`}>
                                                {report.status === 'OPEN' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                                            </div>
                                            <div>
                                                <div className="font-black text-white tracking-tight text-lg">{report.land?.title || 'Unknown Asset'}</div>
                                                <div className="text-[10px] text-muted uppercase tracking-tighter">Report ID: #{report.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 text-white font-bold">
                                            <User size={14} className="text-muted" /> {report.reportedBy?.name || 'Anonymous'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-start gap-2 text-muted text-xs italic bg-white/5 p-3 rounded-xl border border-white/5 max-w-xs">
                                            <MessageSquare size={14} className="mt-0.5 flex-shrink-0" />
                                            "{report.reason}"
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${report.status === 'OPEN'
                                            ? 'border-amber-500/20 bg-amber-500/5 text-amber-500'
                                            : 'border-success/20 bg-success/5 text-success'
                                            }`}>
                                            {report.status === 'OPEN' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-8 text-right">
                                        {report.status === 'OPEN' ? (
                                            <button
                                                onClick={() => handleOpenResolve(report)}
                                                className="btn-premium group py-2 h-auto text-[9px]"
                                            >
                                                <CheckCircle2 size={16} className="mr-2 group-hover:scale-125 transition-transform" />
                                                Execute Resolution
                                            </button>
                                        ) : (
                                            <div className="text-muted text-[10px] font-black uppercase tracking-widest flex items-center justify-end gap-2">
                                                <ShieldAlert size={14} className="text-success" />
                                                Case Closed
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showResolveModal} onClose={() => setShowResolveModal(false)} title="Security Protocol: Case Resolution">
                <form className="space-y-6 p-6" onSubmit={handleExecuteResolution}>
                    {selectedReport && (
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                            <div className="flex flex-col items-center text-center gap-3 mb-6">
                                <div className="p-3 bg-error/10 text-error rounded-xl border border-error/20 shadow-inner flex shrink-0 mb-1">
                                    <AlertCircle size={28} />
                                </div>
                                <div>
                                    <div className="text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">Target Asset Entity</div>
                                    <div className="text-white font-black text-2xl tracking-tight leading-none">{selectedReport.land?.title || 'Unknown'}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5 text-center">
                                <div className="space-y-2">
                                    <div className="text-muted text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                        <User size={14} className="text-primary" /> Petitioner Identity
                                    </div>
                                    <div className="text-white font-bold text-lg">{selectedReport.reportedBy?.name || 'Anonymous'}</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-muted text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                        <Info size={14} className="text-primary" /> Violation Claim
                                    </div>
                                    <div className="text-white font-medium italic text-lg leading-snug text-muted/90">"{selectedReport.reason}"</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-12">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted flex items-center gap-2">
                                <Hammer size={16} className="text-primary" /> Determination Action
                            </label>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                                <select
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary/50 focus:bg-white/10 transition-all appearance-none outline-none"
                                    value={resolutionData.action}
                                    onChange={(e) => setResolutionData({ ...resolutionData, action: e.target.value })}
                                >
                                    <option className="bg-deep" value="Dismissal">Dismiss Case (Unfounded)</option>
                                    <option className="bg-deep" value="Warning">Issue Formal Warning</option>
                                    <option className="bg-deep" value="Suspension">Suspend Listing (Temporary)</option>
                                    <option className="bg-deep" value="Revocation">Revoke Listing (Permanent)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted flex items-center gap-2">
                                <MessageSquare size={16} className="text-primary" /> Resolution Commentary
                            </label>
                            <textarea
                                required
                                placeholder="Detail the logical basis for this determination..."
                                className="w-full min-h-[120px] p-4 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary/50 focus:bg-white/10 transition-all resize-y outline-none"
                                value={resolutionData.comments}
                                onChange={(e) => setResolutionData({ ...resolutionData, comments: e.target.value })}
                            />
                        </div>

                        <div className="p-8 bg-primary/5 border border-primary/10 rounded-3xl flex items-start gap-6">
                            <ShieldAlert size={28} className="text-primary flex-shrink-0 mt-1" />
                            <div className="text-sm text-muted leading-relaxed">
                                <strong className="text-white block mb-2 uppercase tracking-[0.2em] text-[10px]">Protocol Note:</strong>
                                This determination will be finalized and logged in the platform integrity ledger. Please ensure the commentary adequately supports the selected action.
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 flex gap-8">
                        <button
                            type="button"
                            className="btn-outline w-1/4 py-6 rounded-2xl border-white/10 hover:border-error hover:text-error transition-all font-black uppercase tracking-[0.2em] text-[11px]"
                            onClick={() => setShowResolveModal(false)}
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            className="btn-premium btn-premium-lg flex-1 shadow-2xl shadow-primary/40 py-6 rounded-2xl text-[14px] font-black uppercase tracking-[0.3em]"
                        >
                            Finalize Determination Protocol
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Reports;
