import React, { useEffect, useState } from 'react';
import { Briefcase, CheckCircle, Clock, ArrowRight, Star } from 'lucide-react';
import API from '../../api/axios';

const BuyerDashboard = () => {
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await API.get('/bookings/my-bookings');
                const bookings = response.data;

                setStats({
                    total: bookings.length,
                    approved: bookings.filter(b => b.status === 'APPROVED' || b.status === 'CONFIRMED').length,
                    pending: bookings.filter(b => b.status === 'PENDING').length
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-10">
            <div className="relative p-12 rounded-[2.5rem] bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                    <Star size={120} className="text-primary" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-black font-outfit mb-3 tracking-tight">Welcome Back, <span className="gradient-primary">Explorer</span></h1>
                    <p className="text-muted text-lg font-medium max-w-xl">Your journey to the perfect plot is unfolding. Review your secured interests and pending transformations below.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card group hover:border-primary/30">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                            <Briefcase size={28} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-primary transition-colors">Portfolio</span>
                    </div>
                    <h3 className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em] mb-1">Secured Interests</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-black text-white">{stats.total}</p>
                        <span className="text-xs font-bold text-success flex items-center gap-1">Total <ArrowRight size={12} /></span>
                    </div>
                </div>

                <div className="card group hover:border-emerald-500/30">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                            <CheckCircle size={28} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-emerald-400 transition-colors">Verified</span>
                    </div>
                    <h3 className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em] mb-1">Validated Deals</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-black text-white">{stats.approved}</p>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">Success <ArrowRight size={12} /></span>
                    </div>
                </div>

                <div className="card group hover:border-amber-500/30">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-400 group-hover:scale-110 transition-transform">
                            <Clock size={28} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-amber-400 transition-colors">Timeline</span>
                    </div>
                    <h3 className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em] mb-1">Awaiting Focus</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-black text-white">{stats.pending}</p>
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">Pending <ArrowRight size={12} /></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboard;
