import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Scale,
    FolderClosed,
    Search,
    Bot,
    ChevronLeft,
    Bell,
    FileText,
    Settings,
    LogOut,
    ArrowRight,
    X
} from 'lucide-react';
import { api } from '../api';
import AlertModal from '../components/AlertModal';
import { useNavigate } from 'react-router-dom';

const INDIA_DATA: Record<string, string[]> = {
  "Andaman and Nicobar Islands": ["Port Blair", "Other"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Rajahmundry", "Other"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Pasighat", "Other"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Other"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Ara", "Other"],
  "Chandigarh": ["Chandigarh", "Other"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Other"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa", "Other"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi", "Other"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Other"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Other"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Rohtak", "Karnal", "Hisar", "Other"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi", "Solan", "Other"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Other"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Other"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Davangere", "Ballari", "Other"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Alappuzha", "Other"],
  "Ladakh": ["Leh", "Kargil", "Other"],
  "Lakshadweep": ["Kavaratti", "Other"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa", "Other"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Thane", "Navi Mumbai", "Other"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Other"],
  "Meghalaya": ["Shillong", "Tura", "Cherrapunji", "Other"],
  "Mizoram": ["Aizawl", "Lunglei", "Other"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Other"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Other"],
  "Puducherry": ["Puducherry", "Karaikal", "Ozhukarai", "Other"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Other"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Other"],
  "Sikkim": ["Gangtok", "Namchi", "Other"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Other"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Other"],
  "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Other"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Noida", "Other"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rishikesh", "Other"],
  "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda", "Kharagpur", "Howrah", "Other"],
  "Other": ["Other"]
};
const INDIAN_STATES = Object.keys(INDIA_DATA).sort();

