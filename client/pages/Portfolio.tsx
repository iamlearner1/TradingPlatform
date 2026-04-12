import { ArrowLeft, Briefcase, StickyNote, Activity, ShieldCheck, ChevronRight } from "lucide-react";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

type SelectedLeg = { strike: number, type: 'CE' | 'PE', action: 'Buy' | 'Sell', qty: number, ltp: number };

export default function Portfolio() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialTab = searchParams.get('tab') === 'paperPortfolio' ? 'Paper Portfolio' : 'Real Portfolio';
  const [activeTab, setActiveTab] = useState(initialTab);

  const executedStrategy = location.state?.executedStrategy as SelectedLeg[] | undefined;
  const hasPaperTrades = executedStrategy && executedStrategy.length > 0;

  const totalInvested = executedStrategy?.reduce((acc, leg) => acc + (leg.ltp * leg.qty * 65), 0) || 0;
  // Mock slight positive P&L for demonstration
  const todayPnL = totalInvested > 0 ? totalInvested * 0.015 : 0; 
  const currentTotal = totalInvested + todayPnL;
  const simulatedWealthAvailable = 1000000 - totalInvested;

  useEffect(() => {
    if (searchParams.get('tab') === 'paperPortfolio') {
      setActiveTab('Paper Portfolio');
    }
  }, [searchParams]);

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
          <div className="flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            {/* Header / Info box */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-3 shadow-sm border border-emerald-100">
                 <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-1">Link Real Portfolio</h2>
              <p className="text-gray-500 text-[13px] leading-relaxed max-w-sm mx-auto mb-6">
                Sync your live holdings safely and track all your investments, margins, and P&L in one place.
              </p>
              
              <div className="w-full text-left bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900">Secure & Encrypted</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">We use bank-level 256-bit encryption. We cannot execute trades without your direct confirmation.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 py-1 px-2">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Supported Brokers</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Broker List */}
            <div className="grid grid-cols-1 gap-3 pb-8">
               {[
                 { name: "Zerodha (Kite)", icon: "Z", color: "bg-[#FF5722]" },
                 { name: "Groww", icon: "G", color: "bg-[#00D09C]" },
                 { name: "Upstox", icon: "U", color: "bg-[#411171]" },
                 { name: "Angel One", icon: "A", color: "bg-[#0A2351]" },
                 { name: "Dhan", icon: "D", color: "bg-[#1D2B4F]" },
                 { name: "ICICI Direct", icon: "I", color: "bg-[#F18121]" }
               ].map((broker) => (
                 <button key={broker.name} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group">
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-inner text-lg ${broker.color}`}>
                        {broker.icon}
                     </div>
                     <span className="font-bold text-gray-800 group-hover:text-violet-700 transition-colors text-[15px]">{broker.name}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-violet-600 font-bold text-[13px] bg-violet-50 px-3 py-1.5 rounded-lg opacity-90 group-hover:opacity-100">
                     Connect 
                     <ChevronRight className="w-4 h-4 -mr-1" />
                   </div>
                 </button>
               ))}
            </div>
          </div>
        )}

        {activeTab === "Paper Portfolio" && (
          <div className="flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            {!hasPaperTrades ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 mb-4 shadow-sm border border-violet-100">
                   <StickyNote className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Strategies</h2>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto mb-6">
                  You haven't executed any paper trades yet. Go to Option Chain to build and execute a strategy without real risk.
                </p>
                <button 
                  onClick={() => navigate('/option-chain/nifty50')}
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors shadow-violet-500/20 active:scale-[0.98]"
                >
                  Build a Strategy
                </button>
              </div>
            ) : (
              <>
                {/* Portfolio Summary Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Available Sim Cash</p>
                      <h2 className="text-xl font-black text-gray-900">₹ {simulatedWealthAvailable.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Overall P&L</p>
                      <p className="text-[#008000] font-bold text-sm bg-green-50 px-2 py-0.5 rounded-md inline-block">
                        +₹ {todayPnL.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} (1.50%)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-1">
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs mb-0.5">Invested Value</p>
                      <p className="text-gray-900 font-bold text-sm">₹ {totalInvested.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-gray-500 text-xs mb-0.5">Current Value</p>
                      <p className="text-gray-900 font-bold text-sm">
                        ₹ {currentTotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center px-1">
                   <h3 className="text-sm font-bold text-gray-900">Simulated Holdings ({executedStrategy.length})</h3>
                   <button className="text-xs text-violet-600 font-bold">Filter</button>
                </div>

                {/* Holdings List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                  <ul className="divide-y divide-gray-100">
                    {executedStrategy.map((leg, idx) => {
                      const legTotal = leg.ltp * leg.qty * 65;
                      const dummyLtpIncrease = leg.ltp * 1.015; // 1.5% profit
                      const dummyLegValue = dummyLtpIncrease * leg.qty * 65;
                      const profit = dummyLegValue - legTotal;

                      return (
                        <li key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${leg.action === 'Buy' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                  {leg.action.toUpperCase()}
                                </span>
                                <h4 className="font-bold text-gray-900 leading-tight">NIFTY {leg.strike} {leg.type}</h4>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-0.5">{leg.qty * 65} Qty • Avg ₹{leg.ltp.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900 text-sm">₹ {dummyLegValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                              <p className="text-[11px] font-bold text-[#008000] mt-0.5">+₹ {profit.toLocaleString('en-IN', {minimumFractionDigits: 2})} (1.50%)</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">Invested: ₹ {legTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                            <p className="text-xs text-gray-900 font-medium">LTP: <span className="font-bold">₹ {dummyLtpIncrease.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
