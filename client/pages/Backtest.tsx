import { ArrowLeft, PlayCircle, ChevronDown, Calendar, Moon, Settings, CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip as RechartsTooltip } from "recharts";

export default function Backtest() {
  const [activeTab, setActiveTab] = useState("Payoff");
  const [strategyCategory, setStrategyCategory] = useState("Bullish");
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>("Custom Strategy");
  
  // Custom Data for Recharts
  const chartData = useMemo(() => {
    const data = [];
    for(let i = 21000; i <= 27000; i += 100) {
        // Expiry P&L (Iron Condor shape)
        let pl = 767 - Math.max(0, 23000 - i) * 15 - Math.max(0, i - 25000) * 15;
        // T+0 estimated P&L (Smooth curve)
        let t0 = 767 - Math.pow(Math.abs(24000 - i), 2) * 0.005;
        data.push({ spot: i, pl, t0: Math.max(t0, pl - 10000) });
    }
    return data;
  }, []);

  // Gradients for positive/negative areas
  const gradientOffset = () => {
    const dataMax = Math.max(...chartData.map((i) => i.pl));
    const dataMin = Math.min(...chartData.map((i) => i.pl));
    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;
    return dataMax / (dataMax - dataMin);
  };
  const off = gradientOffset();

  const TimeButton = ({ text }: { text: string }) => (
    <button className="px-2.5 py-1.5 bg-white border border-gray-200 rounded text-[11px] text-gray-700 font-medium whitespace-nowrap min-w-[40px] hover:bg-gray-50 active:bg-gray-100 flex-1 text-center">
      {text}
    </button>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden max-w-md mx-auto relative shadow-2xl bg-[#f8f9fa]">
      {/* Top Header */}
      <div className="bg-white flex items-center px-4 py-3 border-b border-gray-100 flex-shrink-0 justify-between">
        <div className="flex items-center gap-2">
           <Link to="/" className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 transition-colors">
             <ArrowLeft className="w-5 h-5 text-gray-700" />
           </Link>
           <span className="text-[16px] font-bold text-gray-900 tracking-tight ml-1">Backtest Simulator</span>
        </div>
        <div className="flex items-center gap-3">
          <Moon className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>
      </div>

      {/* Simulator Controls */}
      <div className="bg-[#f0f2f5] px-2 py-2 flex flex-col gap-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Nifty Toggle */}
          <div className="flex items-center border border-gray-200 bg-white rounded text-sm overflow-hidden flex-1 max-w-[140px] shadow-sm">
            <div className="bg-[#1e1b4b] text-white font-bold px-2 py-1.5 flex items-center justify-center text-xs">50</div>
            <div className="font-bold text-gray-900 px-2 flex-1">NIFTY</div>
            <div className="flex items-center text-gray-400 gap-1 px-1">
               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
          
          {/* Autoplay */}
          <div className="flex border border-blue-100 bg-[#eff6ff] rounded items-center px-2 py-1.5 flex-shrink-0 shadow-sm cursor-pointer hover:bg-blue-50 transition-colors">
            <PlayCircle className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
            <span className="text-xs font-semibold text-blue-600">Autoplay</span>
          </div>

          {/* Speed */}
          <div className="flex border border-gray-200 rounded items-center px-2 py-1.5 bg-white flex-1 min-w-[90px] justify-between shadow-sm cursor-pointer">
            <span className="text-[11px] font-medium text-gray-800">1 min/1 sec</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </div>
        </div>

        {/* Time -1 */}
        <div className="flex gap-1.5 px-0 mt-1">
           <TimeButton text="-1d" />
           <TimeButton text="SOD" />
           <TimeButton text="-1h" />
           <TimeButton text="-15m" />
           <TimeButton text="-5m" />
           <TimeButton text="-1m" />
        </div>

        {/* Date Row */}
        <div className="flex gap-1.5 mt-0.5">
           <div className="flex-1 border border-gray-200 rounded px-3 py-1.5 flex items-center justify-between bg-white shadow-sm">
             <span className="text-xs font-semibold text-gray-800">Fri, 10 Apr, 2026 09:15</span>
             <Calendar className="w-4 h-4 text-gray-400" />
           </div>
           <div className="w-[80px] bg-white rounded border border-gray-200 shadow-sm"></div>
        </div>

        {/* Time +1 */}
        <div className="flex gap-1.5 px-0 mt-0.5 pb-1">
           <TimeButton text="+1m" />
           <TimeButton text="+5m" />
           <TimeButton text="+15m" />
           <TimeButton text="+1h" />
           <TimeButton text="EOD" />
           <TimeButton text="+1d" />
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex px-3 py-2 gap-2 bg-white border-b border-gray-100 overflow-x-auto no-scrollbar flex-shrink-0">
         {['Payoff', 'Option Chain', 'Strategy Chart'].map(tab => (
           <button 
             key={tab} 
             onClick={() => setActiveTab(tab)}
             className={`px-3 py-1.5 rounded border text-[13px] font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors ${activeTab === tab ? 'bg-[#eff6ff] text-blue-600 border-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
             {tab}
             {tab === 'Strategy Chart' && <span className="bg-[#22c55e] text-white text-[9px] px-1.5 py-0.5 rounded leading-none">NEW</span>}
           </button>
         ))}
      </div>

      {/* Tab Content Area */}
      {activeTab === 'Payoff' && !selectedStrategy && (
        <div className="flex-1 overflow-y-auto bg-white flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100">
             <h3 className="text-gray-900 font-bold text-sm">Ready-Made Strategies</h3>
          </div>
          
          <div className="p-4">
             {/* Strategy Category Tabs */}
             <div className="flex flex-wrap gap-2 mb-4">
                {['Bullish', 'Bearish', 'Neutral', 'Other'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setStrategyCategory(cat)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors border ${strategyCategory === cat ? 'bg-[#eff6ff] border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    {cat}
                  </button>
                ))}
             </div>

             {/* Strategy Cards Grid */}
             <div className="grid grid-cols-2 gap-3 pb-8">
               
               {/* Buy Call */}
               <div className="border border-gray-200 p-2 rounded-xl h-36 flex flex-col active:scale-95 transition-transform cursor-pointer" onClick={() => setSelectedStrategy('Buy Call')}>
                  <div className="flex-1 w-full relative pt-4">
                     <svg viewBox="0 0 100 60" className="w-[110%] h-[110%] -left-[5%] preserve-aspect-ratio-none overflow-visible absolute inset-0">
                        <polygon points="10,35 40,35 40,40 10,40" fill="#fee2e2" opacity="0.6" />
                        <polygon points="40,35 90,35 90,10" fill="#dcfce7" opacity="0.7" />
                        <path d="M 10 40 L 40 40" stroke="#ef4444" strokeWidth="2.5" fill="none" />
                        <path d="M 40 40 L 90 10" stroke="#22c55e" strokeWidth="2.5" fill="none" />
                     </svg>
                  </div>
                  <div className="text-center pb-1 pt-2 z-10 bg-white">
                    <span className="text-[13px] font-bold text-gray-800">Buy Call</span>
                  </div>
               </div>

               {/* Sell Put */}
               <div className="border border-gray-200 p-2 rounded-xl h-36 flex flex-col active:scale-95 transition-transform cursor-pointer" onClick={() => setSelectedStrategy('Sell Put')}>
                  <div className="flex-1 w-full relative pt-4">
                     <svg viewBox="0 0 100 60" className="w-[110%] h-[110%] -left-[5%] preserve-aspect-ratio-none overflow-visible absolute inset-0">
                        <polygon points="10,35 40,35 10,50" fill="#fee2e2" opacity="0.6" />
                        <polygon points="40,35 90,35 90,20 40,20" fill="#dcfce7" opacity="0.7" />
                        <path d="M 10 50 L 40 20" stroke="#ef4444" strokeWidth="2.5" fill="none" />
                        <path d="M 40 20 L 90 20" stroke="#22c55e" strokeWidth="2.5" fill="none" />
                     </svg>
                  </div>
                  <div className="text-center pb-1 pt-2 z-10 bg-white">
                    <span className="text-[13px] font-bold text-gray-800">Sell Put</span>
                  </div>
               </div>

               {/* Bull Call Spread */}
               <div className="border border-gray-200 p-2 rounded-xl h-36 flex flex-col active:scale-95 transition-transform cursor-pointer" onClick={() => setSelectedStrategy('Bull Call Spread')}>
                  <div className="flex-1 w-full relative pt-4">
                     <svg viewBox="0 0 100 60" className="w-[110%] h-[110%] -left-[5%] preserve-aspect-ratio-none overflow-visible absolute inset-0">
                        <polygon points="10,35 30,35 30,45 10,45" fill="#fee2e2" opacity="0.6" />
                        <polygon points="45,35 90,35 90,15 45,15" fill="#dcfce7" opacity="0.7" />
                        <path d="M 10 45 L 30 45 L 45 15" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                        <path d="M 30 45 L 45 15 L 90 15" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                     </svg>
                  </div>
                  <div className="text-center pb-1 pt-2 z-10 bg-white">
                    <span className="text-[13px] font-bold text-gray-800">Bull Call Spread</span>
                  </div>
               </div>

               {/* Bull Put Spread */}
               <div className="border border-gray-200 p-2 rounded-xl h-36 flex flex-col active:scale-95 transition-transform cursor-pointer" onClick={() => setSelectedStrategy('Bull Put Spread')}>
                  <div className="flex-1 w-full relative pt-4">
                     <svg viewBox="0 0 100 60" className="w-[110%] h-[110%] -left-[5%] preserve-aspect-ratio-none overflow-visible absolute inset-0">
                        <polygon points="10,35 30,35 30,45 10,45" fill="#fee2e2" opacity="0.6" />
                        <polygon points="45,35 90,35 90,15 45,15" fill="#dcfce7" opacity="0.7" />
                        <path d="M 10 45 L 30 45 L 45 15" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                        <path d="M 30 45 L 45 15 L 90 15" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                     </svg>
                  </div>
                  <div className="text-center pb-1 pt-2 z-10 bg-white">
                    <span className="text-[13px] font-bold text-gray-800">Bull Put Spread</span>
                  </div>
               </div>

               {/* Long Calendar */}
               <div className="border border-gray-200 p-2 rounded-xl h-36 flex flex-col active:scale-95 transition-transform cursor-pointer" onClick={() => setSelectedStrategy('Long Calendar')}>
                  <div className="flex-1 w-full relative pt-4">
                     <svg viewBox="0 0 100 60" className="w-[110%] h-[110%] -left-[5%] preserve-aspect-ratio-none overflow-visible absolute inset-0">
                        <polygon points="10,35 35,35 10,48" fill="#fee2e2" opacity="0.6" />
                        <polygon points="65,35 90,35 90,48" fill="#fee2e2" opacity="0.6" />
                        <path d="M 35 35 Q 50 -5 65 35" fill="#dcfce7" opacity="0.7" />
                        <path d="M 10 48 L 35 35" stroke="#ef4444" strokeWidth="2.5" fill="none" />
                        <path d="M 35 35 Q 50 -5 65 35" stroke="#22c55e" strokeWidth="2.5" fill="none" />
                        <path d="M 65 35 L 90 48" stroke="#ef4444" strokeWidth="2.5" fill="none" />
                     </svg>
                  </div>
                  <div className="text-center pb-1 pt-2 z-10 bg-white">
                    <span className="text-[13px] font-bold text-gray-800">Long Calendar with Calls</span>
                  </div>
               </div>

               {/* Bull Condor */}
               <div className="border border-gray-200 p-2 rounded-xl h-36 flex flex-col active:scale-95 transition-transform cursor-pointer" onClick={() => setSelectedStrategy('Bull Condor')}>
                  <div className="flex-1 w-full relative pt-4">
                     <svg viewBox="0 0 100 60" className="w-[110%] h-[110%] -left-[5%] preserve-aspect-ratio-none overflow-visible absolute inset-0">
                        <polygon points="10,35 30,35 30,45 10,45" fill="#fee2e2" opacity="0.6" />
                        <polygon points="40,35 60,35 60,15 40,15" fill="#dcfce7" opacity="0.7" />
                        <polygon points="70,35 90,35 90,45 70,45" fill="#fee2e2" opacity="0.6" />
                        <path d="M 10 45 L 30 45 L 40 15" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                        <path d="M 30 45 L 40 15 L 60 15 L 70 45" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                        <path d="M 70 45 L 90 45" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                     </svg>
                  </div>
                  <div className="text-center pb-1 pt-2 z-10 bg-white">
                    <span className="text-[13px] font-bold text-gray-800">Bull Condor</span>
                  </div>
               </div>
               
             </div>
          </div>
        </div>
      )}
      
      {/* Detail State placeholder if selectedStrategy */}
      {activeTab === 'Payoff' && selectedStrategy && (
        <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
            <div className="bg-white p-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-[15px] text-gray-900">{selectedStrategy} Details</h2>
                <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded shadow-sm text-xs font-bold" onClick={() => setSelectedStrategy(null)}>Close</button>
            </div>
            
            {/* Top Stats Grid */}
            <div className="grid grid-cols-2 p-4 gap-y-4 gap-x-2 bg-white">
               <div>
                  <p className="text-[11px] text-gray-500 mb-1">P&L</p>
                  <div className="bg-emerald-50 text-emerald-700 font-bold text-sm px-2 py-0.5 rounded inline-block">0 (0.00%)</div>
               </div>
               <div>
                  <p className="text-[11px] text-gray-500 mb-1">Est. Margin</p>
                  <div className="text-gray-900 font-bold text-sm">1.46L</div>
               </div>
               <div>
                  <p className="text-[11px] text-gray-500 mb-1">POP</p>
                  <div className="text-gray-900 font-bold text-sm">94%</div>
               </div>
               <div>
                  <p className="text-[11px] text-gray-500 mb-1">Max Profit</p>
                  <div className="text-emerald-600 font-bold text-sm">+767 (0.53%)</div>
               </div>
               <div>
                  <p className="text-[11px] text-gray-500 mb-1">Max Loss</p>
                  <div className="text-red-600 font-bold text-sm">Unlimited</div>
               </div>
               <div>
                  <p className="text-[11px] text-gray-500 mb-1">Breakevens</p>
                  <div className="text-gray-900 font-bold text-xs">22940 <span className="text-gray-400 font-normal">(-3.99%)</span></div>
                  <div className="text-gray-900 font-bold text-xs mt-0.5">24962 <span className="text-gray-400 font-normal">(4.47%)</span></div>
               </div>
            </div>

            <div className="bg-white border-t border-gray-100 p-2 text-center text-[11px] font-bold text-gray-600">
               Spot: 23,893.25
            </div>

            {/* Recharts chart placeholder */}
            <div className="bg-white px-2 py-6 border-b border-gray-100 relative">
               <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset={off} stopColor="#dcfce7" stopOpacity={0.8} />
                        <stop offset={off} stopColor="#fee2e2" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="strokeColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset={off} stopColor="#22c55e" stopOpacity={1} />
                        <stop offset={off} stopColor="#ef4444" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f3f4f6" />
                    <XAxis dataKey="spot" type="number" domain={[21000, 27000]} tick={{fontSize: 10, fill: '#6b7280'}} tickLine={false} axisLine={{stroke: '#e5e7eb'}} minTickGap={30} tickFormatter={(val) => val.toLocaleString('en-IN')} />
                    <YAxis tick={{fontSize: 10, fill: '#6b7280'}} tickLine={false} axisLine={{stroke: '#e5e7eb'}} tickFormatter={(val) => val >= 100000 || val <= -100000 ? `${(val/100000).toFixed(2)}L` : val} />
                    <RechartsTooltip contentStyle={{fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} labelStyle={{fontWeight: 'bold', color: '#111827'}} formatter={(val: number) => val.toFixed(2)} labelFormatter={(label) => `Spot: ${label}`} />
                    <ReferenceLine y={0} stroke="#6b7280" strokeWidth={1} />
                    <ReferenceLine x={23893} stroke="#111827" strokeWidth={1.5} />
                    <Area type="linear" dataKey="pl" stroke="url(#strokeColor)" strokeWidth={2} fill="url(#splitColor)" isAnimationActive={false} />
                    <Line type="monotone" dataKey="t0" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" fill="none" dot={false} isAnimationActive={false} />
                  </ComposedChart>
               </ResponsiveContainer>
            </div>

            {/* Positions Table Placeholder */}
            <div className="bg-white mt-2 pb-6">
               <div className="flex px-4 border-b border-gray-100">
                  <button className="py-3 px-2 border-b-2 border-blue-600 text-blue-600 font-bold text-[13px] mr-6">Positions</button>
                  <button className="py-3 px-2 border-b-2 border-transparent text-gray-500 font-bold text-[13px] hover:text-gray-900 mr-auto">Greeks</button>
                  <button className="py-3 px-4 bg-red-50 text-red-600 font-bold text-[13px] rounded-t-lg">Reset/New</button>
                  <button className="py-3 px-3 text-gray-500 hover:text-gray-900"><Settings className="w-4 h-4" /></button>
               </div>
               
               <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-[11px] font-medium border-b border-gray-100">
                     <tr>
                        <th className="py-2.5 px-3 w-8"><CheckSquare className="w-4 h-4 text-blue-600 rounded bg-white" /></th>
                        <th className="py-2.5 px-2 text-center text-gray-900 font-bold">Top</th>
                        <th className="py-2.5 px-2">Lots</th>
                        <th className="py-2.5 px-2">Type</th>
                        <th className="py-2.5 px-2">Entry</th>
                        <th className="py-2.5 px-3">LTP/Exit</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr className="border-b border-gray-100">
                        <td className="py-3 px-3"><input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 border-gray-300" /></td>
                        <td colSpan={5} className="py-3 px-2">
                           <div className="flex items-center gap-2 text-xs">
                              <span className="font-semibold text-gray-600">Multiplier:</span>
                              <div className="flex border border-gray-200 rounded overflow-hidden h-7">
                                 <button className="px-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold border-r border-gray-200">-</button>
                                 <span className="px-4 bg-white flex items-center font-bold text-gray-900">1</span>
                                 <button className="px-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold border-l border-gray-200">+</button>
                              </div>
                              <span className="font-semibold text-gray-700 ml-2">Qty: 65</span>
                           </div>
                        </td>
                     </tr>
                     <tr className="border-b border-gray-100 bg-white">
                        <td className="py-3 px-3"><input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 border-gray-300" /></td>
                        <td className="py-3 px-2 text-center"><span className="border border-red-200 text-red-500 bg-red-50 text-[10px] font-bold px-1.5 py-0.5 rounded">S</span></td>
                        <td className="py-3 px-2 text-sm font-medium text-gray-800">1</td>
                        <td className="py-3 px-2 text-center"><span className="border border-emerald-200 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded">CE</span></td>
                        <td className="py-3 px-2 text-sm text-gray-800">3</td>
                        <td className="py-3 px-4 text-sm text-gray-800">3</td>
                     </tr>
                     <tr className="border-b border-gray-100 bg-white">
                        <td className="py-3 px-3"><input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 border-gray-300" /></td>
                        <td className="py-3 px-2 text-center"><span className="border border-red-200 text-red-500 bg-red-50 text-[10px] font-bold px-1.5 py-0.5 rounded">S</span></td>
                        <td className="py-3 px-2 text-sm font-medium text-gray-800">1</td>
                        <td className="py-3 px-2 text-center"><span className="border border-red-200 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded">PE</span></td>
                        <td className="py-3 px-2 text-sm text-gray-800">8.8</td>
                        <td className="py-3 px-4 text-sm text-gray-800">8.8</td>
                     </tr>
                  </tbody>
               </table>
            </div>
        </div>
      )}

      {/* Option Chain View */}
      {activeTab === 'Option Chain' && (
        <div className="flex-1 overflow-y-auto bg-white flex flex-col relative pb-10">
           {/* Filters */}
           <div className="px-3 py-2 border-b border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
              <button className="px-3 py-1 bg-[#eff6ff] text-blue-600 border border-blue-200 text-xs font-bold rounded-lg whitespace-nowrap">13 Apr (3d)</button>
              <button className="px-3 py-1 bg-white text-gray-700 border border-gray-200 text-xs font-bold rounded-lg whitespace-nowrap flex items-center gap-1">21 Apr (11d) <ChevronDown className="w-3 h-3" /></button>
              <button className="px-2 py-1 bg-white text-gray-500 border border-gray-200 rounded-lg ml-auto"><Settings className="w-4 h-4" /></button>
           </div>
           
           <table className="w-full text-[13px]">
              <thead className="bg-[#f8f9fa] border-b border-gray-200 sticky top-0 z-10">
                 <tr>
                    <th className="font-normal text-gray-500 py-2 px-1 text-right w-[14%] text-[11px]">CallΔ</th>
                    <th className="font-normal text-gray-500 py-2 px-1 text-left w-[18%] text-[11px]">LTP</th>
                    <th className="font-normal text-gray-500 py-2 px-1 text-right w-[18%] text-[11px]">OI</th>
                    <th className="font-bold text-gray-600 py-2 px-1 text-center border-l border-r border-gray-200 w-[20%] text-[11px]">Strike</th>
                    <th className="font-normal text-gray-500 py-2 px-1 text-left w-[18%] text-[11px]">OI</th>
                    <th className="font-normal text-gray-500 py-2 px-1 text-right w-[12%] text-[11px]">LTP</th>
                 </tr>
              </thead>
              <tbody>
                 {[
                   { s: 23950, cd: 0.46, cl: 144.75, coi: 193, coip: 10, pd: 0.48, pl: 12.3, poi: 193, poip: 10 },
                   { s: 24000, cd: 0.41, cl: 122.95, coi: 221, coip: 40, pd: 0.52, pl: 21.0, poi: 221, poip: 25, isAtm: true },
                   { s: 24050, cd: 0.36, cl: 101.50, coi: 251, coip: 15, pd: 0.58, pl: 35.6, poi: 251, poip: 10 },
                   { s: 24100, cd: 0.32, cl: 84.60, coi: 292, coip: 50, pd: 0.65, pl: 51.2, poi: 292, poip: 5 },
                   { s: 24150, cd: 0.28, cl: 69.50, coi: 322, coip: 20, pd: 0.70, pl: 72.0, poi: 322, poip: 5 },
                   { s: 24200, cd: 0.24, cl: 57.20, coi: 357, coip: 60, pd: 0.75, pl: 98.4, poi: 357, poip: 3 },
                   { s: 24250, cd: 0.20, cl: 46.25, coi: 401, coip: 30, pd: 0.81, pl: 125.1, poi: 401, poip: 2 },
                   { s: 24300, cd: 0.17, cl: 37.45, coi: 439, coip: 45, pd: 0.85, pl: 162.0, poi: 439, poip: 5 },
                 ].map((r, i) => (
                    <tr key={r.s} className="border-b border-gray-100 hover:bg-gray-50">
                       <td className="py-2.5 px-1 text-right text-gray-500 font-medium">{r.cd.toFixed(2)}</td>
                       <td className="py-2.5 px-1 text-left font-semibold text-gray-800">{r.cl.toFixed(2)}</td>
                       <td className="py-2.5 px-1 text-right text-gray-500 relative">
                          <div className="absolute right-0 top-1 bottom-1 bg-[#dcfce7] -z-10" style={{ width: `${r.coip}%` }}></div>
                          <span className="pr-1 relative z-10">{r.coi}</span>
                       </td>
                       <td className="py-2.5 px-1 text-center font-bold text-gray-900 border-l border-r border-[#f3f4f6] relative">
                          <div className="bg-white border border-gray-200 rounded px-1.5 py-0.5 inline-block text-[13px] min-w-[50px] shadow-sm">{r.s}</div>
                          {r.isAtm && (
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                <button className="bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-1">
                                   <ChevronDown className="w-3 h-3 rotate-180" /> Go to ATM
                                </button>
                             </div>
                          )}
                       </td>
                       <td className="py-2.5 px-1 text-left text-gray-500 relative">
                          <div className="absolute left-0 top-1 bottom-1 bg-[#fee2e2] -z-10" style={{ width: `${r.poip}%` }}></div>
                          <span className="pl-1 relative z-10">{r.poi}</span>
                       </td>
                       <td className="py-2.5 px-1 text-right font-semibold text-gray-800">{r.pl.toFixed(2)}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
}
