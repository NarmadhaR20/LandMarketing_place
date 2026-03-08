import React, { useState, useEffect, useRef } from 'react';
import {
    MapPin,
    Maximize,
    Layers,
    FileText,
    Camera,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Info,
    Globe,
    Home,
    Upload,
    X,
    Image as ImageIcon,
    IndianRupee,
    ArrowLeft
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axios';
import MapPicker from '../../components/ui/MapPicker';
import Modal from '../../components/ui/Modal';

const EditLand = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        area: '',
        landType: 'AGRICULTURAL',
        location: '',
        address: '',
        image: '',
        latitude: 7.8731,
        longitude: 80.7718
    });

    useEffect(() => {
        const fetchLand = async () => {
            try {
                const response = await API.get(`/lands/${id}`);
                const land = response.data;
                setFormData({
                    title: land.title || '',
                    description: land.description || '',
                    price: land.price || '',
                    area: land.area || '',
                    landType: land.landType || 'AGRICULTURAL',
                    location: land.location || '',
                    address: land.address || '',
                    image: land.image || '',
                    latitude: land.latitude || 7.8731,
                    longitude: land.longitude || 80.7718
                });
            } catch (error) {
                console.error('Error fetching land details:', error);
                alert('Failed to load land details.');
                navigate('/owner/listings');
            } finally {
                setLoading(false);
            }
        };
        fetchLand();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB limit.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setFormData(prev => ({ ...prev, image: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleLocationSelect = (lat, lng) => {
        setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await API.put(`/lands/${id}`, formData);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error updating land:', error);
            alert('Failed to update land. Please check the data and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted font-black uppercase tracking-widest text-sm">Loading Asset Data...</p>
            </div>
        );
    }

    return (
        <div className="pb-20 max-w-4xl">
            <div className="flex items-center gap-6 mb-12">
                <button
                    onClick={() => navigate('/owner/listings')}
                    className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-muted hover:text-white transition-all hover:bg-white/10"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight text-white">Edit Listing</h1>
                    <p className="text-muted text-lg font-medium">Update property details for re-submission</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Visuals Section */}
                <div className="card glass-effect p-10 border-white/5 shadow-2xl relative overflow-hidden group/visuals">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Camera size={100} />
                    </div>

                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <Camera size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-wider">Property Visuals</h2>
                            <p className="text-xs font-bold text-muted uppercase tracking-widest">High-fidelity asset imagery</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="flex items-center gap-2 mb-3 text-xs font-black uppercase tracking-widest text-muted">
                                    <Upload size={14} className="text-indigo-400" /> Property Asset Upload
                                </label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-white/[0.07] transition-all group/upload"
                                >
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/upload:scale-110 transition-transform">
                                        <Upload size={24} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-black text-white uppercase tracking-wider">Choose Image Asset</p>
                                        <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                                    </div>
                                </div>
                                {formData.image && (
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest mt-4 hover:opacity-80 transition-opacity"
                                    >
                                        <X size={14} /> Remove Current Asset
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="relative flex justify-center lg:justify-end">
                            <div className="w-full max-w-[180px] aspect-square rounded-[1.5rem] bg-white/5 border border-dashed border-white/10 overflow-hidden flex items-center justify-center group-hover/visuals:border-primary/30 transition-colors">
                                {formData.image ? (
                                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <div className="text-center space-y-3 p-8">
                                        <Camera size={40} className="text-muted/20 mx-auto" />
                                        <p className="text-[10px] font-black text-muted/40 uppercase tracking-[0.2em]">Preview Pending</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Property Overview */}
                <div className="card glass-effect p-10 border-white/5 shadow-2xl overflow-hidden relative">
                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Layers size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-wider">Property Overview</h2>
                            <p className="text-xs font-bold text-muted uppercase tracking-widest">Core information</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="form-group md:col-span-2">
                            <label className="flex items-center gap-2 mb-3 text-xs font-black uppercase tracking-widest text-muted">Land Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-white/5 border-white/10 rounded-2xl p-5 text-white focus:border-primary/50 transition-all font-medium placeholder:text-muted/30"
                                placeholder="Title"
                                required
                            />
                        </div>
                        <div className="form-group md:col-span-2">
                            <label className="flex items-center gap-2 mb-3 text-xs font-black uppercase tracking-widest text-muted">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                className="w-full bg-white/5 border-white/10 rounded-2xl p-5 text-white focus:border-primary/50 transition-all font-medium placeholder:text-muted/30 resize-none"
                                required
                            ></textarea>
                        </div>
                        <div className="form-group flex flex-col">
                            <label className="flex items-center gap-2 mb-3 text-xs font-black uppercase tracking-widest text-muted">Price</label>
                            <div className="relative flex">
                                <select
                                    name="currency"
                                    value={formData.currency || 'INR'}
                                    onChange={handleChange}
                                    className="bg-white/5 border border-white/10 rounded-l-2xl p-5 text-white focus:border-primary/50 transition-all font-black text-sm appearance-none outline-none z-10 w-24 border-r-0"
                                >
                                    <option className="bg-deep" value="INR">₹ INR</option>
                                    <option className="bg-deep" value="USD">$ USD</option>
                                </select>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-r-2xl p-5 text-white focus:border-primary/50 transition-all font-black text-xl outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group flex flex-col">
                            <label className="flex items-center gap-2 mb-3 text-xs font-black uppercase tracking-widest text-muted">Area</label>
                            <div className="relative flex">
                                <input
                                    type="number"
                                    step="0.01"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-l-2xl p-5 text-white focus:border-primary/50 transition-all font-black text-xl outline-none border-r-0"
                                    required
                                />
                                <select
                                    name="areaUnit"
                                    value={formData.areaUnit || 'Acres'}
                                    onChange={handleChange}
                                    className="bg-white/5 border border-white/10 rounded-r-2xl p-5 text-white focus:border-primary/50 transition-all font-black text-sm appearance-none outline-none z-10 w-28"
                                >
                                    <option className="bg-deep" value="Acres">Acres</option>
                                    <option className="bg-deep" value="Cents">Cents</option>
                                    <option className="bg-deep" value="SqFt">Sq Ft</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="card glass-effect p-10 border-white/5 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Globe size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-wider">Location Details</h2>
                            <p className="text-xs font-bold text-muted uppercase tracking-widest">Geographical placement</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="form-group">
                            <label className="flex items-center gap-2 mb-3 text-xs font-black uppercase tracking-widest text-muted">Region/City</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full bg-white/5 border-white/10 rounded-2xl p-5 text-white focus:border-primary/50 transition-all font-bold"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="flex items-center gap-2 mb-3 text-xs font-black uppercase tracking-widest text-muted">Full Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full bg-white/5 border-white/10 rounded-2xl p-5 text-white focus:border-primary/50 transition-all font-bold"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="card glass-effect p-10 border-white/5 shadow-2xl">
                    <div className="h-[400px] w-full">
                        {!loading && (
                            <MapPicker
                                onLocationSelect={handleLocationSelect}
                                initialPosition={[formData.latitude, formData.longitude]}
                            />
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end pt-12 border-t border-white/5">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary flex items-center gap-4 px-12 py-5 rounded-[2rem] shadow-2xl shadow-primary/40 disabled:opacity-50 min-w-[240px] justify-center"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={24} className="animate-spin" />
                                <span className="text-lg font-black uppercase tracking-widest">Saving...</span>
                            </>
                        ) : (
                            <>
                                <span className="text-lg font-black uppercase tracking-widest">Update Listing</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <Modal
                isOpen={showSuccessModal}
                onClose={() => navigate('/owner/listings')}
                title="Listing Updated"
            >
                <div className="text-center py-8 space-y-6">
                    <div className="w-24 h-24 bg-success/10 rounded-[2rem] flex items-center justify-center text-success mx-auto shadow-2xl shadow-success/20">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white">Re-submitted!</h3>
                        <p className="text-muted font-medium px-4">Your changes have been saved and sent for administrator re-approval.</p>
                    </div>
                    <button
                        onClick={() => navigate('/owner/listings')}
                        className="btn-primary w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30 border-none"
                    >
                        Return to Portfolio
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default EditLand;
