import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, MapPin, Phone, ShieldCheck, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

const Profile = () => {
    const { user, completeProfile } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: user?.address || '',
        mobile: user?.mobile || user?.primaryMobile || '',
        altMobile: user?.altMobile || user?.additionalMobile || '',
        authorityProof: user?.authorityProof || ''
    });

    const [fileName, setFileName] = useState(user?.authorityProof || 'No file chosen');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileName(file.name);
            setFormData({ ...formData, authorityProof: file.name }); // For tracking in data
        }
    };

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                address: user.address || '',
                mobile: user.mobile || user.primaryMobile || '',
                altMobile: user.altMobile || user.additionalMobile || '',
                authorityProof: user.authorityProof || ''
            });
            if (user.authorityProof) setFileName(user.authorityProof);
        }
    }, [user]);

    const handleUpdate = async () => {
        setIsUpdating(true);
        setShowSuccess(false);
        try {
            await completeProfile(formData);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="mx-auto py-8 px-6" style={{ maxWidth: '1500px' }}>
            {/* Page Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Profile Settings</h1>
                    <p className="text-muted text-sm">Manage your personal information and security proofs</p>
                </div>
                {user?.role === 'OWNER' && (
                    <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                        <ShieldCheck size={16} />
                        <span>Verified owner</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Side: Profile Sidebar */}
                <div className="lg:col-span-4">
                    <div className="card glass-effect p-0 overflow-hidden sticky top-24">
                        <div className="flex flex-col items-center p-12 bg-white/5">
                            <div className="relative mb-8">
                                <div className="user-avatar shadow-lg" style={{ width: '130px', height: '130px', fontSize: '3.5rem', border: '4px solid #1e293b' }}>
                                    {user?.name?.charAt(0)}
                                </div>
                                <label htmlFor="avatar-upload" className="absolute bottom-1 right-1 p-2 bg-primary rounded-full text-white shadow-lg cursor-pointer hover:bg-primary-hover transition-all">
                                    <Upload size={20} />
                                    <input type="file" id="avatar-upload" className="hidden" />
                                </label>
                            </div>
                            <h2 className="text-2xl font-bold mb-1 tracking-tight">{user?.name}</h2>
                            <p className="text-muted text-sm font-medium mb-12">{user?.email}</p>

                            {/* Account Status Box */}
                            <div className="w-full border border-border rounded-xl bg-transparent overflow-hidden">
                                <div className="bg-white/5 py-2.5 px-6 border-b border-border flex justify-center">
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted">Account Status</span>
                                </div>
                                <div className="p-6 flex justify-center">
                                    <span className="text-success text-sm font-bold flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-success"></div>
                                        Active Account
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Detailed Forms */}
                <div className="lg:col-span-8 space-y-8 flex flex-col">
                    {showSuccess && (
                        <div className="bg-success text-white p-4 rounded-xl mb-4 flex items-center gap-3 animate-in fade-in transition-all" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981' }}>
                            <CheckCircle2 size={24} />
                            <span className="font-bold">Profile updated successfully! All changes are synced.</span>
                        </div>
                    )}

                    <div className="card glass-effect p-10">
                        {/* Section 1: Information */}
                        <div className="flex items-center gap-3 mb-10 pb-4 border-b border-border">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <User size={22} />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Personal Information</h2>
                        </div>

                        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-12" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group mb-0">
                                <label className="text-[11px] font-black uppercase text-muted mb-3 flex items-center gap-2 tracking-[0.1em]">
                                    <User size={12} className="text-primary" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value.slice(0, 25) })}
                                    className="h-14 text-lg"
                                    placeholder="Enter full name"
                                    maxLength={25}
                                />

                            </div>
                            <div className="form-group mb-0">
                                <label className="text-[11px] font-black uppercase text-muted mb-3 flex items-center gap-2 tracking-[0.1em]">
                                    <Mail size={12} className="text-primary" /> Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`h-14 text-lg ${user?.profileCompleted ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    placeholder="your@email.com"
                                    readOnly={user?.profileCompleted}
                                />
                            </div>
                            <div className="form-group md:col-span-2 mb-0">
                                <label className="text-[11px] font-black uppercase text-muted mb-3 flex items-center gap-2 tracking-[0.1em]">
                                    <MapPin size={12} className="text-primary" /> Residential Address
                                </label>
                                <textarea
                                    rows="3"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value.slice(0, 200) })}
                                    className="text-lg resize-none p-5"
                                    placeholder="e.g. Street Name, Building No, City"
                                    maxLength={200}
                                ></textarea>

                            </div>
                            <div className="form-group mb-0">
                                <label className="text-[11px] font-black uppercase text-muted mb-3 flex items-center gap-2 tracking-[0.1em]">
                                    <Phone size={12} className="text-primary" /> Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setFormData({ ...formData, mobile: val });
                                    }}
                                    className={`h-14 text-lg ${user?.profileCompleted ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    placeholder="10-digit number"
                                    maxLength={10}
                                    readOnly={user?.profileCompleted}
                                />

                            </div>
                            <div className="form-group mb-0">
                                <label className="text-[11px] font-black uppercase text-muted mb-3 flex items-center gap-2 tracking-[0.1em]">
                                    <Phone size={12} className="text-primary" /> Secondary Mobile
                                </label>
                                <input
                                    type="tel"
                                    value={formData.altMobile}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setFormData({ ...formData, altMobile: val });
                                    }}
                                    className="h-14 text-lg"
                                    placeholder="10-digit number"
                                    maxLength={10}
                                />

                            </div>

                            {/* Section 2: Uploads */}
                            <div className="md:col-span-2 mt-8 pt-10 border-t border-border">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <ShieldCheck size={22} />
                                    </div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">Verification Documents</h2>
                                </div>

                                <div className="bg-white/5 border border-border p-6 rounded-2xl mb-10 flex gap-5 items-start">
                                    <AlertCircle size={24} className="text-white shrink-0 mt-0.5 opacity-80" />
                                    <p className="text-[15px] text-muted leading-relaxed font-medium">
                                        Please upload your Government Authority Proof (Aadhar, PAN, or Passport). <strong className="text-white">This document is only accessible by the Admin</strong> for secure verification purposes.
                                    </p>
                                </div>

                                <div className="form-group mb-0">
                                    <label className="text-[11px] font-black uppercase text-muted mb-4 block tracking-[0.1em]">Government Authority Proof</label>
                                    <div className="relative border-2 border-dashed border-border rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] transition-all flex flex-col items-center justify-center overflow-hidden h-[250px]">
                                        <input
                                            type="file"
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                width: '100%',
                                                height: '100%',
                                                opacity: 0,
                                                cursor: 'pointer',
                                                zIndex: 10
                                            }}
                                            id="govProof"
                                            onChange={handleFileChange}
                                        />
                                        <div className="text-center pointer-events-none">
                                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                                <Upload className="text-muted" size={32} />
                                            </div>
                                            <div className="bg-white text-black px-8 py-2.5 rounded-lg text-sm font-black mb-3 shadow-lg inline-block">
                                                Choose File
                                            </div>
                                            <p className="text-sm text-muted font-bold block opacity-60">
                                                {fileName}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="md:col-span-2 pt-12 mt-6 border-t border-border flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleUpdate}
                                    disabled={isUpdating}
                                    className="btn-primary"
                                    style={{ width: 'auto', minWidth: '250px', height: '60px', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '1px' }}
                                >
                                    {isUpdating ? 'Saving Changes...' : 'Save All Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
