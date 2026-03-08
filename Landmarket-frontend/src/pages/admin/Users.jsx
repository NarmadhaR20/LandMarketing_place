import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, MapPin, Edit2, ShieldAlert, Trash2, UserPlus, ShieldCheck } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import API from '../../api/axios';

const Users = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await API.get('/users');
            // Backend returns list of User entities
            const formattedUsers = response.data.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                status: u.accountStatus || 'Active', // Mapping backend accountStatus
                mobile: u.primaryMobile || u.mobile,
                address: u.address
            }));
            setUsers(formattedUsers.filter(u => u.role !== 'ADMIN')); // Don't show admins in this list
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Owner',
        password: '',
        address: '',
        mobile: ''
    });

    const handleSuspend = async (id) => {
        try {
            // Need a backend endpoint for this. Mocking for now but with state persistence
            // Ideally: await API.put(`/users/${id}/status`, { status: 'Suspended' });
            setUsers(users.map(u =>
                u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
            ));
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to purge this identity from the ecosystem?')) {
            try {
                // await API.delete(`/users/${id}`);
                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleOpenEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
            address: user.address,
            mobile: user.mobile
        });
        setShowEditModal(true);
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            // await API.put(`/users/${editingUser.id}`, formData);
            setUsers(users.map(u =>
                u.id === editingUser.id ? { ...u, ...formData } : u
            ));
            setShowEditModal(false);
            setEditingUser(null);
            setFormData({ name: '', email: '', role: 'Owner', password: '', address: '', mobile: '' });
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleProvision = async (e) => {
        e.preventDefault();
        try {
            // Map frontend data to backend User entity expected fields
            const userData = {
                ...formData,
                primaryMobile: formData.mobile,
                accountStatus: 'ACTIVE'
            };
            const response = await API.post('/users/register', userData);
            const newUser = {
                id: response.data.id,
                ...formData,
                status: 'Active'
            };
            setUsers([...users, newUser]);
            setShowAddModal(false);
            setFormData({ name: '', email: '', role: 'Owner', password: '', address: '', mobile: '' });
        } catch (error) {
            console.error('Error provisioning user:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-surface/50 p-6 rounded-2xl border border-white/5 backdrop-blur-xl">
                <div>
                    <h1 className="font-outfit text-3xl font-black text-white tracking-tight">User Ecosystem</h1>
                    <p className="text-muted text-sm mt-1">Manage and monitor all platform participants</p>
                </div>
                <button
                    className="btn-premium w-auto group"
                    onClick={() => setShowAddModal(true)}
                >
                    <UserPlus size={16} className="mr-2 group-hover:rotate-12 transition-transform" />
                    Provision New Identity
                </button>
            </div>

            <div className="table-container border border-white/5 shadow-2xl">
                <table>
                    <thead>
                        <tr>
                            <th className="py-5">Identity</th>
                            <th>Role & Permissions</th>
                            <th>Security Status</th>
                            <th>Contact Vectors</th>
                            <th className="text-right px-8">Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                        <p className="text-muted font-black uppercase tracking-[0.2em] text-[10px]">Synchronizing Ecosystem Data...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-20 text-center">
                                    <p className="text-muted font-black uppercase tracking-[0.2em] text-[10px]">No participants found in registry</p>
                                </td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black shadow-lg">
                                                {user.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-white tracking-tight leading-none text-base">{user.name}</h4>
                                                <div className="text-[10px] text-muted flex items-center gap-1 tracking-wider mt-1.5 font-bold">
                                                    <Mail size={10} className="text-primary" /> {user.email?.toLowerCase()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.role?.toUpperCase() === 'OWNER'
                                            ? 'bg-primary/5 text-primary border-primary/20'
                                            : 'bg-accent/5 text-accent border-accent/20'
                                            }`}>
                                            <Shield size={12} />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex flex-col gap-1">
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${user.status?.toUpperCase() === 'ACTIVE' ? 'text-success' : 'text-error'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${user.status?.toUpperCase() === 'ACTIVE' ? 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-error shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                                                {user.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="space-y-1">
                                            <div className="text-white text-xs font-bold flex items-center gap-2">
                                                <Phone size={12} className="text-muted" /> {user.mobile || 'N/A'}
                                            </div>
                                            <div className="text-muted text-[10px] flex items-center gap-2 truncate max-w-[180px]">
                                                <MapPin size={12} /> {user.address || 'Address unverified'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8">
                                        <div className="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <button
                                                title="Edit Profile"
                                                className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-all shadow-lg hover:-translate-y-1 group/btn"
                                                onClick={() => handleOpenEdit(user)}
                                            >
                                                <Edit2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                title={user.status?.toUpperCase() === 'ACTIVE' ? 'Suspend Access' : 'Restore Access'}
                                                className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-amber-500/20 hover:text-amber-500 hover:border-amber-500/40 transition-all shadow-lg hover:-translate-y-1 group/btn"
                                                onClick={() => handleSuspend(user.id)}
                                            >
                                                {user.status?.toUpperCase() === 'ACTIVE' ? <ShieldAlert size={18} className="group-hover/btn:scale-110 transition-transform" /> : <ShieldCheck size={18} className="group-hover/btn:scale-110 transition-transform" />}
                                            </button>
                                            <button
                                                title="Purge Account"
                                                className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-error/20 hover:text-error hover:border-error/40 transition-all shadow-lg hover:-translate-y-1 group/btn"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Security Protocol: Identity Provisioning">
                <form className="space-y-8 no-scrollbar p-2" onSubmit={handleProvision}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted px-1">Legal Designation</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="pl-12 bg-white/5 border-white/10 focus:border-primary/50 text-base"
                                        placeholder="Identity Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted px-1">System Authorization</label>
                                <div className="relative group">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                                    <select
                                        className="pl-12 bg-white/5 border-white/10 focus:border-primary/50 appearance-none text-base"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="Owner">Owner</option>
                                        <option value="Buyer">Buyer</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted px-1">Direct Liaison</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="tel"
                                        required
                                        className="pl-12 bg-white/5 border-white/10 focus:border-primary/50 text-base"
                                        placeholder="Mobile Frequency"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted px-1">Communication Channel</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="pl-12 bg-white/5 border-white/10 focus:border-primary/50 text-base"
                                        placeholder="authenticated@host.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted px-1">Access Credentials</label>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="bg-white/5 border-white/10 focus:border-primary/50 text-base py-[0.9rem]"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted px-1">Credential Proof</label>
                                <div className="p-1 px-2 bg-white/5 border border-white/10 rounded-xl h-[52px] flex items-center">
                                    <input type="file" className="file:bg-primary file:text-white file:border-none file:rounded-lg file:px-3 file:py-1 file:text-[10px] file:font-black file:uppercase text-[10px] text-muted w-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted px-1">Geographical Domain</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                required
                                className="pl-12 bg-white/5 border-white/10 focus:border-primary/50 text-base"
                                placeholder="Physical Address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="btn-premium btn-premium-lg w-full shadow-2xl shadow-primary/20"
                        >
                            Execute Identity Provisioning
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Security Protocol: Identity Modification">
                <form className="space-y-8 no-scrollbar p-2" onSubmit={handleEditUser}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted px-1">Legal Designation</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="pl-12 bg-white/5 border-white/10 focus:border-primary/50 text-base"
                                        placeholder="Identity Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted px-1">System Authorization</label>
                                <div className="relative group">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                                    <select
                                        className="pl-12 bg-white/5 border-white/10 focus:border-primary/50 appearance-none text-base"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="Owner">Owner</option>
                                        <option value="Buyer">Buyer</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted px-1">Direct Liaison</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="tel"
                                        required
                                        className="pl-12 bg-white/5 border-white/10 focus:border-primary/50 text-base"
                                        placeholder="Mobile Frequency"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted px-1">Communication Channel</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="pl-12 bg-white/5 border-white/10 focus:border-primary/50 text-base"
                                        placeholder="authenticated@host.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted px-1">Access Credentials</label>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="bg-white/5 border-white/10 focus:border-primary/50 text-base py-[0.9rem]"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted px-1">Credential Proof</label>
                                <div className="p-1 px-2 bg-white/5 border border-white/10 rounded-xl h-[52px] flex items-center">
                                    <input type="file" className="file:bg-primary file:text-white file:border-none file:rounded-lg file:px-3 file:py-1 file:text-[10px] file:font-black file:uppercase text-[10px] text-muted w-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted px-1">Geographical Domain</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                required
                                className="pl-12 bg-white/5 border-white/10 focus:border-primary/50 text-base"
                                placeholder="Physical Address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="btn-premium btn-premium-lg w-full shadow-2xl shadow-primary/20"
                        >
                            Update Identity Profile
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Users;
