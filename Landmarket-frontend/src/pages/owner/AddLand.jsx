import React, { useState, useRef } from 'react';
import {
    MapPin,
    Maximize,
    DollarSign,
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
    IndianRupee
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import MapPicker from '../../components/ui/MapPicker';
import Modal from '../../components/ui/Modal';

const AddLand = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        currency: 'INR',
        area: '',
        areaUnit: 'Acres',
        location: '',
        address: '',
        landType: 'AGRICULTURAL',
        image: null,
        document: null,
        latitude: 7.8731,
        longitude: 80.7718
    });

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
            await API.post('/lands', formData);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error listing land:', error);
            alert('Failed to list land. Please check the data and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pb-20 max-w-4xl">
            <div className="mb-12">
                <h1 className="text-4xl font-black mb-2 tracking-tight text-white">List New Property</h1>
                <p className="text-muted text-lg font-medium">Broadcast your land to thousands of potential buyers</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Visuals Section - NEW */}
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
                                    <ImageIcon size={14} className="text-indigo-400" /> Property Asset Upload
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
                                        className="flex items-center gap-2 text-error text-[10px] font-black uppercase tracking-widest mt-4 hover:opacity-80 transition-opacity"
                                    >
                                        <X size={14} /> Remove Current Asset
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="relative flex justify-center lg:justify-end">
                            <div className="w-[220px] h-[160px] rounded-xl bg-white/5 border border-dashed border-white/10 overflow-hidden flex items-center justify-center">
                                {formData.image ? (
                                    <img
                                        src={formData.image}
                                        className="w-full h-full object-cover"
                                        alt="Preview"
                                    />
                                ) : (
                                    <div className="text-center space-y-3 p-8">
                                        <ImageIcon size={40} className="text-muted/20 mx-auto" />
                                        <p className="text-[10px] font-black text-muted/40 uppercase tracking-[0.2em]">Imagery Preview Pending</p>
                                    </div>
                                )}
                            </div>
                            {formData.image && (
                                <div className="absolute -bottom-3 right-0 lg:-right-3 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl animate-bounce">
                                    <CheckCircle2 size={24} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Essential Details Section */}
                <div className="card glass-effect p-10 border-white/5 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <FileText size={100} />
                    </div>

                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Layers size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-wider">Property Overview</h2>
                            <p className="text-xs font-bold text-muted uppercase tracking-widest">Core information about your listing</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="form-group md:col-span-2">
                            <label className="flex items-center gap-2 mb-3 text-xs font-black uppercase tracking-widest text-muted">
                                <FileText size={14} className="text-primary" /> Land Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-white/5 border-white/10 rounded-2xl p-5 text-white focus:border-primary/50 transition-all font-medium placeholder:text-muted/30"
                                placeholder="e.g. 50 Acre Fertile Farmland in Green Valley"
                                maxLength={100}
                                required
                            />
                        </div>

                        <div className="form-group md:col-span-2">
                            <label className="flex items-center gap-2 mb-3 text-xs font-black uppercase tracking-widest text-muted">
                                <Info size={14} className="text-primary" /> Extensive Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={(e) => {
                                    const words = e.target.value.split(/\s+/).filter(Boolean).slice(0, 350).join(' ');
                                    setFormData(prev => ({ ...prev, description: words }));
                                }}
                                rows="5"
                                className="w-full bg-white/5 border-white/10 rounded-2xl p-5 text-white focus:border-primary/50 transition-all font-medium placeholder:text-muted/30 resize-none"
                                placeholder="Describe soil quality, irrigation facilities, road access, and unique selling points..."
                                required
                            ></textarea>
                        </div>

                        <div className="form-group flex flex-col">
                            <label className="flex items-center gap-2 mb-3 text-xs font-black uppercase tracking-widest text-muted">
                                <IndianRupee size={14} className="text-success" /> Target Price
                            </label>
                            <div className="relative flex">
                                <select
                                    name="currency"
                                    value={formData.currency}
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
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group flex flex-col">
                            <label className="flex items-center gap-2 mb-3 text-xs font-black uppercase tracking-widest text-muted">
                                <Maximize size={14} className="text-primary" /> Total Area
                            </label>
                            <div className="relative flex">
                                <input
                                    type="number"
                                    step="0.01"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-l-2xl p-5 text-white focus:border-primary/50 transition-all font-black text-xl outline-none border-r-0"
                                    placeholder="0.00"
                                    required
                                />
                                <select
                                    name="areaUnit"
                                    value={formData.areaUnit}
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

                {/* Classification & Location Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="card glass-effect p-10 border-white/5 shadow-2xl">
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <Layers size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-wider">Classification</h2>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Type and usage category</p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="flex items-center gap-2 mb-4 text-xs font-black uppercase tracking-widest text-muted">Land Use Category</label>
                            <select
                                name="landType"
                                value={formData.landType}
                                onChange={handleChange}
                                className="w-full bg-white/5 border-white/10 rounded-2xl p-5 text-white focus:border-primary/50 transition-all font-bold appearance-none cursor-pointer"
                                required
                            >
                                <option value="AGRICULTURAL">🌾 Agricultural</option>
                                <option value="RESIDENTIAL">🏠 Residential</option>
                                <option value="COMMERCIAL">💼 Commercial</option>
                                <option value="INDUSTRIAL">🏭 Industrial</option>
                                <option value="FORESTRY">🌲 Forestry</option>
                            </select>
                        </div>
                    </div>

                    <div className="card glass-effect p-10 border-white/5 shadow-2xl">
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-wider">Location</h2>
                                <p className="text-xs font-bold text-muted uppercase tracking-widest">Geographical placement</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="flex items-center gap-2 mb-3 text-xs font-black uppercase tracking-widest text-muted">
                                    <Globe size={14} className="text-emerald-500" /> Region/City
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border-white/10 rounded-2xl p-5 text-white focus:border-primary/50 transition-all font-bold placeholder:text-muted/30"
                                    placeholder="e.g. California, USA"
                                    maxLength={50}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="flex items-center gap-2 mb-3 text-xs font-black uppercase tracking-widest text-muted">
                                    <Home size={14} className="text-emerald-500" /> Full Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border-white/10 rounded-2xl p-5 text-white focus:border-primary/50 transition-all font-bold placeholder:text-muted/30"
                                    placeholder="e.g. 123 Riverside Drive, Sector 4"
                                    maxLength={250}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="card glass-effect p-10 border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-wider">Interactive Map</h2>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Satellite verification</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        <MapPicker
                            onLocationSelect={handleLocationSelect}
                            initialPosition={[formData.latitude, formData.longitude]}
                        />
                    </div>
                    <p className="mt-4 text-[10px] font-bold text-muted uppercase tracking-widest text-center">
                        Note: Click on the map to pin the exact property boundaries
                    </p>
                </div>

                <div className="flex items-center justify-between pt-12 border-t border-white/5 mt-10">
                    <div className="flex items-center gap-4 text-muted flex-1">
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={16} />
                        </div>
                        <p className="text-xs font-medium max-w-xs">By submitting, you agree to the verification audit of your ownership documents.</p>
                    </div>

                    <div className="flex-shrink-0">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary group relative overflow-hidden flex items-center gap-4 px-12 py-5 rounded-[2rem] shadow-2xl shadow-primary/40 disabled:opacity-50 min-w-[240px] justify-center"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={24} className="animate-spin" />
                                    <span className="text-lg font-black uppercase tracking-widest">Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-lg font-black uppercase tracking-widest">Publish Listing</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <Modal
                isOpen={showSuccessModal}
                onClose={() => navigate('/owner/my-listings')}
                title="Listing Broadcasted"
            >
                <div className="text-center py-8 space-y-6">
                    <div className="w-24 h-24 bg-success/10 rounded-[2rem] flex items-center justify-center text-success mx-auto shadow-2xl shadow-success/20">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white">Property Submitted!</h3>
                        <p className="text-muted font-medium px-4">Your land listing has been received and is now entering our multi-stage verification audit.</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 text-left">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 mt-1">
                                <Info size={18} />
                            </div>
                            <p className="text-[11px] font-bold text-muted/80 uppercase tracking-widest leading-relaxed">
                                Listings typically undergo manual verification within 24-48 hours. You will be notified once the status changes to <span className="text-success">Approved</span>.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/owner/my-listings')}
                        className="btn-primary w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30 border-none"
                    >
                        Acknowledge & View Portfolio
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AddLand;