const CMSDashboard = ({ user, onNavigateToLexAI }: any) => {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlert, setSelectedAlert] = useState<any>(null);
    const [smeList, setSmeList] = useState<any[]>([]);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        clientName: '',
        age: '',
        sex: '',
        state: '',
        city: '',
        subject: '',
        summary: '',
        sme: '',
    });

    const [documents, setDocuments] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState('');

    const loadData = async () => {
        try {
            const currentClientId = user?.clientId || 'GUEST-01';
            const casesRes = await api.getCases(currentClientId);
            const myCaseIds = new Set(casesRes.map((c: any) => c.id));
            const alertsRes = await api.getAlerts();
            const myAlerts = alertsRes.filter((a: any) => myCaseIds.has(a.caseId));
            setAlerts(myAlerts);
        } catch (err) {
            console.error('Error polling data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchSmeList = async () => {
            try {
                const list = await api.getSmsUsers();
                setSmeList(list);
            } catch (err) {
                console.error("Failed to load SME list", err);
            }
        };
        fetchSmeList();

        loadData();
        const interval = setInterval(loadData, 2500); // Live sync every 2.5 seconds
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileUpload = (e: any) => {
        const files = Array.from(e.target.files) as File[];
        if (files.length > 0) {
            files.forEach(f => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setDocuments(prev => [...prev, {
                        name: f.name,
                        size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
                        url: event.target?.result
                    }]);
                };
                reader.readAsDataURL(f);
            });
        }
    };

    const removeDoc = (index: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const handleCaseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const ageNum = parseInt(formData.age);
        if (ageNum < 18 || ageNum > 90) {
            alert('Age must be between 18 and 90 years.');
            return;
        }

        setSubmitting(true);
        setSubmitSuccess('');

        try {
            const currentClientId = user?.clientId || 'GUEST-01';
            const allCases = await api.getCases();
            const clientCases = allCases.filter((c: any) => c.clientId === currentClientId);
            const nextNumber = clientCases.length + 1;
            const generatedCaseId = `CASE-${nextNumber.toString().padStart(2, '0')}`;

            const payload = {
                id: generatedCaseId,
                clientId: currentClientId,
                clientName: formData.clientName,
                age: formData.age,
                sex: formData.sex,
                city: formData.city,
                state: formData.state,
                category: formData.subject, // Map to their logic
                details: formData.summary,  // Map to their logic
                documents: documents,
                targetSme: formData.sme
            };

            const res = await api.createCase(payload);
            setSubmitSuccess(`Case registered successfully with ID: ${res.case.id}. Sent to SMS for approval!`);

            setFormData({
                clientName: '',
                age: '',
                sex: '',
                city: '',
                state: '',
                subject: '',
                summary: '',
                sme: ''
            });
            setDocuments([]);
            loadData();
            setTimeout(() => setSubmitSuccess(''), 6000);
        } catch (err: any) {
            alert(err.message || 'Failed to submit case');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAlertClick = async (alert: any) => {
        setSelectedAlert(alert);
        if (!alert.read) {
            await api.markAlertRead(alert.id);
            loadData();
        }
    };

    const handleCloseAlert = () => {
        setSelectedAlert(null);
    };

    const handleLogout = async () => {
        await api.logout();
        navigate('/login');
    };

    const unreadAlertsCount = alerts.filter(a => !a.read).length;

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
                        className="flex items-center gap-3 pl-4 pr-3 py-3 rounded-md text-[14px] font-semibold text-[#2563EB] border-l-[3px] border-[#2563EB] bg-[#EFF4FF]"
                    >
                        <FolderClosed className="w-[18px] h-[18px]" strokeWidth={2} />
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
                <div className="max-w-[1140px] mx-auto px-8 py-8">
                    {/* Powered by */}
                    <div className="flex justify-end mb-6">
                        <p className="text-[11px] text-[#9CA3AF] bg-white border border-[#E5E7EB] rounded-full px-3.5 py-1.5">
                            Powered by C-Net Infotech Pvt. Ltd.
                        </p>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-[34px] leading-tight text-[#111827]">
                            <span className="font-bold">CMS</span>{' '}
                            <span className="font-normal text-[#4B5563]">(Case Management System)</span>
                        </h1>
                        <p className="text-[14px] text-[#6B7280] leading-relaxed max-w-[620px] mt-1.5">
                            Register new legal cases, submit case documentation to SMS Specialists for
                            review, track old case processes, and manage AI legal intelligence.
                        </p>
                    </div>

                    <div className="flex gap-6 items-start">
                        {/* Form column */}
                        <div className="flex-1 min-w-0">
                            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                                {/* Form Header */}
                                <div className="flex items-center gap-3 px-6 py-4 border-b border-[#E5E7EB]">
                                    <FileText className="w-[18px] h-[18px] text-[#374151]" strokeWidth={1.75} />
                                    <div>
                                        <h3 className="font-semibold text-[15px] text-[#111827]">
                                            Register &amp; Submit New Case
                                        </h3>
                                        <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                                            This case will be routed immediately to the Subject Matter Specialist
                                            (SMS) for validation
                                        </p>
                                    </div>
                                </div>

                                <div className="px-6 pt-4">
                                    {submitSuccess && (
                                        <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-3 rounded-lg text-[13px] font-medium flex items-center gap-2">
                                            <span>✓</span> {submitSuccess}
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleCaseSubmit} className="px-6 py-6 space-y-5">
                                    {/* Client, age, sex */}
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-6">
                                            <label className="block text-[11px] font-semibold tracking-wide text-[#374151] mb-1.5">
                                                CLIENT / APPLICANT NAME <span className="text-[#DC2626]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="clientName"
                                                value={formData.clientName}
                                                onChange={handleChange}
                                                required
                                                className="w-full text-[13px] px-4 py-2.5 rounded-lg border border-[#D1D5DB] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 placeholder:text-[#9CA3AF] transition bg-white"
                                                placeholder="e.g. Ramesh Chandra"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label className="block text-[11px] font-semibold tracking-wide text-[#374151] mb-1.5">
                                                AGE <span className="text-[#DC2626]">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleChange}
                                                required
                                                className="w-full text-[13px] px-4 py-2.5 rounded-lg border border-[#D1D5DB] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 placeholder:text-[#9CA3AF] transition bg-white"
                                                placeholder="e.g. 42"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label className="block text-[11px] font-semibold tracking-wide text-[#374151] mb-1.5">
                                                SEX <span className="text-[#DC2626]">*</span>
                                            </label>
                                            <select
                                                name="sex"
                                                value={formData.sex}
                                                onChange={handleChange}
                                                required
                                                className="w-full text-[13px] px-4 py-2.5 rounded-lg border border-[#D1D5DB] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 bg-white text-[#374151] transition"
                                            >
                                                <option value="" disabled>Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* State, city */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-semibold tracking-wide text-[#374151] mb-1.5">
                                                STATE <span className="text-[#DC2626]">*</span>
                                            </label>
                                            <select
                                                name="state"
                                                value={formData.state}
                                                onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })}
                                                required
                                                className="w-full text-[13px] px-4 py-2.5 rounded-lg border border-[#D1D5DB] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 bg-white text-[#374151] transition"
                                            >
                                                <option value="" disabled>Select State</option>
                                                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold tracking-wide text-[#374151] mb-1.5">
                                                CITY / DISTRICT <span className="text-[#DC2626]">*</span>
                                            </label>
                                            {formData.state === 'Other' ? (
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full text-[13px] px-4 py-2.5 rounded-lg border border-[#D1D5DB] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition bg-white"
                                                    placeholder="Enter your city"
                                                />
                                            ) : (
                                                <select
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    disabled={!formData.state}
                                                    required
                                                    className="w-full text-[13px] px-4 py-2.5 rounded-lg border border-[#D1D5DB] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 bg-white text-[#374151] transition"
                                                >
                                                    <option value="" disabled>{formData.state ? 'Select City' : 'Select State First'}</option>
                                                    {formData.state && (INDIA_DATA[formData.state] || ['Other']).map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            )}
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-[11px] font-semibold tracking-wide text-[#374151] mb-1.5">
                                            CASE SUBJECT <span className="text-[#DC2626]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full text-[13px] px-4 py-2.5 rounded-lg border border-[#D1D5DB] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 placeholder:text-[#9CA3AF] transition bg-white"
                                            placeholder="e.g. Ancestral Property Dispute / Bail Application"
                                        />
                                    </div>

                                    {/* Summary */}
                                    <div>
                                        <label className="block text-[11px] font-semibold tracking-wide text-[#374151] mb-1.5">
                                            FACTS/ CASE SUMMARY <span className="text-[#DC2626]">*</span>
                                        </label>
                                        <textarea
                                            name="summary"
                                            value={formData.summary}
                                            onChange={handleChange}
                                            required
                                            rows={4}
                                            className="w-full text-[13px] px-4 py-2.5 rounded-lg border border-[#D1D5DB] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 placeholder:text-[#9CA3AF] resize-none transition bg-white"
                                            placeholder="Describe the legal conflict, parties involved, factual timeline, and specific relief sought…"
                                        />
                                    </div>

                                    {/* Upload */}
                                    <div>
                                        <label className="block text-[11px] font-semibold tracking-wide text-[#374151] mb-1.5">
                                            CASE SUPPORTING DOCUMENTS UPLOAD <span className="text-[#DC2626]">*</span>
                                        </label>
                                        <div className="border-2 border-dashed border-[#D1D5DB] bg-[#F7F8FA]/50 rounded-lg py-8 flex flex-col items-center justify-center text-center relative hover:border-[#2563EB]/40 hover:bg-[#F7F8FA] transition-colors">
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileUpload}
                                                required={documents.length === 0}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <FileText className="w-5 h-5 text-[#9CA3AF] mb-2.5" strokeWidth={1.5} />
                                            <p className="text-[13px] font-semibold text-[#111827] mb-0.5">
                                                Click or Drag &amp; Drop Documents Here
                                            </p>
                                            <p className="text-[11px] text-[#9CA3AF]">
                                                PDF, DOCX, Scanned Legal Deeds, Evidence Papers (up to 25MB)
                                            </p>
                                        </div>
                                        
                                        {/* Document Chips */}
                                        {documents.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {documents.map((doc, idx) => (
                                                    <div key={idx} className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-md px-2.5 py-1 text-[12px] font-medium">
                                                        <FileText className="w-3.5 h-3.5" />
                                                        {doc.name} <span className="text-blue-400 text-[10px]">({doc.size})</span>
                                                        <button type="button" onClick={() => removeDoc(idx)} className="text-red-400 hover:text-red-600 ml-1">
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer with SME and Submit */}
                                    <div className="flex items-end justify-between pt-5 border-t border-[#E5E7EB]">
                                        <div className="w-64">
                                            <label className="block text-[11px] font-semibold tracking-wide text-[#374151] mb-1.5">
                                                WHICH SME TO SEND THIS CASE FILE? <span className="text-[#DC2626]">*</span>
                                            </label>
                                            <select
                                                name="sme"
                                                value={formData.sme}
                                                onChange={handleChange}
                                                required
                                                className="w-full text-[13px] px-4 py-2.5 rounded-lg border border-[#D1D5DB] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 bg-white text-[#374151] transition"
                                            >
                                                <option value="" disabled>Select your SME</option>
                                                {smeList.map((sme: any) => (
                                                    <option key={sme.smsId} value={sme.smsId}>{sme.smsId} — {sme.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="bg-[#111827] text-white px-6 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#1F2937] transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap disabled:opacity-70"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Case to SMS for Approval'}
                                            {!submitting && <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Docket column */}
                        <div className="w-[300px] flex-shrink-0">
                            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden sticky top-8">
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB]">
                                    <div className="flex items-center gap-2">
                                        <Bell className="w-3.5 h-3.5 text-[#374151]" strokeWidth={1.75} />
                                        <h3 className="font-semibold text-[14px] text-[#111827]">
                                            SMS Live Replies
                                        </h3>
                                    </div>
                                    {unreadAlertsCount > 0 && (
                                        <span className="bg-[#DC2626] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                            {unreadAlertsCount} NEW
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="px-5 py-3 text-[11.5px] text-[#6B7280] leading-relaxed border-b border-[#E5E7EB]">
                                    Click any reply notification to open the{' '}
                                    <span className="font-semibold text-[#374151]">
                                        structured review window
                                    </span>{' '}
                                    with full details &amp; Lex AI instructions.
                                </p>

                                {/* Reply items */}
                                <div className="max-h-[500px] overflow-y-auto">
                                    {alerts.length === 0 && (
                                        <div className="px-5 py-8 text-center text-[12px] text-[#9CA3AF]">
                                            No incoming replies from SMS yet. Submitting a case will trigger SMS specialist review.
                                        </div>
                                    )}
                                    {alerts.map((a: any, idx: number) => (
                                        <button
                                            key={a.id}
                                            type="button"
                                            onClick={() => handleAlertClick(a)}
                                            className={`w-full text-left block px-5 py-3.5 border-l-[3px] transition-colors ${
                                                !a.read 
                                                    ? 'border-[#2563EB] bg-[#EFF4FF] hover:bg-[#E4EDFF]' 
                                                    : 'border-transparent hover:bg-[#F7F8FA] border-t border-[#E5E7EB]'
                                            } ${idx === 0 && a.read ? 'border-t-0' : ''}`}
                                        >
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h4 className={`text-[13px] font-semibold ${!a.read ? 'text-[#2563EB]' : 'text-[#111827]'}`}>
                                                    {a.title}
                                                </h4>
                                                {!a.read && (
                                                    <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full flex-shrink-0"></span>
                                                )}
                                            </div>
                                            <p className="text-[11.5px] text-[#6B7280] mb-2 line-clamp-2">
                                                {a.message ? a.message.substring(0, 65) : 'Click to view details...'}...
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-[#9CA3AF]">Ref: {a.caseId}</span>
                                                <span className={`text-[11px] font-semibold ${!a.read ? 'text-[#2563EB]' : 'text-[#374151]'}`}>
                                                    Open Window →
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {selectedAlert && (
                <AlertModal 
                    alert={selectedAlert} 
                    onClose={() => setSelectedAlert(null)} 
                    onNavigateToLexAI={onNavigateToLexAI} 
                />
            )}
        </div>
    );
};

export default CMSDashboard;