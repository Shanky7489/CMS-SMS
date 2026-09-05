import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Scale,
    FolderClosed,
    Search,
    Bot,
    ChevronLeft,
    Settings,
    Inbox,
    FileText,
    Clock,
    LogOut,
    X,
    Eye,
    RefreshCw,
    Send,
    Paperclip
} from 'lucide-react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

const TABS = ['Pending', 'Under Review', 'Completed'] as const;
type TabType = (typeof TABS)[number];

const CasesTracker = ({ user }: any) => {
    const [activeTab, setActiveTab] = useState<TabType>('Pending');
    const [query, setQuery] = useState('');
    const [cases, setCases] = useState<any[]>([]);
    const [selectedCase, setSelectedCase] = useState<any>(null);
    const [previewDoc, setPreviewDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [messageInputs, setMessageInputs] = useState<Record<string, string>>({});
    const [messageAttachments, setMessageAttachments] = useState<Record<string, any[]>>({});
    const navigate = useNavigate();

    const handleSendMessage = async (caseId: string) => {
        const text = messageInputs[caseId];
        const attachments = messageAttachments[caseId] || [];
        
        if ((!text || text.trim() === '') && attachments.length === 0) return;

        try {
            await api.addCaseMessage(caseId, {
                sender: 'CMS User',
                text: text?.trim() || '',
                attachments: attachments
            });
            setMessageInputs(prev => ({ ...prev, [caseId]: '' }));
            setMessageAttachments(prev => ({ ...prev, [caseId]: [] }));
            // the list will refresh automatically via polling
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    const fetchCases = async () => {
        setLoading(true);
        try {
            const clientId = user?.clientId || 'GUEST-01';
            const fetchedCases = await api.getCases(clientId);
            setCases(fetchedCases);
            // Also update selectedCase if it exists
            if (selectedCase) {
                const updatedSelected = fetchedCases.find((c: any) => c.id === selectedCase.id);
                if (updatedSelected) setSelectedCase(updatedSelected);
            }
        } catch (error) {
            console.error("Failed to fetch cases:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCases();
    }, [user]);

    // Filter cases by tab and search query
    const filteredCases = cases.filter(c => {
        const matchesTab = c.status === activeTab;
        const matchesQuery = query === '' || 
            c.id?.toLowerCase().includes(query.toLowerCase()) || 
            c.clientName?.toLowerCase().includes(query.toLowerCase()) || 
            c.city?.toLowerCase().includes(query.toLowerCase());
        
        return matchesTab && matchesQuery;
    });

    const handleLogout = async () => {
        await api.logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex bg-[#F7F8FA] text-[#111827]">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

            {/* Sidebar */}
            <aside className="w-[264px] bg-white border-r border-[#E5E7EB] flex flex-col fixed h-full z-10">
                <div className="min-h-[88px] flex items-center px-6 py-5 border-b border-[#E5E7EB]">
                    <div className="w-9 h-9 rounded-full border border-[#111827] flex items-center justify-center mr-3 flex-shrink-0">
                        <Scale className="w-4 h-4 text-[#111827]" strokeWidth={1.75} />
                    </div>
                    <div>
                        <h2 className="font-bold text-[17px] tracking-tight text-[#111827] leading-tight uppercase">
                            CMS Portal
                        </h2>
                        <p className="text-[10.5px] text-[#9CA3AF] font-semibold tracking-wide uppercase mt-0.5">
                            Case Management
                        </p>
                    </div>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    <Link
                        to="/cms-dashboard"
                        className="flex items-center gap-3 pl-4 pr-3 py-3 rounded-md text-[14px] font-medium text-[#6B7280] border-l-[3px] border-transparent hover:text-[#111827] hover:bg-[#F7F8FA] transition-colors"
                    >
                        <FolderClosed className="w-[18px] h-[18px]" strokeWidth={1.75} />
                        Dashboard &amp; Cases
                    </Link>
                    <Link
                        to="/cases-tracker"
                        className="flex items-center gap-3 pl-4 pr-3 py-3 rounded-md text-[14px] font-semibold text-[#111827] border-l-[3px] border-[#111827] bg-[#F3F4F6]"
                    >
                        <Search className="w-[18px] h-[18px]" strokeWidth={2} />
                        Cases Tracker
                    </Link>
                    <Link
                        to="/lex-ai"
                        className="flex items-center gap-3 pl-4 pr-3 py-3 rounded-md text-[14px] font-medium text-[#6B7280] border-l-[3px] border-transparent hover:text-[#111827] hover:bg-[#F7F8FA] transition-colors"
                    >
                        <Bot className="w-[18px] h-[18px]" strokeWidth={1.75} />
                        Lex AI
                    </Link>
                </nav>

                <div className="p-4 border-t border-[#E5E7EB]">
                    <button className="flex items-center gap-2 text-xs font-medium text-[#9CA3AF] mb-4 px-2 hover:text-[#111827] transition-colors">
                        <ChevronLeft className="w-3.5 h-3.5" /> Collapse
                    </button>
                    <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB]">
                        <div className="w-9 h-9 bg-[#111827] rounded-md flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            R
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[13.5px] font-semibold text-[#111827] truncate">{user?.clientName || 'Rahul Sharma'}</p>
                            <p className="text-[10.5px] text-[#9CA3AF] truncate">ID: {user?.clientId || 'USR-101'}</p>
                        </div>
                        <button onClick={handleLogout} className="p-1.5 rounded-md hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors" title="Logout">
                            <LogOut className="w-4 h-4 flex-shrink-0" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 ml-[264px]">
                <div className="max-w-[1280px] mx-auto px-10 py-10">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-8 mb-7">
                        <div className="flex items-start gap-3">
                            <Search className="w-5 h-5 text-[#111827] mt-1" strokeWidth={2} />
                            <div>
                                <h1 className="text-[24px] font-bold text-[#111827] leading-tight">
                                    Old Cases Search &amp; Process Tracker
                                </h1>
                                <p className="text-[13.5px] text-[#6B7280] mt-1">
                                    Track current progress, review history, and legal documentation stages
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                value={query}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                                placeholder="Search by ID, Name, City..."
                                className="w-[300px] text-[13.5px] px-4 py-2.5 rounded-md border border-[#D1D5DB] bg-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 placeholder:text-[#9CA3AF] transition"
                            />
                            <button 
                                onClick={fetchCases}
                                disabled={loading}
                                className="p-2.5 bg-white border border-[#D1D5DB] hover:bg-slate-50 rounded-md transition-colors text-slate-500 hover:text-slate-800 disabled:opacity-50"
                                title="Refresh Cases"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 mb-6">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-md text-[12px] font-semibold tracking-wide uppercase transition-colors ${activeTab === tab
                                        ? 'bg-[#111827] text-white'
                                        : 'bg-white text-[#6B7280] border border-[#D1D5DB] hover:text-[#111827] hover:border-[#9CA3AF]'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Results panel */}
                    <div>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-[#E5E7EB]">
                                <div className="w-8 h-8 border-4 border-[#E5E7EB] border-t-[#2563EB] rounded-full animate-spin"></div>
                            </div>
                        ) : filteredCases.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-24 px-6 bg-white rounded-xl border border-[#E5E7EB]">
                                <Inbox className="w-9 h-9 text-[#D1D5DB] mb-4" strokeWidth={1.5} />
                                <p className="text-[14.5px] text-[#6B7280]">
                                    No {activeTab.toLowerCase()} cases found matching your criteria.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredCases.map((c) => (
                                    <div 
                                        key={c.id} 
                                        onClick={() => setSelectedCase(c)}
                                        className="group flex flex-col md:flex-row md:items-center justify-between p-5 border border-[#E5E7EB] rounded-xl hover:border-[#111827]/30 hover:shadow-md transition-all bg-white cursor-pointer"
                                    >
                                        <div className="flex items-start md:items-center gap-5">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border ${
                                                c.status === 'Pending' ? 'bg-amber-50 text-amber-500 border-amber-200' : 
                                                c.status === 'Under Review' ? 'bg-emerald-50 text-emerald-500 border-emerald-200' : 
                                                'bg-blue-50 text-blue-500 border-blue-200'
                                            }`}>
                                                <FolderClosed className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-[15px] font-bold text-[#111827]">{c.id}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                                        c.status === 'Pending' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                                                        c.status === 'Under Review' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                                                        'text-blue-600 bg-blue-50 border-blue-200'
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
                                                    <FileText className="w-3 h-3 text-[#9CA3AF]" /> {c.documents?.length || 0} Files
                                                </p>
                                                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Updated: {new Date(c.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <button 
                                                className="hidden md:block px-6 py-2.5 bg-gray-50 border border-gray-200 text-[#111827] text-[12px] font-bold uppercase tracking-wide rounded-md group-hover:bg-[#111827] group-hover:text-white transition-colors shadow-sm"
                                            >
                                                Open Case
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Case Details Modal */}
            {selectedCase && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-[850px] max-h-[90vh] overflow-y-auto flex flex-col relative">
                        {/* Modal Header */}
                        <div className="px-8 pt-8 pb-4 border-b border-[#E5E7EB] sticky top-0 bg-white z-10">
                            <button 
                                onClick={() => setSelectedCase(null)}
                                className="absolute top-6 right-6 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-2">
                                <FolderClosed className="w-6 h-6 text-[#111827]" strokeWidth={1.5} />
                                <h2 className="text-[20px] font-bold text-[#111827] uppercase tracking-wide">
                                    CASE: {selectedCase.id}
                                </h2>
                                <span className={`ml-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                    selectedCase.status === 'Pending' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                                    selectedCase.status === 'Under Review' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                                    'text-blue-600 bg-blue-50 border-blue-200'
                                }`}>
                                    {selectedCase.status}
                                </span>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="px-8 py-6">
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                    <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-2">DEMOGRAPHICS & JURISDICTION</p>
                                    <div className="text-[13px] text-[#374151] space-y-1.5 font-medium">
                                        <p><span className="font-bold text-[#111827]">Client:</span> {selectedCase.clientName}</p>
                                        <p><span className="font-bold text-[#111827]">Age/Sex:</span> {selectedCase.age} / {selectedCase.sex}</p>
                                        <p><span className="font-bold text-[#111827]">Location:</span> {selectedCase.city}, {selectedCase.state}</p>
                                        <p><span className="font-bold text-[#111827]">Category:</span> {selectedCase.category}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-2">FACTS / SUMMARY</p>
                                    <div className="text-[13px] text-[#374151] leading-relaxed whitespace-pre-wrap max-h-[150px] overflow-y-auto pr-2">
                                        {selectedCase.details}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-3">ATTACHED FILES</p>
                                {selectedCase.documents && selectedCase.documents.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCase.documents.map((doc: any, i: number) => {
                                            const isSelected = (messageAttachments[selectedCase.id] || []).some(a => a.name === doc.name);
                                            return (
                                                <div 
                                                    key={i} 
                                                    onClick={() => {
                                                        if (selectedCase.status !== 'Under Review') return;
                                                        const current = messageAttachments[selectedCase.id] || [];
                                                        if (isSelected) {
                                                            setMessageAttachments(prev => ({ ...prev, [selectedCase.id]: current.filter(a => a.name !== doc.name) }));
                                                        } else {
                                                            setMessageAttachments(prev => ({ ...prev, [selectedCase.id]: [...current, doc] }));
                                                        }
                                                    }}
                                                    className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-md text-[12px] font-medium transition-all ${selectedCase.status === 'Under Review' ? 'cursor-pointer hover:scale-[1.02]' : ''} ${
                                                        isSelected 
                                                        ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400 text-blue-800 shadow-sm' 
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
                                        })}
                                    </div>
                                ) : (
                                    <span className="text-[12px] text-[#9CA3AF] italic">No files attached to this case.</span>
                                )}
                            </div>

                            {/* Chat Section */}
                            <div className="border-t border-[#E5E7EB] pt-6 flex flex-col h-[500px]">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-[13px] font-bold uppercase text-[#111827] tracking-wider flex items-center gap-2">
                                        <Bot className="w-4 h-4 text-blue-600" />
                                        Case Discussion
                                    </h4>
                                    <span className="text-[11px] text-[#6B7280] font-medium bg-gray-100 px-2.5 py-1 rounded-full">
                                        End-to-End Encrypted
                                    </span>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto bg-[#F0F2F5] p-4 rounded-xl border border-gray-200 shadow-inner flex flex-col gap-4 relative" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 0)', backgroundSize: '20px 20px' }}>
                                    {(!selectedCase.messages || selectedCase.messages.length === 0) ? (
                                        <div className="m-auto text-center bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                                            <p className="text-gray-500 text-sm font-medium">No messages yet.</p>
                                            <p className="text-gray-400 text-xs mt-1">Start the conversation below.</p>
                                        </div>
                                    ) : (
                                        selectedCase.messages.map((msg: any, idx: number) => {
                                            const isSender = msg.sender === 'CMS User';
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

                                {selectedCase.status === 'Under Review' && (
                                    <div className="mt-4 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                                        {/* Show selected attachments */}
                                        {(messageAttachments[selectedCase.id] || []).length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3 px-2">
                                                {(messageAttachments[selectedCase.id] || []).map((doc, idx) => (
                                                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-[11.5px] font-medium">
                                                        <FileText className="w-3.5 h-3.5" />
                                                        <span className="truncate max-w-[150px]">{doc.name}</span>
                                                        <button 
                                                            onClick={() => setMessageAttachments(prev => ({ ...prev, [selectedCase.id]: prev[selectedCase.id].filter((_, i) => i !== idx) }))}
                                                            className="ml-1.5 text-blue-400 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-blue-100"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <div className="flex items-end gap-3">
                                            <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-visible focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                                
                                                {/* Document selector dropdown */}
                                                <div className="relative group ml-1">
                                                    <button 
                                                        className="p-2.5 text-gray-400 hover:text-blue-600 rounded-lg transition-colors flex items-center justify-center"
                                                        title="Reference existing case document"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                                    </button>
                                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-50 transform origin-bottom-left transition-all">
                                                        <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">Attach Reference</p>
                                                        {selectedCase.documents && selectedCase.documents.length > 0 ? (
                                                            <div className="max-h-48 overflow-y-auto">
                                                                {selectedCase.documents.map((doc: any, i: number) => (
                                                                    <button 
                                                                        key={i}
                                                                        onClick={() => {
                                                                            const current = messageAttachments[selectedCase.id] || [];
                                                                            if (!current.find(a => a.name === doc.name)) {
                                                                                setMessageAttachments(prev => ({ ...prev, [selectedCase.id]: [...current, doc] }));
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
                                                    placeholder="Type a message..."
                                                    value={messageInputs[selectedCase.id] || ''}
                                                    onChange={(e) => setMessageInputs(prev => ({ ...prev, [selectedCase.id]: e.target.value }))}
                                                    className="w-full text-[14px] px-2 py-3 bg-transparent focus:outline-none resize-none max-h-32 min-h-[44px]"
                                                    rows={1}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleSendMessage(selectedCase.id);
                                                        }
                                                    }}
                                                />
                                                
                                                <div className="mr-1">
                                                    <label className="p-2.5 text-gray-400 hover:text-blue-600 rounded-lg transition-colors flex items-center justify-center cursor-pointer" title="Upload new document">
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
                                                                            setMessageAttachments(prev => ({ ...prev, [selectedCase.id]: [...(prev[selectedCase.id] || []), newDoc] }));
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
                                                onClick={() => handleSendMessage(selectedCase.id)}
                                                disabled={(!messageInputs[selectedCase.id]?.trim() && !(messageAttachments[selectedCase.id]?.length > 0))}
                                                className="h-[46px] w-[46px] flex items-center justify-center flex-shrink-0 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                title="Send Message"
                                            >
                                                <Send className="w-5 h-5 ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
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

export default CasesTracker;