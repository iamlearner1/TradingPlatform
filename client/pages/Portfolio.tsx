import { ArrowLeft, Briefcase, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("Real Portfolio");

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white flex items-center px-4 py-3 flex-shrink-0 relative z-10 shadow-sm border-b border-gray-100">
        <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <h1 className="text-base font-bold text-gray-900 ml-2">Portfolio</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-100 shadow-sm z-10 sticky top-0">
        {["Real Portfolio", "Paper Portfolio"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3.5 text-[14px] font-bold text-center border-b-[3px] transition-colors ${
              activeTab === tab
                ? "border-violet-600 text-violet-700 bg-violet-50/50"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "Real Portfolio" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 mb-4 shadow-sm border border-violet-100">
               <Briefcase className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Live Holdings</h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
              Track your actual market holdings, analyze live P&L, and monitor your total asset allocation here.
            </p>
          </div>
        )}

        {activeTab === "Paper Portfolio" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 shadow-sm border border-blue-100">
               <FileSpreadsheet className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Simulated Wealth</h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
              Track your paper trading success. Test strategies risk-free and measure your simulated portfolio's growth over time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
