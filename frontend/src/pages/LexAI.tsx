import React from 'react';
import { Link } from 'react-router-dom';
import {
    Scale,
    FolderClosed,
    Search,
    Bot,
    ChevronLeft,
    Settings,
    Cpu,
    LogOut
} from 'lucide-react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

const LexAI = ({ user }: any) => {
    const navigate = useNavigate();

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
                        className="flex items-center gap-3 pl-4 pr-3 py-3 rounded-md text-[14px] font-medium text-[#6B7280] border-l-[3px] border-transparent hover:text-[#111827] hover:bg-[#F7F8FA] transition-colors"
                    >
                        <Search className="w-[18px] h-[18px]" strokeWidth={1.75} />
                        Cases Tracker
                    </Link>
                    <Link
                        to="/lex-ai"
                        className="flex items-center gap-3 pl-4 pr-3 py-3 rounded-md text-[14px] font-semibold text-[#111827] border-l-[3px] border-[#111827] bg-[#F3F4F6]"
                    >
                        <Bot className="w-[18px] h-[18px]" strokeWidth={2} />
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
            <main className="flex-1 ml-[264px] flex flex-col">
                <div className="max-w-[900px] mx-auto px-10 py-16 w-full flex-1 flex flex-col">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-3">
                            Lex AI
                        </h1>
                        <p className="text-[14px] text-[#6B7280] max-w-[600px] mx-auto leading-relaxed">
                            Execute the legal prompt designated by the SMS specialist, generate case law synthesis, and transmit results back for final SMS approval.
                        </p>
                    </div>

                    {/* Integration Container */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-16 flex flex-col items-center justify-center text-center mt-6">
                        <div className="w-16 h-16 bg-[#F3F4F6] rounded-xl flex items-center justify-center mb-6">
                            <Cpu className="w-8 h-8 text-[#111827]" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-[18px] font-bold text-[#111827] mb-3">
                            Lex AI Integration Container
                        </h2>
                        <p className="text-[14px] text-[#9CA3AF] max-w-[500px] leading-relaxed">
                            This dashboard has been left empty and prepared for integration. You can inject your local Lex AI Application via API, iframe, or source code directly into this component.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LexAI;
