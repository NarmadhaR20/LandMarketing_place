import React, { useState, useEffect } from 'react';
import { Search, MapPin, Ruler, ArrowRight, Filter, Navigation, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const BrowseLands = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchLands = async () => {
            try {
                setLoading(true);
                const response = await API.get('/lands/approved');
                setLands(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching lands:', error);
                setLoading(false);
            }
        };
        fetchLands();
    }, []);

    const filteredLands = lands.filter(land => {
        const title = land.title?.toLowerCase() || '';
        const location = land.location?.toLowerCase() || '';
        const type = land.type?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();

        return title.includes(query) ||
            location.includes(query) ||
            type.includes(query);
    });

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-surface/50 p-8 rounded-[2rem] border border-white/5 backdrop-blur-xl">
                <div>
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <Navigation size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Market Protocol</span>
                    </div>
                    <h1 className="font-outfit text-4xl font-black text-white tracking-tight">Browse <span className="gradient-primary">Inventory</span></h1>
                    <p className="text-muted text-sm mt-1">Access verified high-yield acreage across global jurisdictions</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search coordinates, title, or type..."
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border-white/10 rounded-2xl text-sm focus:border-primary/50 transition-all outline-none text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-muted hover:text-white transition-all hover:bg-white/10">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Content section */}
            {loading ? (
                <div className="py-40 text-center">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-muted font-black uppercase tracking-[0.4em] text-xs">Accessing Global Land Registry...</p>
                    </div>
                </div>
            ) : filteredLands.length === 0 ? (
                <div className="py-40 text-center bg-surface/30 rounded-[2rem] border border-dashed border-white/5">
                    <div className="max-w-xs mx-auto space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search size={32} className="text-muted/40" />
                        </div>
                        <h3 className="text-xl font-bold text-white">No Assets Found</h3>
                        <p className="text-muted text-sm">Adjustment of search parameters or filters may be required to locate specific documentation.</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="text-primary font-black uppercase tracking-widest text-[10px] mt-4 hover:underline"
                        >
                            Reset Protocol
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredLands.map((land, index) => (
                        <div
                            key={land.id}
                            className="land-card glass-premium animate-slide-up group"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="land-card-img-wrapper relative overflow-hidden rounded-t-[1.5rem]">
                                <img
                                    src={land.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop'}
                                    alt={land.title}
                                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-transparent opacity-60"></div>

                                <div className="absolute top-6 left-6 flex gap-2">
                                    <div className="bg-primary/90 backdrop-blur-xl text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-2xl">
                                        VERIFIED
                                    </div>
                                </div>

                                <div className="absolute top-6 right-6">
                                    <div className="bg-deep/60 backdrop-blur-md border border-white/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                        {land.type}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-primary transition-colors">{land.title}</h3>
                                    <div className="flex flex-wrap gap-4 text-muted text-sm font-medium">
                                        <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                                            <MapPin size={14} className="text-primary" />
                                            {land.location}
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                                            <Ruler size={14} className="text-primary" />
                                            {land.size}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-muted uppercase tracking-widest">Valuation</span>
                                        <div className="text-3xl font-black text-white tracking-tighter">₹{land.price}</div>
                                    </div>
                                    <Link
                                        to={`/land/${land.id}`}
                                        className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 hover:rotate-3 shadow-xl group/btn"
                                    >
                                        <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowseLands;
