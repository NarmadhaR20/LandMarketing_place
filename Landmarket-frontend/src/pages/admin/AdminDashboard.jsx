import React, { useState, useEffect } from 'react';
import { Users, Landmark, FileCheck, Calendar, Shield, Activity, TrendingUp, UserCheck } from 'lucide-react';
import API from '../../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        lands: 0,
        pending: 0,
        bookings: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, landsRes, bookingsRes] = await Promise.all([
                    API.get('/users'),
                    API.get('/lands'),
                    API.get('/bookings')
                ]);

                const lands = landsRes.data || [];

                setStats({
                    users: usersRes.data ? usersRes.data.length : 0,
                    lands: lands.length,
                    pending: lands.filter(l => l.landStatus === 'PENDING').length,
                    bookings: bookingsRes.data ? bookingsRes.data.length : 0
                });
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-10">
            <div className="relative p-12 rounded-[2.5rem] bg-gradient-to-r from-slate-500/20 via-slate-500/5 to-transparent border border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                    <Shield size={120} className="text-slate-400" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-black font-outfit mb-3 tracking-tight">System <span className="text-slate-400">Commander</span></h1>
                    <p className="text-muted text-lg font-medium max-w-xl">Master control for the Land Market ecosystem. Monitoring growth, ensuring compliance, and optimizing performance.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="card group hover:border-blue-500/30">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
                            <Users size={24} />
                        </div>
                    </div>
                    <h3 className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em] mb-1">Ecosystem Users</h3>
                    <p className="text-4xl font-black text-white">{stats.users}</p>
                    <div className="mt-4 flex items-center gap-2 text-blue-400 text-xs font-bold">
                        <Activity size={12} /> +12% this month
                    </div>
                </div>

                <div className="card group hover:border-indigo-500/30">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400">
                            <Landmark size={24} />
                        </div>
                    </div>
                    <h3 className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em] mb-1">Global Assets</h3>
                    <p className="text-4xl font-black text-white">{stats.lands}</p>
                    <div className="mt-4 flex items-center gap-2 text-indigo-400 text-xs font-bold">
                        <TrendingUp size={12} /> Scalable Growth
                    </div>
                </div>

                <div className="card group hover:border-amber-500/30">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-400">
                            <FileCheck size={24} />
                        </div>
                    </div>
                    <h3 className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em] mb-1">Pending Validation</h3>
                    <p className="text-4xl font-black text-white">{stats.pending}</p>
                    <div className="mt-4 flex items-center gap-2 text-amber-400 text-xs font-bold">
                        <UserCheck size={12} /> Priority Queue
                    </div>
                </div>

                <div className="card group hover:border-emerald-500/30">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400">
                            <Calendar size={24} />
                        </div>
                    </div>
                    <h3 className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em] mb-1">Total Engagements</h3>
                    <p className="text-4xl font-black text-white">{stats.bookings}</p>
                    <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                        <Activity size={12} /> High Velocity
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
