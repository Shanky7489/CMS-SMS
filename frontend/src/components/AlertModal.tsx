import React from 'react';
import { X, ExternalLink, Bot } from 'lucide-react';

const AlertModal = ({ alert, onClose, onNavigateToLexAI }) => {
  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F7F8FA]">
          <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
            {alert.title}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 text-[#9CA3AF] hover:text-[#111827] hover:bg-[#E5E7EB] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E5E7EB]">
            <div>
              <p className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider mb-1">Reference ID</p>
              <p className="text-sm font-bold text-[#111827]">{alert.caseId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider mb-1">Status</p>
              <span className="inline-block px-2 py-1 rounded bg-[#D1FAE5] text-[#065F46] text-xs font-bold">
                SMS Validated
              </span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider mb-2">Message</p>
            <p className="text-[14px] text-[#374151] leading-relaxed bg-[#F7F8FA] p-4 rounded-lg border border-[#E5E7EB]">
              {alert.message}
            </p>
          </div>

          <div className="bg-[#EFF4FF] border border-[#2563EB]/20 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#111827] mb-1">Lex AI Synthesis Ready</h4>
                <p className="text-[13px] text-[#6B7280] leading-relaxed mb-4">
                  The SMS Specialist has approved this case. Lex AI has generated a structured brief, analyzed past precedents, and prepared draft responses based on the provided documents.
                </p>
                <button 
                  onClick={() => {
                    onClose();
                    if(onNavigateToLexAI) onNavigateToLexAI();
                  }}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                  Open Lex AI Workspace <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
