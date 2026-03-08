import React, { useState, useEffect } from 'react';
import { Layers, AlertCircle, Users, Layout, ArrowUpRight, TrendingUp } from 'lucide-react';
import API from '../../api/axios';

const OwnerDashboard = () => {
    const [stats, setStats] = useState({
        managedAssets: 0,
        needsAttention: 0,
        incomingLeads: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [landsRes, bookingsRes] = await Promise.all([
                    API.get('/lands/my-lands'),
                    API.get('/bookings/owner-requests')
                ]);

                const lands = landsRes.data || [];
                const bookings = bookingsRes.data || [];

                const attentionRequired = lands.filter(land =>
                    land.landStatus === 'PENDING' || land.landStatus === 'REJECTED'
                ).length;

                setStats({
                    managedAssets: lands.length,
                    needsAttention: attentionRequired,
                    incomingLeads: bookings.length
                });
            } catch (error) {
                console.error("Error fetching owner dashboard stats:", error);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-10">
            <div className="relative p-12 rounded-[2.5rem] bg-gradient-to-r from-indigo-500/20 via-indigo-500/5 to-transparent border border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                    <Layout size={120} className="text-indigo-400" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-black font-outfit mb-3 tracking-tight">Portfolio <span className="text-indigo-400">Architect</span></h1>
                    <p className="text-muted text-lg font-medium max-w-xl">Overseeing your land assets and managing exclusive buyer inquiries with precision and authority.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card group hover:border-indigo-500/30">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                            <Layers size={28} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-indigo-400 transition-colors">Assets</span>
                    </div>
                    <h3 className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em] mb-1">Managed Assets</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-black text-white">{stats.managedAssets}</p>
                        <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">Live <ArrowUpRight size={12} /></span>
                    </div>
                </div>

                <div className="card group hover:border-rose-500/30">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-400 group-hover:scale-110 transition-transform">
                            <AlertCircle size={28} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-rose-400 transition-colors">Attention</span>
                    </div>
                    <h3 className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em] mb-1">Needs Attention</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-black text-white">{stats.needsAttention}</p>
                        <span className="text-xs font-bold text-rose-400 flex items-center gap-1">Pending <ArrowUpRight size={12} /></span>
                    </div>
                </div>

                <div className="card group hover:border-accent/30">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-accent/10 rounded-2xl text-accent group-hover:scale-110 transition-transform">
                            <Users size={28} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-accent transition-colors">Inquiries</span>
                    </div>
                    <h3 className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em] mb-1">Incoming Leads</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-black text-white">{stats.incomingLeads}</p>
                        <span className="text-xs font-bold text-accent flex items-center gap-1">High <TrendingUp size={12} /></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
