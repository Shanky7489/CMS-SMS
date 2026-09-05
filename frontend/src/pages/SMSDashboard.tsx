import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Gavel, Search, LogOut, FileText, X, Eye, RefreshCw, Send, Paperclip, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CASE_CATEGORIES = [
    "Property Law / Real Estate Partition",
    "Civil Litigation & Contract Breach",
    "Criminal Defense & Bail Matter",
    "Corporate & Commercial Disputes",
    "Family & Matrimonial Law",
    "Constitutional & Writ Jurisdiction",
    "Labour & Service Law",
    "Intellectual Property / Trademark"
];

const SMSDashboard = () => {
    const [cases, setCases] = useState<any[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedCaseForReview, setSelectedCaseForReview] = useState<any>(null);
    const [reviewCategory, setReviewCategory] = useState('');
    const [reviewDirectives, setReviewDirectives] = useState('');
    const [chatInput, setChatInput] = useState('');
    const [chatAttachments, setChatAttachments] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('Pending');
    const [previewDoc, setPreviewDoc] = useState<any>(null);
    const navigate = useNavigate();

    const handleSendMessage = async (caseId: string) => {
        if (!chatInput.trim() && chatAttachments.length === 0) return;
        try {
            await api.addCaseMessage(caseId, {
                sender: 'SMS Specialist',
                text: chatInput.trim(),
                attachments: chatAttachments
            });
            setChatInput('');
            setChatAttachments([]);
            setSelectedCaseForReview((prev: any) => ({
                ...prev,
                messages: [...(prev.messages || []), { sender: 'SMS Specialist', text: chatInput.trim(), attachments: chatAttachments, createdAt: new Date() }]
            }));
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentSmeId = user?.smsId || 'SME-01'; // Fallback for safety

    const fetchCases = async () => {
        setLoading(true);
        try {
            // Fetch cases where targetSme matches the logged-in SMS user
            const fetchedCases = await api.getCases(undefined, currentSmeId);
            setCases(fetchedCases);
        } catch (err) {
            console.error("Failed to load cases:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCases();
    }, [currentSmeId]);

    const handleLogout = async () => {
        await api.logout();
        navigate('/login');
    };

    const pendingCasesCount = cases.filter(c => c.status === 'Pending').length;
    const completedCasesCount = cases.filter(c => c.status === 'Completed').length;
    const underReviewCasesCount = cases.filter(c => c.status === 'Under Review').length;

    const filteredCases = cases.filter(c => {
        const matchesTab = c.status === activeTab;
        const matchesQuery = query === '' || 
            c.id?.toLowerCase().includes(query.toLowerCase()) || 
            c.clientName?.toLowerCase().includes(query.toLowerCase()) || 
            c.city?.toLowerCase().includes(query.toLowerCase());
        return matchesTab && matchesQuery;
    });

    return (
        <div className="min-h-screen bg-[#F3F4F6] text-[#111827] flex flex-col font-sans">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
                .serif-font { font-family: 'Playfair Display', serif; }
                .sans-font { font-family: 'Inter', system-ui, sans-serif; }
            `}</style>
            
            {/* Header Area */}
            <div className="bg-white border-b border-[#E5E7EB]">
                <div className="max-w-[1400px] mx-auto px-6 pt-8 pb-4 relative">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex items-center gap-4 mb-2">
                            <Gavel className="w-10 h-10 text-[#111827]" strokeWidth={1.5} />
                            <h1 className="text-[28px] font-bold text-[#111827] tracking-wider uppercase serif-font leading-tight">
                                DEPARTMENT OF LEGAL<br/>REVIEW
                            </h1>
                        </div>
                        <p className="text-[12px] text-[#6B7280] uppercase tracking-[0.2em] font-semibold">
                            SUBJECT MATTER SPECIALIST (SMS) COMMAND CENTER
                        </p>
                    </div>
                    
                    {/* Top Right User Info */}
                    <div className="absolute top-4 right-6 flex flex-col items-end">
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-[14px] font-bold text-[#111827]">{user?.name || currentSmeId}</p>
                                <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider font-semibold">
                                    POWERED BY C-NET INFOTECH PVT. LTD.
                                </p>
                            </div>
                            <button onClick={handleLogout} className="p-2 bg-gray-50 border border-gray-200 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors" title="Logout">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8">
                
                {/* Stats Row (Tabs) */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div 
                        onClick={() => setActiveTab('Pending')}
                        className={`bg-white border-2 rounded-lg p-5 flex items-center justify-between shadow-sm cursor-pointer transition-all ${activeTab === 'Pending' ? 'border-amber-400 shadow-md ring-2 ring-amber-100' : 'border-[#E5E7EB] hover:border-gray-300'}`}
                    >
                        <span className="text-[12px] font-bold text-amber-500 tracking-wide uppercase">
                            PENDING CASE APPROVALS
                        </span>
                        <span className="text-[32px] font-bold text-[#111827] leading-none">
                            {pendingCasesCount}
                        </span>
                    </div>
                    <div 
                        onClick={() => setActiveTab('Completed')}
                        className={`bg-white border-2 rounded-lg p-5 flex items-center justify-between shadow-sm cursor-pointer transition-all ${activeTab === 'Completed' ? 'border-emerald-400 shadow-md ring-2 ring-emerald-100' : 'border-[#E5E7EB] hover:border-gray-300'}`}
                    >
                        <span className="text-[12px] font-bold text-emerald-500 tracking-wide uppercase">
                            COMPLETED CASES
                        </span>
                        <span className="text-[32px] font-bold text-[#111827] leading-none">
                            {completedCasesCount}
                        </span>
                    </div>
                    <div 
                        onClick={() => setActiveTab('Under Review')}
                        className={`bg-white border-2 rounded-lg p-5 flex items-center justify-between shadow-sm cursor-pointer transition-all ${activeTab === 'Under Review' ? 'border-blue-400 shadow-md ring-2 ring-blue-100' : 'border-[#E5E7EB] hover:border-gray-300'}`}
                    >
                        <span className="text-[12px] font-bold text-blue-500 tracking-wide uppercase">
                            UNDER REVIEW CASES
                        </span>
                        <span className="text-[32px] font-bold text-[#111827] leading-none">
                            {underReviewCasesCount}
                        </span>
                    </div>
                </div>

                {/* Docket Panel */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                    {/* Docket Header */}
                    <div className="px-8 py-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
                        <div className="flex items-center gap-4">
                            <h2 className="text-[18px] font-bold serif-font text-[#111827]">
                                Docket: {activeTab === 'Pending' ? 'Pending Case Reviews' : activeTab === 'Under Review' ? 'Cases Under Review' : 'Completed Cases'}
                            </h2>
                            <button 
                                onClick={fetchCases}
                                disabled={loading}
                                className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-500 hover:text-slate-800 disabled:opacity-50"
                                title="Refresh Cases"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search cases..."
                                className="pl-9 pr-4 py-2 w-[300px] text-[13px] border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Cases List */}
                    <div className="p-8">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                            </div>
                        ) : filteredCases.length === 0 ? (
                            <div className="text-center py-20 text-gray-500 text-[14px]">
                                No cases found in your docket.
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {filteredCases.map(c => (
                                    <div 
                                        key={c.id} 
                                        onClick={() => {
                                            setSelectedCaseForReview(c);
                                            setReviewCategory('');
                                            setReviewDirectives('');
                                        }}
                                        className="group flex flex-col md:flex-row md:items-center justify-between p-5 border border-[#E5E7EB] rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white cursor-pointer"
                                    >
                                        <div className="flex items-start md:items-center gap-5">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border ${
                                                c.status === 'Pending' ? 'bg-amber-50 text-amber-500 border-amber-200' : 
                                                c.status === 'Under Review' ? 'bg-blue-50 text-blue-500 border-blue-200' : 
                                                'bg-emerald-50 text-emerald-500 border-emerald-200'
                                            }`}>
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-[15px] font-bold text-[#111827]">{c.id}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                                        c.status === 'Pending' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                                                        c.status === 'Under Review' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                                                        'text-emerald-600 bg-emerald-50 border-emerald-200'
                                                    }`}>
                                                        {c.status}
                                                    </span>
                                                </div>
                                                <p className="text-[13px] text-[#4B5563] font-medium truncate">
                                                    {c.clientName} <span className="text-gray-300 mx-1">|</span> {c.category}
                                                </p>
                                                <p className="text-[12px] text-[#9CA3AF] mt-1 truncate max-w-[500px]">
                                                    {c.details}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-6 mt-4 md:mt-0 pl-17 md:pl-0">
                                            <div className="text-left md:text-right flex-shrink-0">
                                                <p className="text-[12px] font-semibold text-[#374151] flex items-center gap-1.5 md:justify-end">
                                                    <FileText className="w-3 h-3 text-[#9CA3AF]" /> {c.documents?.length || 0} Exhibits
                                                </p>
                                                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Filed: {new Date(c.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <button 
                                                className="hidden md:block px-6 py-2.5 bg-gray-50 border border-gray-200 text-[#111827] text-[12px] font-bold uppercase tracking-wide rounded-md group-hover:bg-[#1E3A8A] group-hover:text-white group-hover:border-[#1E3A8A] transition-colors shadow-sm"
                                            >
                                                {c.status === 'Pending' ? 'Examine' : c.status === 'Under Review' ? 'Review' : 'View'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Official Case Review Modal */}
            {selectedCaseForReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-[850px] max-h-[90vh] overflow-y-auto flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="px-8 pt-8 pb-4 relative">
                            <button 
                                onClick={() => setSelectedCaseForReview(null)}
                                className="absolute top-6 right-6 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-2">
                                <FileText className="w-7 h-7 text-[#111827]" strokeWidth={1.5} />
                                <h2 className="text-[22px] font-bold serif-font text-[#111827] uppercase tracking-wide">
                                    OFFICIAL CASE REVIEW
                                </h2>
                            </div>
                            <div className="text-[11px] font-bold text-[#6B7280] tracking-wider flex items-center gap-2">
                                <span className="uppercase">CLIENT ID: <span className="text-[#111827]">{selectedCaseForReview.clientId}</span></span>
                                <span className="text-gray-300">|</span>
                                <span className="uppercase">CASE ID: <span className="text-[#111827]">{selectedCaseForReview.id}</span></span>
                                <span className="text-gray-300">|</span>
                                <span className="uppercase">FILED: {new Date(selectedCaseForReview.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="px-8 py-4">
                            <div className="border-t border-[#E5E7EB] mb-6"></div>
                            
                            {/* Case Summary Block */}
                            <div className="grid grid-cols-4 gap-6 mb-6">
                                <div>
                                    <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-1">IN THE MATTER OF</p>
                                    <p className="text-[13px] font-bold text-[#111827]">{selectedCaseForReview.clientName}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-1">AGE / SEX</p>
                                    <p className="text-[13px] font-bold text-[#111827]">{selectedCaseForReview.age} / {selectedCaseForReview.sex}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-1">CITY</p>
                                    <p className="text-[13px] font-bold text-[#111827]">{selectedCaseForReview.city}, {selectedCaseForReview.state}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-1">CASE SUBJECT</p>
                                    <p className="text-[13px] font-bold text-[#111827]">{selectedCaseForReview.category}</p>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-2">CASE SUMMARY</p>
                                <p className="text-[13px] text-[#374151] whitespace-pre-wrap font-medium">{selectedCaseForReview.details}</p>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-2">
                                    EXHIBITS ATTACHED ({selectedCaseForReview.documents?.length || 0})
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCaseForReview.documents && selectedCaseForReview.documents.length > 0 ? (
                                        selectedCaseForReview.documents.map((doc: any, i: number) => {
                                            const isSelected = chatAttachments.some(a => a.name === doc.name);
                                            return (
                                                <div 
                                                    key={i} 
                                                    onClick={() => {
                                                        if (selectedCaseForReview.status !== 'Under Review') return;
                                                        if (isSelected) {
                                                            setChatAttachments(prev => prev.filter(a => a.name !== doc.name));
                                                        } else {
                                                            setChatAttachments(prev => [...prev, doc]);
                                                        }
                                                    }}
                                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-md text-[11px] font-medium transition-all ${selectedCaseForReview.status === 'Under Review' ? 'cursor-pointer hover:scale-[1.02]' : ''} ${
                                                        isSelected
                                                        ? 'bg-blue-50 border-blue-400 text-blue-800 ring-1 ring-blue-400 shadow-sm'
                                                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] hover:border-[#D1D5DB]'
                                                    }`}
                                                >
                                                    <FileText className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-blue-500' : 'text-[#9CA3AF]'}`} />
                                                    <span className="truncate max-w-[200px]" title={doc.name}>{doc.name}</span>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setPreviewDoc(doc); }}
                                                        className="ml-1 p-0.5 rounded-sm hover:bg-black/10 text-gray-500 hover:text-gray-900 transition-colors"
                                                        title="Preview Document"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                    {isSelected && (
                                                        <X className="w-3.5 h-3.5 ml-1 text-blue-500 hover:text-red-500" />
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <span className="text-[12px] text-gray-400 italic">No exhibits</span>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-[#E5E7EB] border-dashed mb-6"></div>

                            {selectedCaseForReview.status === 'Pending' ? (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[12px] font-bold text-[#111827] uppercase tracking-wide mb-2">
                                            1. CASE CLASSIFICATION
                                        </label>
                                        <select 
                                            value={reviewCategory}
                                            onChange={(e) => setReviewCategory(e.target.value)}
                                            className="w-full border border-[#D1D5DB] rounded-md px-4 py-2.5 text-[14px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] appearance-none bg-white"
                                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                        >
                                            <option value="" disabled>Select Case Category</option>
                                            {CASE_CATEGORIES.map((cat, idx) => (
                                                <option key={idx} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[12px] font-bold text-[#111827] uppercase tracking-wide mb-2">
                                            2. SPECIALIST VERDICT &amp; DIRECTIVES
                                        </label>
                                        <textarea 
                                            value={reviewDirectives}
                                            onChange={(e) => setReviewDirectives(e.target.value)}
                                            placeholder="Enter official directives, observations, or instructions (including AI prompts) to the CMS client..."
                                            rows={4}
                                            className="w-full border border-[#D1D5DB] rounded-md px-4 py-3 text-[14px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] placeholder-[#9CA3AF] resize-y"
                                        ></textarea>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col h-[500px]">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-[13px] font-bold uppercase text-[#111827] tracking-wider flex items-center gap-2">
                                            <Bot className="w-4 h-4 text-[#1E3A8A]" />
                                            Case Discussion
                                        </h4>
                                        <span className="text-[11px] text-[#6B7280] font-medium bg-gray-100 px-2.5 py-1 rounded-full">
                                            End-to-End Encrypted
                                        </span>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto bg-[#F0F2F5] p-4 rounded-xl border border-gray-200 shadow-inner flex flex-col gap-4 relative" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 0)', backgroundSize: '20px 20px' }}>
                                        {(!selectedCaseForReview.messages || selectedCaseForReview.messages.length === 0) ? (
                                            <div className="m-auto text-center bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                                                <p className="text-gray-500 text-sm font-medium">No messages yet.</p>
                                                <p className="text-gray-400 text-xs mt-1">Start the conversation below.</p>
                                            </div>
                                        ) : (
                                            selectedCaseForReview.messages.map((msg: any, idx: number) => {
                                                const isSender = msg.sender === 'SMS Specialist';
                                                return (
                                                    <div key={idx} className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-[85%] ${isSender ? 'self-end' : 'self-start'}`}>
                                                        <span className="text-[10px] text-gray-500 font-semibold mb-1 ml-1 mr-1">{msg.sender}</span>
                                                        <div className={`p-3.5 shadow-sm relative group ${
                                                            isSender 
                                                            ? 'bg-[#1E3A8A] text-white rounded-2xl rounded-br-sm' 
                                                            : 'bg-white text-[#111827] rounded-2xl rounded-bl-sm border border-gray-100'
                                                        }`}>
                                                            <p className={`text-[13.5px] whitespace-pre-wrap leading-relaxed ${isSender ? 'text-white/95' : 'text-gray-700'}`}>{msg.text}</p>
                                                            
                                                            {msg.attachments && msg.attachments.length > 0 && (
                                                                <div className="mt-2.5 flex flex-wrap gap-2 pt-2.5 border-t border-black/10">
                                                                    {msg.attachments.map((doc: any, i: number) => (
                                                                        <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border cursor-pointer transition-colors ${
                                                                            isSender 
                                                                            ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                                                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                                        }`} onClick={(e) => { e.stopPropagation(); setPreviewDoc(doc); }}>
                                                                            <FileText className={`w-3.5 h-3.5 ${isSender ? 'text-blue-200' : 'text-gray-400'}`} />
                                                                            <span className="truncate max-w-[150px]">{doc.name}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <div className={`text-[9px] mt-1.5 text-right font-medium ${isSender ? 'text-blue-200' : 'text-gray-400'}`}>
                                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                    
                                    {selectedCaseForReview.status === 'Under Review' && (
                                        <div className="mt-4 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                                            {/* Show selected attachments */}
                                            {chatAttachments.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-3 px-2">
                                                    {chatAttachments.map((doc, idx) => (
                                                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-[11.5px] font-medium">
                                                            <FileText className="w-3.5 h-3.5" />
                                                            <span className="truncate max-w-[150px]">{doc.name}</span>
                                                            <button 
                                                                onClick={() => setChatAttachments(prev => prev.filter((_, i) => i !== idx))}
                                                                className="ml-1.5 text-blue-400 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-blue-100"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            <div className="flex items-end gap-3">
                                                <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-visible focus-within:ring-2 focus-within:ring-[#1E3A8A]/20 focus-within:border-[#1E3A8A] transition-all">
                                                    
                                                    {/* Document selector dropdown */}
                                                    <div className="relative group ml-1">
                                                        <button 
                                                            className="p-2.5 text-gray-400 hover:text-[#1E3A8A] rounded-lg transition-colors flex items-center justify-center"
                                                            title="Reference existing case document"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                                        </button>
                                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-50 transform origin-bottom-left transition-all">
                                                            <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">Attach Reference</p>
                                                            {selectedCaseForReview.documents && selectedCaseForReview.documents.length > 0 ? (
                                                                <div className="max-h-48 overflow-y-auto">
                                                                    {selectedCaseForReview.documents.map((doc: any, i: number) => (
                                                                        <button 
                                                                            key={i}
                                                                            onClick={() => {
                                                                                if (!chatAttachments.find(a => a.name === doc.name)) {
                                                                                    setChatAttachments(prev => [...prev, doc]);
                                                                                }
                                                                            }}
                                                                            className="w-full text-left px-4 py-2.5 text-[12.5px] text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors"
                                                                        >
                                                                            <FileText className="w-4 h-4 text-blue-500" />
                                                                            <span className="truncate">{doc.name}</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="px-4 py-3 text-[11px] text-gray-400 italic text-center">No documents available</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <textarea 
                                                        placeholder="Type your reply to the CMS user..."
                                                        value={chatInput}
                                                        onChange={(e) => setChatInput(e.target.value)}
                                                        className="w-full text-[14px] px-2 py-3 bg-transparent focus:outline-none resize-none max-h-32 min-h-[44px]"
                                                        rows={1}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                e.preventDefault();
                                                                handleSendMessage(selectedCaseForReview.id);
                                                            }
                                                        }}
                                                    />
                                                    
                                                    <div className="mr-1">
                                                        <label className="p-2.5 text-gray-400 hover:text-[#1E3A8A] rounded-lg transition-colors flex items-center justify-center cursor-pointer" title="Upload new document">
                                                            <input 
                                                                type="file" 
                                                                className="hidden" 
                                                                onChange={(e) => {
                                                                    const files = Array.from(e.target.files || []);
                                                                    if (files.length > 0) {
                                                                        files.forEach(f => {
                                                                            const reader = new FileReader();
                                                                            reader.onload = (event) => {
                                                                                const newDoc = {
                                                                                    name: f.name,
                                                                                    size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
                                                                                    url: event.target?.result
                                                                                };
                                                                                setChatAttachments(prev => [...prev, newDoc]);
                                                                            };
                                                                            reader.readAsDataURL(f);
                                                                        });
                                                                    }
                                                                }}
                                                            />
                                                            <Paperclip className="w-5 h-5" />
                                                        </label>
                                                    </div>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => handleSendMessage(selectedCaseForReview.id)}
                                                    disabled={(!chatInput.trim() && chatAttachments.length === 0)}
                                                    className="h-[46px] w-[46px] flex items-center justify-center flex-shrink-0 bg-[#1E3A8A] text-white rounded-full hover:bg-[#1E3A8A]/90 hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2"
                                                    title="Send Message"
                                                >
                                                    <Send className="w-5 h-5 ml-1" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-5 border-t border-[#E5E7EB] bg-white flex justify-end gap-3 mt-auto rounded-b-lg">
                            {selectedCaseForReview.status === 'Pending' ? (
                                <button 
                                    onClick={async () => {
                                        try {
                                            await api.updateCaseStatus(selectedCaseForReview.id, {
                                                status: 'Under Review'
                                            });
                                            if (reviewDirectives.trim() !== '') {
                                                await api.addCaseMessage(selectedCaseForReview.id, {
                                                    sender: 'SMS Specialist',
                                                    text: reviewDirectives.trim()
                                                });
                                            }
                                            setSelectedCaseForReview(null);
                                        } catch (err) {
                                            console.error('Failed to update status', err);
                                        }
                                    }}
                                    className="px-6 py-3 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-[12px] font-bold uppercase tracking-wide rounded-md transition-colors shadow-sm"
                                >
                                    SEND THIS REVIEW
                                </button>
                            ) : selectedCaseForReview.status === 'Under Review' ? (
                                <button 
                                    onClick={async () => {
                                        try {
                                            await api.updateCaseStatus(selectedCaseForReview.id, {
                                                status: 'Completed'
                                            });
                                            setSelectedCaseForReview(null);
                                        } catch (err) {
                                            console.error('Failed to update status', err);
                                        }
                                    }}
                                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold uppercase tracking-wide rounded-md transition-colors shadow-sm flex items-center gap-2"
                                >
                                    MARK AS COMPLETE
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            {/* Document Preview Modal */}
            {previewDoc && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-[1000px] h-[90vh] flex flex-col relative">
                        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                            <h3 className="font-bold text-[#111827] truncate pr-8">{previewDoc.name}</h3>
                            <button 
                                onClick={() => setPreviewDoc(null)}
                                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 bg-gray-100 overflow-hidden flex items-center justify-center p-4">
                            {previewDoc.url ? (
                                previewDoc.url.startsWith('data:image/') ? (
                                    <img src={previewDoc.url} alt={previewDoc.name} className="max-w-full max-h-full object-contain shadow-sm" />
                                ) : previewDoc.url.startsWith('data:application/pdf') ? (
                                    <iframe src={previewDoc.url} className="w-full h-full rounded shadow-sm border-0" title={previewDoc.name} />
                                ) : (
                                    <div className="text-center">
                                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">No preview available for this file type.</p>
                                        <a href={previewDoc.url} download={previewDoc.name} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Download File</a>
                                    </div>
                                )
                            ) : (
                                <div className="text-center">
                                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">File content not available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SMSDashboard;
