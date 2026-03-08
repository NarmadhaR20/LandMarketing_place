import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    MapPin,
    Ruler,
    ShieldCheck,
    Zap,
    Users,
    ArrowRight,
    Target,
    Navigation,
    Award,
    Globe,
    Layers,
    CheckCircle2,
    ChevronDown,
    Mail,
    Phone
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
    const { user } = useAuth();
    const [activeFaq, setActiveFaq] = useState(0);

    const lands = [
        {
            id: 1,
            title: 'Mountain View Meadow',
            location: 'Aspen, CO',
            price: '450,000',
            size: '25 Acres',
            type: 'Residential',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop'
        },
        {
            id: 2,
            title: 'Golden Wheat Farm',
            location: 'Des Moines, IA',
            price: '890,000',
            size: '120 Acres',
            type: 'Agricultural',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop'
        },
        {
            id: 3,
            title: 'Downtown Tech Plot',
            location: 'Austin, TX',
            price: '2,500,000',
            size: '2 Acres',
            type: 'Commercial',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop'
        },
    ];

    return (
        <div className="home-wrapper">
            <Navbar />

            <main className="home-main">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-bg-base"></div>
                    <div className="absolute inset-0 mesh-gradient opacity-40 mix-blend-screen"></div>

                    <div className="blur-bg w-[500px] h-[500px] bg-primary/20 -top-48 -left-48"></div>
                    <div className="blur-bg w-[400px] h-[400px] bg-accent/10 bottom-0 right-0"></div>

                    <div className="container hero-content-wrapper">
                        <div className="hero-content-center animate-slide-up">
                            <div className="hero-badge glass-premium">
                                <Target size={14} className="animate-pulse text-primary" />
                                <span className="hero-badge-text text-primary">Institutional Grade Land Exchange</span>
                            </div>

                            <h1 className="hero-title text-white">
                                Precision <span className="gradient-primary">Ownership.</span>
                            </h1>

                            <p className="hero-subtitle">
                                The definitive marketplace for high-yield acreage. Access verified listings
                                and secure premium assets with surgical accuracy.
                            </p>

                            <div className="hero-actions delay-100">
                                <Link to="/register" className="btn-premium">
                                    Initialize Search
                                </Link>
                                <Link to="/login" className="btn-outline" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0.8rem 1.6rem', border: 'none', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontWeight: 900 }}>
                                    Portal Access
                                </Link>
                            </div>

                            <div className="hero-search-container glass-premium delay-200">
                                <div className="search-input-wrapper">
                                    <Search size={20} className="text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Region, coordinates, or asset type..."
                                        className="search-input"
                                    />
                                </div>
                                <button
                                    className="btn-premium"
                                    style={{ width: 'auto', flexShrink: 0 }}
                                    onClick={() => {
                                        if (user) {
                                            window.location.href = '/buyer/lands';
                                        } else {
                                            window.location.href = '/login';
                                        }
                                    }}
                                >
                                    Scan Market
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What We Offer Section */}
                <section className="section-padding">
                    <div className="container">
                        <div className="offer-grid">
                            <div className="animate-slide-up">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary bg-primary/5 px-4 py-2 rounded-full inline-block border border-primary/10 mb-6">ISO 9001:2015 CERTIFIED Protocol</span>
                                <h2 className="offer-title text-white">
                                    Land Management <br /><span className="text-primary italic font-light">Intelligence</span> <br />in Global Markets.
                                </h2>
                                <p className="offer-desc mt-6">
                                    LandMarket makes identifying high-yield assets effortless. Our platform allows users to browse verified inventory, view legal audit trails, and generate e-ownership certificates — all through a single, institutional interface.
                                </p>

                                <div className="offer-features-grid">
                                    <div className="feature-item">
                                        <div className="feature-icon-box bg-primary/10">
                                            <Zap size={24} className="text-primary" />
                                        </div>
                                        <div className="feature-text-content">
                                            <h4 className="text-white">Rapid Settlement</h4>
                                            <p>Complete asset transitions and legal transfers in record time.</p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon-box" style={{ background: 'rgba(96, 165, 250, 0.1)' }}>
                                            <ShieldCheck size={24} className="text-accent" />
                                        </div>
                                        <div className="feature-text-content">
                                            <h4 className="text-white">Verified Audit</h4>
                                            <p>Every plot is backed by a 12-point legal verification protocol.</p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon-box bg-primary/10">
                                            <Award size={24} className="text-primary" />
                                        </div>
                                        <div className="feature-text-content">
                                            <h4 className="text-white">Quality Assurance</h4>
                                            <p>Institutional-grade assessment for every listing on the index.</p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon-box" style={{ background: 'rgba(96, 165, 250, 0.1)' }}>
                                            <Users size={24} className="text-accent" />
                                        </div>
                                        <div className="feature-text-content">
                                            <h4 className="text-white">Direct Network</h4>
                                            <p>Bypass intermediaries and work directly with verified owners.</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginTop: '2rem' }}>
                                    <button
                                        className="btn-premium"
                                        onClick={() => {
                                            const contactSection = document.querySelector('.faq-contact-section');
                                            if (contactSection) {
                                                contactSection.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }}
                                    >
                                        Request a valuation
                                    </button>
                                    <button style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 900, cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem' }}>Read Whitepaper</button>
                                </div>
                            </div>

                            <div className="animate-slide-up delay-200 relative">
                                <div className="blur-bg w-[300px] h-[300px] bg-primary/10 top-0 right-0 mix-blend-screen" style={{ borderRadius: '50%', filter: 'blur(80px)' }}></div>
                                <div className="offer-card glass-premium">
                                    <h3 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '2rem', color: 'white' }}>
                                        What we <span className="text-primary italic font-light">offer</span>
                                    </h3>

                                    <div className="offer-card-list">
                                        {[
                                            'Verified land documents with QR validation',
                                            'Secure payment gateway & instant escrow',
                                            'Immediate e-certificate for ownership audit',
                                            'Dedicated Compliance Manager for every deal',
                                            'Multi-jurisdictional legal and tax support',
                                            'Institutional pricing and package options'
                                        ].map((item, i) => (
                                            <div key={i} className="offer-card-list-item">
                                                <CheckCircle2 size={18} className="text-primary" style={{ flexShrink: 0 }} />
                                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '2rem' }}>
                                        <p style={{ fontSize: '0.75rem', color: 'rgba(148, 163, 184, 0.6)', lineHeight: 1.6, fontStyle: 'italic' }}>
                                            Looking for a customized institutional package? <span className="text-primary" style={{ fontStyle: 'normal', fontWeight: 700, cursor: 'pointer' }}>Contact our team</span> or click to download the full catalog.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="section-padding vision-section">
                    <div className="blur-bg w-[500px] h-[500px] bg-primary/5 bottom-0 right-0 mix-blend-screen" style={{ borderRadius: '50%', filter: 'blur(120px)', right: '-200px', bottom: '-200px' }}></div>
                    <div className="container relative z-10">
                        <div className="vision-grid">
                            <div className="vision-image-container animate-fade-in">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 opacity-30 mix-blend-overlay"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop"
                                    alt="Visionary Architecture"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #050811, transparent)', opacity: 0.8 }}></div>
                            </div>

                            <div className="animate-slide-up delay-100">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                                    <Layers size={22} />
                                    <span style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em' }}>Visionary Architecture</span>
                                </div>
                                <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, color: 'white', marginBottom: '1.5rem' }}>
                                    Pioneering The <br /><span className="text-primary italic font-light">Digital Frontier</span> <br />Of Ownership.
                                </h2>
                                <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '3rem' }}>
                                    We eliminate opacity through surgical transparency. Every transaction is backed by verified intelligence and institutional-grade protocols.
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '3rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                                        <div>
                                            <div className="feature-icon-box bg-primary/10" style={{ marginBottom: '1rem', width: '3rem', height: '3rem' }}>
                                                <ShieldCheck size={20} className="text-primary" />
                                            </div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'white', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Legal Audit</h4>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>12-point document verification by jurisdictional experts.</p>
                                        </div>
                                        <div>
                                            <div className="feature-icon-box bg-primary/10" style={{ marginBottom: '1rem', width: '3rem', height: '3rem' }}>
                                                <Users size={20} className="text-primary" />
                                            </div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'white', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Direct Access</h4>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Bypass intermediaries for ultra-high-velocity asset exchange.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Explore Section */}
                <section className="section-padding">
                    <div className="container">
                        <div className="explore-header-row animate-slide-up">
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                                    <Navigation size={22} />
                                    <span style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em' }}>Inventory Protocol</span>
                                </div>
                                <h2 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, color: 'white' }}>
                                    Global <span className="text-primary">Catalog.</span>
                                </h2>
                            </div>
                            <Link to={user ? `/${user.role}` : "/register"} style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', textDecoration: 'none', borderBottom: '1px solid rgba(59, 130, 246, 0.4)', paddingBottom: '0.25rem' }}>
                                Explore Assets
                            </Link>
                        </div>

                        <div className="land-grid">
                            {lands.map((land, index) => (
                                <div key={land.id} className="land-card glass-premium animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                                    <div className="land-card-img-wrapper">
                                        <img src={land.image} alt={land.title} />
                                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
                                        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(2, 6, 23, 0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.375rem 1rem', borderRadius: '0.75rem', fontSize: '0.55rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)' }}>
                                            {land.type}
                                        </div>
                                    </div>
                                    <div className="land-card-content">
                                        <div>
                                            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em' }}>{land.title}</h3>
                                            <div className="land-card-row">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} style={{ color: 'rgba(59, 130, 246, 0.6)' }} /> {land.location}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Ruler size={14} style={{ color: 'rgba(59, 130, 246, 0.6)' }} /> {land.size}</div>
                                            </div>
                                        </div>
                                        <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <span style={{ fontSize: '0.55rem', fontWeight: 900, color: 'rgba(148, 163, 184, 0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '0.25rem' }}>Valuation</span>
                                                <div style={{ fontSize: '1.875rem', fontWeight: 900, color: 'white', letterSpacing: '-0.04em' }}>₹{land.price}</div>
                                            </div>
                                            <Link to={user ? `/land/${land.id}` : "/register"} style={{ width: '3.5rem', height: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--primary)', transition: 'all 0.3s' }} className="hover:bg-primary hover:text-white">
                                                <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ & Contact Section */}
                <section className="section-padding faq-contact-section">
                    <div className="container">
                        <div className="faq-contact-grid animate-slide-up">
                            {/* FAQ Side */}
                            <div>
                                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.02em', color: 'white', marginBottom: '1.5rem', lineHeight: 1 }}>
                                    Have any questions about protocol?
                                </h2>
                                <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '3rem', fontWeight: 500 }}>
                                    Below are common institutional questions — choose one to expand for details or contact our security team directly.
                                </p>

                                <div className="faq-list">
                                    {[
                                        { q: 'What payment methods do you accept?', a: 'We accept wire transfers, verified institutional credit lines, and major stablecoins.' },
                                        { q: 'Can I book land from other states or only Kerala?', a: 'Currently focusing on high-growth regions in Kerala, with roadmap plans for national expansion.' },
                                        { q: 'How do I select plots and view the seating arrangement?', a: 'Our 3D spatial interface allows for precision plot selection and infrastructure overlay.' },
                                        { q: 'What happens after payment — how do I get my e-ticket?', a: 'Upon settlement, a cryptographically signed e-certificate is issued to your registry.' }
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setActiveFaq(activeFaq === i ? -1 : i)}
                                            className="faq-item glass-premium"
                                            style={activeFaq === i ? { borderColor: 'rgba(59, 130, 246, 0.3)', background: 'rgba(255,255,255,0.02)' } : {}}
                                        >
                                            <div className="faq-item-header">
                                                <span style={{ color: activeFaq === i ? 'var(--primary)' : 'white' }}>{item.q}</span>
                                                <ChevronDown size={20} style={{ color: activeFaq === i ? 'var(--primary)' : 'var(--text-muted)', transform: activeFaq === i ? 'rotate(180deg)' : 'none', transition: 'all 0.3s' }} />
                                            </div>
                                            {activeFaq === i && (
                                                <div className="faq-item-body animate-fade-in">
                                                    {item.a}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Side */}
                            <div className="contact-card glass-premium">
                                <div className="blur-bg w-[400px] h-[400px] bg-primary/10 top-0 right-0 mix-blend-screen" style={{ borderRadius: '50%', filter: 'blur(100px)', transform: 'translate(40%, -40%)' }}></div>

                                <h3 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem', color: 'white', position: 'relative', zIndex: 10 }}>Send us a message</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>Ask about protocol, settlement or asset availability and our team will reply within one business day.</p>

                                <form className="contact-form">
                                    <input type="text" placeholder="Your name" className="contact-input" />
                                    <input type="email" placeholder="Email address" className="contact-input" />
                                    <textarea rows="4" placeholder="Tell us your question (e.g. payment process, audit states available, asset selection)" className="contact-input" style={{ resize: 'none' }}></textarea>
                                    <button type="button" className="btn-premium" style={{ width: '100%', padding: '1.25rem', marginTop: '0.5rem' }}>Submit Query</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="footer-section">
                <div className="container">
                    <div className="footer-top-grid">
                        {/* Col 1 */}
                        <div>
                            <Link to="/" style={{ fontSize: '1.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'white', textDecoration: 'none', display: 'block', marginBottom: '2rem' }}>
                                LAND <span className="text-primary">MARKET.</span>
                            </Link>
                            <p style={{ fontSize: '0.875rem', color: 'rgba(148, 163, 184, 0.7)', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '24rem' }}>
                                The institutional standard for digital land assets. We provide the infrastructure for secure, transparent, and high-velocity property exchange globally.
                            </p>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                {[Globe, Target, ShieldCheck].map((Icon, i) => (
                                    <Icon key={i} size={20} style={{ color: 'rgba(148, 163, 184, 0.4)', cursor: 'pointer' }} className="hover:text-primary transition-colors" />
                                ))}
                            </div>
                        </div>

                        {/* Col 2 */}
                        <div>
                            <h5 style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'white', marginBottom: '1.5rem' }}>Contact</h5>
                            <div className="footer-link-list">
                                <span style={{ display: 'flex', gap: '1rem', color: 'rgba(148, 163, 184, 0.7)', fontSize: '0.875rem' }}><MapPin size={18} className="text-primary" style={{ flexShrink: 0, marginTop: '2px' }} /> T V Center, Kakkanad,<br />Kochi, Kerala 682037</span>
                                <span style={{ display: 'flex', gap: '1rem', color: 'rgba(148, 163, 184, 0.7)', fontSize: '0.875rem' }}><Phone size={18} className="text-primary" style={{ flexShrink: 0 }} /> +91-859-001-0011</span>
                                <span style={{ display: 'flex', gap: '1rem', color: 'rgba(148, 163, 184, 0.7)', fontSize: '0.875rem' }}><Mail size={18} className="text-primary" style={{ flexShrink: 0 }} /> support@landmarket.com</span>
                            </div>
                        </div>

                        {/* Col 3 */}
                        <div>
                            <h5 style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'white', marginBottom: '1.5rem' }}>Quick Links</h5>
                            <div className="footer-link-list">
                                {['Home', 'Browse Assets', 'Verify Audit', 'Contact'].map(link => (
                                    <Link key={link} to="/" className="footer-link" style={{ fontSize: '0.875rem' }}>{link}</Link>
                                ))}
                            </div>
                        </div>

                        {/* Col 4 */}
                        <div>
                            <h5 style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'white', marginBottom: '1.5rem' }}>Protocol Services</h5>
                            <div className="footer-link-list">
                                {['Digital Registry', 'Ownership Audit', 'Compliance Desk', 'Valuation Engine'].map(link => (
                                    <Link key={link} to="/" className="footer-link" style={{ fontSize: '0.875rem' }}>{link}</Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom-bar">
                        <span>© 2026 LANDMARKET CORE PROTOCOL. ALL RIGHTS RESERVED.</span>
                        <div style={{ display: 'flex', gap: '2.5rem' }}>
                            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white transition-colors">Privacy</Link>
                            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white transition-colors">Terms</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
