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
          <div className="flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            {/* Portfolio Summary Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Simulated Wealth</p>
                  <h2 className="text-2xl font-black text-gray-900">₹ 1,24,500.00</h2>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Overall P&L</p>
                  <p className="text-[#008000] font-bold text-sm bg-green-50 px-2 py-0.5 rounded-md inline-block">
                    +₹ 24,500.00 (24.50%)
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-1">
                <div className="flex-1">
                  <p className="text-gray-500 text-xs mb-0.5">Invested Value</p>
                  <p className="text-gray-900 font-bold text-sm">₹ 1,00,000.00</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-gray-500 text-xs mb-0.5">Today's P&L</p>
                  <p className="text-[#008000] font-bold text-sm">
                    +₹ 1,200.00 (1.20%)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center px-1">
               <h3 className="text-sm font-bold text-gray-900">Simulated Holdings (3)</h3>
               <button className="text-xs text-violet-600 font-bold">Filter</button>
            </div>

            {/* Holdings List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {/* Holding 1 */}
                <li className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">RELIANCE</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">10 Qty • Avg ₹2,100.00</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">₹ 24,000.00</p>
                      <p className="text-[11px] font-bold text-[#008000] mt-0.5">+₹ 3,000.00 (14.28%)</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Invested: ₹ 21,000.00</p>
                    <p className="text-xs text-gray-900 font-medium">LTP: <span className="font-bold">₹ 2,400.00</span></p>
                  </div>
                </li>

                {/* Holding 2 */}
                <li className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">TCS</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">5 Qty • Avg ₹3,500.00</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">₹ 18,000.00</p>
                      <p className="text-[11px] font-bold text-[#008000] mt-0.5">+₹ 500.00 (2.85%)</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Invested: ₹ 17,500.00</p>
                    <p className="text-xs text-gray-900 font-medium">LTP: <span className="font-bold">₹ 3,600.00</span></p>
                  </div>
                </li>

                {/* Holding 3 */}
                <li className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">HDFCBANK</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">20 Qty • Avg ₹1,600.00</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">₹ 31,000.00</p>
                      <p className="text-[11px] font-bold text-[#dc2626] mt-0.5">-₹ 1,000.00 (-3.12%)</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Invested: ₹ 32,000.00</p>
                    <p className="text-xs text-gray-900 font-medium">LTP: <span className="font-bold">₹ 1,550.00</span></p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Interactive Call to Action */}
            <div className="mt-2 text-center pb-4">
              <button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors shadow-violet-500/20 active:scale-[0.98]">
                 Execute Paper Trade
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
