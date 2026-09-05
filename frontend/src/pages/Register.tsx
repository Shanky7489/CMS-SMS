import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.ts'; // Humara centralized Axios instance

const Register = () => {

    const [formData, setFormData] = useState({
        smsId: '',
        name: '',
        experience: '',
        position: '',
        password: '',
        role: 'SMS' // Default role
    });

    // UI States (Loading, Error, Password Visibility)
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // 2. Generic Input Handler - Ek function sab inputs ko handle karega
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    // 3. Axios ke through API Call
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/api/auth/register', formData);

            if (response.status === 201 || response.status === 200) {
                navigate('/login');
            }
        } catch (err: any) {
            // Axios exact server error catch karta hai
            setError(err.response?.data?.message || 'Registration failed. Server error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-slate-100 px-10 py-10">

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <svg className="w-11 h-11 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-center font-serif font-bold text-2xl leading-snug text-slate-900">
                    Department of Legal Review
                </h1>
                <p className="text-center text-sm tracking-wide text-slate-400 mt-2 mb-8">
                    User Registration Portal
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-6 border border-red-100 flex items-center gap-2">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">

                    {/* Role Selection */}
                    <div>
                        <label className="block text-xs font-semibold tracking-wide text-slate-400 mb-2">
                            Select Role <span className="text-slate-400">*</span>
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    id="role"
                                    value="SMS"
                                    checked={formData.role === 'SMS'}
                                    onChange={handleChange}
                                    className="text-slate-900 focus:ring-slate-900"
                                />
                                <span className="text-sm font-medium text-slate-700">SMS (Specialist)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    id="role"
                                    value="CMS"
                                    checked={formData.role === 'CMS'}
                                    onChange={handleChange}
                                    className="text-slate-900 focus:ring-slate-900"
                                />
                                <span className="text-sm font-medium text-slate-700">CMS (Case Manager)</span>
                            </label>
                        </div>
                    </div>

                    {/* Unique ID */}
                    <div>
                        <label htmlFor="smsId" className="block text-xs font-semibold tracking-wide text-slate-400 mb-2">
                            Unique ID (SMS/CMS) <span className="text-slate-400">*</span>
                        </label>
                        <input
                            id="smsId"
                            type="text"
                            value={formData.smsId}
                            onChange={handleChange}
                            required
                            placeholder="Enter your ID"
                            className="w-full rounded-md border border-slate-200 bg-blue-50/40 px-4 py-3 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-300 transition"
                        />
                    </div>

                    {/* Full Name */}
                    <div>
                        <label htmlFor="name" className="block text-xs font-semibold tracking-wide text-slate-400 mb-2">
                            Full Name <span className="text-slate-400">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your name"
                            className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-300 transition placeholder:text-slate-400"
                        />
                    </div>

                    {/* Conditional fields for SMS */}
                    {formData.role === 'SMS' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="experience" className="block text-xs font-semibold tracking-wide text-slate-400 mb-2">
                                    Experience <span className="text-slate-400">*</span>
                                </label>
                                <input
                                    id="experience"
                                    type="text"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required={formData.role === 'SMS'}
                                    placeholder="e.g. 3 years"
                                    className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-300 transition placeholder:text-slate-400"
                                />
                            </div>
                            <div>
                                <label htmlFor="position" className="block text-xs font-semibold tracking-wide text-slate-400 mb-2">
                                    Position / Title
                                </label>
                                <input
                                    id="position"
                                    type="text"
                                    value={formData.position}
                                    onChange={handleChange}
                                    placeholder="e.g. Senior Specialist"
                                    className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-300 transition placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    )}

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-xs font-semibold tracking-wide text-slate-400 mb-2">
                            Password <span className="text-slate-400">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Min 6 chars"
                                className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 pr-10 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition placeholder:text-slate-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold tracking-wide text-sm py-3.5 rounded-md transition mt-2 disabled:opacity-70 flex justify-center items-center"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'REGISTER'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    Already have an ID?{' '}
                    <Link to="/login" className="text-blue-800 font-semibold hover:underline">
                        Go to Login
                    </Link>
                </p>
                <p className="text-center text-xs text-slate-400 mt-4">
                    Powered by C-Net Infotech Pvt. Ltd.
                </p>
            </div>
        </div>
    );
};

export default Register;
