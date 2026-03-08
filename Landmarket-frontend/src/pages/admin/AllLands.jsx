import React, { useState, useEffect } from 'react';
import { Landmark, User, MapPin, IndianRupee, ShieldCheck, Search, Filter, X } from 'lucide-react';
import API from '../../api/axios';

const AllLands = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchLands = async () => {
            try {
                setLoading(true);
                const response = await API.get('/lands');
                setLands(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching all lands:', error);
                setLoading(false);
            }
        };
        fetchLands();
    }, []);

    const filteredLands = lands.filter(land =>
        land.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        land.ownerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        land.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-surface/50 p-6 rounded-2xl border border-white/5 backdrop-blur-xl">
                <div>
                    <h1 className="font-outfit text-3xl font-black text-white tracking-tight">Global Inventory</h1>
                    <p className="text-muted text-sm mt-1">Full oversight of all land assets in the ecosystem</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            className="pl-10 pr-4 py-2 bg-white/5 border-white/10 rounded-xl text-xs focus:border-primary/50 w-64"
                        />
                    </div>
                    <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted hover:text-white transition-colors">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="table-container border border-white/5 shadow-2xl">
                <table>
                    <thead>
                        <tr>
                            <th className="py-5">Property Designation</th>
                            <th>Identity of Ownership</th>
                            <th>Geographical Domain</th>
                            <th>Market Valuation</th>
                            <th className="px-8">Validation State</th>
                            <th className="px-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                        <p className="text-muted font-black uppercase tracking-[0.2em] text-[10px]">Synchronizing Global Registry...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredLands.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-20 text-center">
                                    <p className="text-muted font-black uppercase tracking-[0.2em] text-[10px]">Registry is currently vacant</p>
                                </td>
                            </tr>
                        ) : (
                            filteredLands.map(land => (
                                <tr key={land.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg">
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
                                            <IndianRupee size={14} className="text-success" /> {land.price}
                                        </div>
                                    </td>
                                    <td className="px-8">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${land.landStatus?.toUpperCase() === 'AVAILABLE' ? 'border-success/20 bg-success/5 text-success' :
                                            land.landStatus?.toUpperCase() === 'PENDING' ? 'border-amber-500/20 bg-amber-500/5 text-amber-500' :
                                                land.landStatus?.toUpperCase() === 'UNDER_CONTRACT' || land.landStatus?.toUpperCase() === 'SOLD' ? 'border-indigo-500/20 bg-indigo-500/5 text-indigo-400' :
                                                    land.landStatus?.toUpperCase() === 'REJECTED' ? 'border-error/20 bg-error/5 text-error' :
                                                        land.landStatus?.toUpperCase() === 'OFF_MARKET' ? 'border-blue-500/20 bg-blue-500/5 text-blue-400' :
                                                            'border-white/10 bg-white/5 text-muted'
                                            }`}>
                                            <ShieldCheck size={12} />
                                            {land.landStatus?.toUpperCase() === 'AVAILABLE' ? 'Approved' :
                                                land.landStatus?.toUpperCase() === 'UNDER_CONTRACT' ? 'Deal Secured' :
                                                    land.landStatus?.toUpperCase() === 'SOLD' ? 'Sold' :
                                                        land.landStatus?.toUpperCase() === 'REJECTED' ? 'Rejected' :
                                                            land.landStatus?.toUpperCase() === 'OFF_MARKET' ? 'Off Market' :
                                                                land.landStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 relative">
                                        {land.landStatus?.toUpperCase() !== 'PENDING' && land.landStatus?.toUpperCase() !== 'REJECTED' && (
                                            <button
                                                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-error/20 hover:text-error hover:border-error/40 transition-all shadow-lg hover:-translate-y-1 group/btn"
                                                title="Revoke Approval (Reject)"
                                                onClick={async () => {
                                                    const reason = window.prompt("Enter rejection protocol commentary:");
                                                    if (reason) {
                                                        try {
                                                            await API.put(`/lands/${land.id}/reject?reason=${encodeURIComponent(reason)}`);
                                                            const response = await API.get('/lands');
                                                            setLands(response.data);
                                                        } catch (error) {
                                                            console.error('Error rejecting land:', error);
                                                            alert('Failed to execute rejection protocol.');
                                                        }
                                                    }
                                                }}
                                            >
                                                <X size={16} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllLands;
