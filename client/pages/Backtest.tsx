import { ArrowLeft, PlayCircle, ChevronDown, Calendar, Moon, Settings, CheckSquare, Trash2, PauseCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip as RechartsTooltip } from "recharts";

type Position = {
  id: string;
  type: 'CE' | 'PE';
  action: 'Buy' | 'Sell';
  strike: number;
  qty: number;
  price: number;
  enabled: boolean;
};

export default function Backtest() {
  const [activeTab, setActiveTab] = useState("Payoff");
  const [strategyCategory, setStrategyCategory] = useState("Bullish");
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>("Custom Strategy");
  const [multiplier, setMultiplier] = useState(1);
  
  // Real-time Simulation State
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [spotPrice, setSpotPrice] = useState(23900);
  const [currentDate, setCurrentDate] = useState(new Date("2026-04-10T09:15:00"));
  
  // Dropdown States
  const [showSymbolDropdown, setShowSymbolDropdown] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState("NIFTY");

  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [timeBound, setTimeBound] = useState(1); // 1, 5, 15 minutes per tick
  
  const INDICES = ["NIFTY", "BANKNIFTY", "FINNIFTY", "SENSEX"];

  const [positions, setPositions] = useState<Position[]>([
    { id: '1', action: 'Sell', qty: 1, type: 'CE', strike: 24000, price: 122.95, enabled: true },
    { id: '2', action: 'Sell', qty: 1, type: 'PE', strike: 23800, price: 105.50, enabled: true },
    { id: '3', action: 'Buy', qty: 1, type: 'CE', strike: 24200, price: 57.20, enabled: true },
    { id: '4', action: 'Buy', qty: 1, type: 'PE', strike: 23600, price: 45.10, enabled: true }
  ]);

  // Pending legs selected in Option Chain (before committing to payoff)
  type PendingLeg = { strike: number; type: 'CE' | 'PE'; action: 'Buy' | 'Sell'; price: number; qty: number };
  const [pendingLegs, setPendingLegs] = useState<PendingLeg[]>([]);

  const addOrTogglePending = (strike: number, type: 'CE' | 'PE', action: 'Buy' | 'Sell', price: number) => {
    setPendingLegs(prev => {
      const existingIdx = prev.findIndex(l => l.strike === strike && l.type === type && l.action === action);
      if (existingIdx >= 0) {
        // Already selected — remove it (toggle off)
        return prev.filter((_, i) => i !== existingIdx);
      }
      return [...prev, { strike, type, action, price, qty: 1 }];
    });
  };

  const adjustPendingQty = (strike: number, type: 'CE' | 'PE', action: 'Buy' | 'Sell', delta: number) => {
    setPendingLegs(prev => 
      prev
        .map(l => l.strike === strike && l.type === type && l.action === action ? { ...l, qty: l.qty + delta } : l)
        .filter(l => l.qty > 0)
    );
  };

  const executePending = () => {
    if (pendingLegs.length === 0) return;
    const newLegs: Position[] = pendingLegs.map(l => ({
      id: Date.now().toString() + Math.random(),
      action: l.action,
      qty: l.qty,
      type: l.type,
      strike: l.strike,
      price: l.price,
      enabled: true
    }));
    setPositions(prev => [...prev, ...newLegs]);
    setPendingLegs([]);
    setSelectedStrategy('Custom Strategy');
    setActiveTab('Payoff');
  };

  // --- AUTOPLAY ENGINE ---
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Side effect 1: navigate to payoff graph immediately when autoplay is turned ON
  useEffect(() => {
    if (isAutoplay) {
      setActiveTab('Payoff');
      setSelectedStrategy(prev => prev ?? 'Custom Strategy');
    }
  }, [isAutoplay]);

  // Side effect 2: tick the clock and spot price on interval
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (isAutoplay) {
      intervalRef.current = setInterval(() => {
        const walk = (Math.random() - 0.5) * 60 * timeBound;
        setSpotPrice(prev => {
          const next = prev + walk;
          return Math.max(20000, Math.min(28000, next)); // keep in reasonable range
        });
        setCurrentDate(prev => new Date(prev.getTime() + timeBound * 60000));
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoplay, timeBound]);

  const loadStrategy = (name: string) => {
    setSelectedStrategy(name);
    setMultiplier(1);
    const SPOT = Math.round(spotPrice / 50) * 50; // nearest strike
    
    if (name === 'Buy Call') {
      setPositions([{ id: Date.now().toString(), action: 'Buy', qty: 1, type: 'CE', strike: SPOT, price: 140, enabled: true }]);
    } else if (name === 'Sell Put') {
      setPositions([{ id: Date.now().toString(), action: 'Sell', qty: 1, type: 'PE', strike: SPOT, price: 135, enabled: true }]);
    } else if (name === 'Bull Call Spread') {
      setPositions([
        { id: '1', action: 'Buy', qty: 1, type: 'CE', strike: SPOT, price: 140, enabled: true },
        { id: '2', action: 'Sell', qty: 1, type: 'CE', strike: SPOT + 200, price: 57, enabled: true }
      ]);
    } else if (name === 'Bull Put Spread') {
      setPositions([
        { id: '1', action: 'Sell', qty: 1, type: 'PE', strike: SPOT, price: 135, enabled: true },
        { id: '2', action: 'Buy', qty: 1, type: 'PE', strike: SPOT - 200, price: 60, enabled: true }
      ]);
    } else if (name === 'Long Calendar') {
      setPositions([
        { id: '1', action: 'Sell', qty: 1, type: 'CE', strike: SPOT, price: 140, enabled: true },
        { id: '2', action: 'Buy', qty: 1, type: 'CE', strike: SPOT, price: 210, enabled: true }
      ]);
    } else {
      setPositions([
        { id: '1', action: 'Sell', qty: 1, type: 'CE', strike: SPOT+100, price: 122.95, enabled: true },
        { id: '2', action: 'Sell', qty: 1, type: 'PE', strike: SPOT-100, price: 105.50, enabled: true },
        { id: '3', action: 'Buy', qty: 1, type: 'CE', strike: SPOT+300, price: 57.20, enabled: true },
        { id: '4', action: 'Buy', qty: 1, type: 'PE', strike: SPOT-300, price: 45.10, enabled: true }
      ]);
    }
  };

  const toggleLeg = (id: string) => {
    setPositions(positions.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };
  
  const removeLeg = (id: string) => {
    setPositions(positions.filter(p => p.id !== id));
  };
  
  const manualTimeShift = (minutes: number) => {
     setCurrentDate(prev => new Date(prev.getTime() + minutes * 60000));
     // Visibly shift the spot price when stepping forward/backward in time manually
     setSpotPrice(prev => prev + (Math.random() - 0.5) * 40 * Math.abs(minutes > 60 ? 10 : 1));
  };

  const chartData = useMemo(() => {
    const data = [];
    const activePositions = positions.filter(p => p.enabled);
    if (activePositions.length === 0) return Array.from({length: 60}, (_, i) => ({ spot: 22900 + i*50, pl: 0, t0: 0 }));

    const strikes = activePositions.map(p => p.strike);
    const minS = strikes.length > 0 ? Math.min(...strikes) - 800 : 23100;
    const maxS = strikes.length > 0 ? Math.max(...strikes) + 800 : 24700;

    // Time decay factor: as currentDate advances, T0 converges toward expiry P&L
    // Assume expiry is Apr 25 — calculate fraction of time elapsed
    const expiry = new Date('2026-04-25T15:30:00');
    const start  = new Date('2026-04-10T09:15:00');
    const totalMs = expiry.getTime() - start.getTime();
    const elapsedMs = currentDate.getTime() - start.getTime();
    const timeDecayFactor = Math.min(1, Math.max(0, elapsedMs / totalMs)); // 0 = start, 1 = expiry
    
    for(let i = minS; i <= maxS; i += 25) {
        let totalPl = 0;
        
        activePositions.forEach(p => {
           let intrinsic = 0;
           if (p.type === 'CE') intrinsic = Math.max(0, i - p.strike);
           if (p.type === 'PE') intrinsic = Math.max(0, p.strike - i);
           
           let unitPl = p.action === 'Buy' ? (intrinsic - p.price) : (p.price - intrinsic);
           totalPl += (unitPl * p.qty * 25 * multiplier);
        });
        
        // T0 = current mark-to-market P&L. As time passes (timeDecayFactor → 1),
        // T0 line converges toward the expiry payoff (totalPl).
        // At start: T0 ≈ 20% of PL (deep time value). At expiry: T0 = PL.
        const t0Blend = 0.2 + timeDecayFactor * 0.8; // ramps 0.2 → 1.0 over time
        let t0 = totalPl * t0Blend;
        
        data.push({ spot: i, pl: totalPl, t0 });
    }
    return data;
  }, [positions, multiplier, currentDate, spotPrice]);

  const stats = useMemo(() => {
    const pls = chartData.map(d => d.pl);
    const maxProfit = Math.max(...pls);
    const maxLoss = Math.min(...pls);
    
    let breakevens: number[] = [];
    for(let i=1; i<chartData.length; i++) {
       if ((chartData[i-1].pl < 0 && chartData[i].pl > 0) || (chartData[i-1].pl > 0 && chartData[i].pl < 0)) {
           breakevens.push(chartData[i].spot);
       }
    }
    
    // Live P&L at CURRENT SPOT PRICE
    let livePl = 0;
    positions.filter(p=>p.enabled).forEach(p => {
       let intrinsic = 0;
       if (p.type === 'CE') intrinsic = Math.max(0, spotPrice - p.strike);
       if (p.type === 'PE') intrinsic = Math.max(0, p.strike - spotPrice);
       let unitPl = p.action === 'Buy' ? (intrinsic - p.price) : (p.price - intrinsic);
       livePl += (unitPl * p.qty * 25 * multiplier);
    });
    
    return {
       maxP: maxProfit > 50000 ? 'Unlimited' : `+${maxProfit.toFixed(0)}`,
       maxL: maxLoss < -50000 ? 'Unlimited' : `${maxLoss.toFixed(0)}`,
       be: breakevens,
       livePl
    }
  }, [chartData, spotPrice, positions, multiplier]);

  const gradientOffset = () => {
    const dataMax = Math.max(...chartData.map((i) => i.pl), 1);
    const dataMin = Math.min(...chartData.map((i) => i.pl), -1);
    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;
    return dataMax / (dataMax - dataMin);
  };
  const off = gradientOffset();

  // Dynamic Option Chain generated around live Spot Price
  const optionChain = useMemo(() => {
     const ATM = Math.round(spotPrice / 50) * 50;
     const chain = [];
     for(let i = ATM - 250; i <= ATM + 250; i += 50) {
        const diff = i - spotPrice; 
        
        // Mock Black-Scholes simplistic premiums
        let cl = Math.max(spotPrice - i, 0) + 140 * Math.exp(-Math.abs(diff)/150);
        let pl = Math.max(i - spotPrice, 0) + 140 * Math.exp(-Math.abs(diff)/150);
        
        let cd = 0.5 - diff / 800;
        cd = Math.max(0.01, Math.min(0.99, cd));
        
        // Stable OI Mock logic
        const coi = Math.round(200 + Math.abs(diff)*2 + (i%3)*50);
        const poi = Math.round(200 + Math.abs(diff)*1.5 + (i%2)*40);

        chain.push({
           s: i, cd, cl, coi, coip: Math.min(coi / 6, 100),
           pd: 1 - cd, pl, poi, poip: Math.min(poi / 6, 100),
           isAtm: i === ATM
        });
     }
     return chain;
  }, [spotPrice]);

  const TimeButton = ({ text, mins }: { text: string, mins: number }) => (
    <button onClick={() => manualTimeShift(mins)} className="px-2.5 py-1.5 bg-white border border-gray-200 rounded text-[11px] text-gray-700 font-medium whitespace-nowrap min-w-[40px] hover:bg-gray-50 active:bg-gray-100 flex-1 text-center">
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
        <div className="flex relative items-center gap-2">
          
          {/* Symbol Dropdown - clean select */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSymbolDropdown(!showSymbolDropdown)}
              className="flex items-center gap-2 bg-[#1e1b4b] text-white rounded-lg px-3 py-2 shadow-sm min-w-[130px] active:bg-[#2d2870] transition-colors">
              <span className="bg-white text-[#1e1b4b] text-[10px] font-black px-1.5 py-0.5 rounded">
                {selectedSymbol === 'NIFTY' ? '50' : selectedSymbol === 'BANKNIFTY' ? 'BNK' : selectedSymbol === 'FINNIFTY' ? 'FIN' : 'SEN'}
              </span>
              <span className="font-extrabold text-[13px] tracking-wide flex-1 text-left">{selectedSymbol}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSymbolDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSymbolDropdown && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 z-[999] py-2 overflow-hidden">
                <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 mb-1">Select Index</div>
                {INDICES.map(sym => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => { setSelectedSymbol(sym); setShowSymbolDropdown(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-bold flex items-center gap-3 transition-colors ${
                      sym === selectedSymbol ? 'bg-blue-50 text-blue-600' : 'text-gray-800 hover:bg-gray-50'
                    }`}>
                    <span className={`w-7 h-5 rounded text-[9px] font-black flex items-center justify-center text-white ${
                      sym === selectedSymbol ? 'bg-blue-600' : 'bg-[#1e1b4b]'
                    }`}>
                      {sym === 'NIFTY' ? '50' : sym === 'BANKNIFTY' ? 'BNK' : sym === 'FINNIFTY' ? 'FIN' : 'SEN'}
                    </span>
                    {sym}
                    {sym === selectedSymbol && <span className="ml-auto text-blue-500 text-base">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Autoplay Toggle */}
          <div 
            onClick={() => setIsAutoplay(!isAutoplay)}
            className={`flex border rounded items-center px-2 py-1.5 flex-shrink-0 shadow-sm cursor-pointer transition-colors ${isAutoplay ? 'border-red-200 bg-red-50 hover:bg-red-100' : 'border-blue-100 bg-[#eff6ff] hover:bg-blue-50'}`}>
            {isAutoplay ? <PauseCircle className="w-3.5 h-3.5 text-red-600 mr-1.5 animate-pulse" /> : <PlayCircle className="w-3.5 h-3.5 text-blue-600 mr-1.5" />}
            <span className={`text-[11px] font-bold ${isAutoplay ? 'text-red-600' : 'text-blue-600'}`}>{isAutoplay ? 'Pause' : 'Autoplay'}</span>
          </div>

          <div 
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            className="flex relative border border-gray-200 rounded items-center px-2 py-1 bg-white flex-1 min-w-[90px] justify-between shadow-sm cursor-pointer">
            <span className="text-[10px] font-bold text-gray-800 leading-tight">{timeBound} min / <br/> 1 sec</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            
            {showTimeDropdown && (
               <div className="absolute top-full right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1">
                 {[1, 3, 5, 10, 15].map(tb => (
                   <button 
                     key={tb} 
                     onClick={(e) => { e.stopPropagation(); setTimeBound(tb); setShowTimeDropdown(false); }}
                     className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600">
                     {tb} min / 1 sec
                   </button>
                 ))}
               </div>
            )}
          </div>
        </div>

        {/* Time -1 */}
        <div className="flex gap-1.5 px-0 mt-1">
           <TimeButton text="-1d" mins={-1440} />
           <TimeButton text="-1h" mins={-60} />
           <TimeButton text="-15m" mins={-15} />
           <TimeButton text="-5m" mins={-5} />
           <TimeButton text="-1m" mins={-1} />
        </div>

        {/* Date & Time Row */}
        <div className="flex gap-1.5 mt-0.5">
           <div className="flex-[3] relative border border-gray-200 rounded flex items-center justify-between bg-white shadow-sm overflow-hidden px-2.5 py-1.5 cursor-pointer hover:bg-gray-50">
             <span className="text-[11px] font-bold text-gray-800 pointer-events-none whitespace-nowrap">
               {currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
             </span>
             <Calendar className="w-3.5 h-3.5 text-gray-400 pointer-events-none" />
             <input 
               type="date"
               value={new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10)}
               onChange={(e) => {
                 if (e.target.value) {
                   const newDate = new Date(e.target.value);
                   newDate.setHours(currentDate.getHours(), currentDate.getMinutes(), 0, 0);
                   setCurrentDate(newDate);
                 }
               }}
               style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer'}}
             />
           </div>
           
           <div className="flex-[2.2] relative border border-gray-200 rounded flex items-center justify-between bg-white shadow-sm overflow-hidden px-2.5 py-1.5 cursor-pointer hover:bg-gray-50">
             <span className="text-[11px] font-bold text-gray-800 pointer-events-none whitespace-nowrap">
               {currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
             </span>
             <Clock className="w-3.5 h-3.5 text-gray-400 pointer-events-none" />
             <input 
               type="time"
               value={new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000).toISOString().slice(11, 16)}
               onChange={(e) => {
                 if (e.target.value) {
                   const [hours, mins] = e.target.value.split(':');
                   const newDate = new Date(currentDate);
                   newDate.setHours(parseInt(hours), parseInt(mins), 0, 0);
                   setCurrentDate(newDate);
                 }
               }}
               style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer'}}
             />
           </div>

           <div className="w-[50px] bg-white rounded border border-gray-200 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 bottom-0 left-0 bg-blue-100" style={{width: isAutoplay ? '100%' : '0%', transition: isAutoplay ? 'width 1s linear' : 'none'}}></div>
           </div>
        </div>

        {/* Time +1 */}
        <div className="flex gap-1.5 px-0 mt-0.5 pb-1">
           <TimeButton text="+1m" mins={1} />
           <TimeButton text="+5m" mins={5} />
           <TimeButton text="+15m" mins={15} />
           <TimeButton text="+1h" mins={60} />
           <TimeButton text="EOD" mins={120} />
           <TimeButton text="+1d" mins={1440} />
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

             <div className="grid grid-cols-2 gap-3 pb-8">
               {/* Strategy Presets */}
               <div className="border border-gray-200 p-2 rounded-xl h-36 flex flex-col active:scale-95 transition-transform cursor-pointer" onClick={() => loadStrategy('Buy Call')}>
                  <div className="flex-1 w-full relative pt-4">
                     <svg viewBox="0 0 100 60" className="w-[110%] h-[110%] -left-[5%] preserve-aspect-ratio-none overflow-visible absolute inset-0">
                        <polygon points="10,35 40,35 40,40 10,40" fill="#fee2e2" opacity="0.6" />
                        <polygon points="40,35 90,35 90,10" fill="#dcfce7" opacity="0.7" />
                        <path d="M 10 40 L 40 40" stroke="#ef4444" strokeWidth="2.5" fill="none" />
                        <path d="M 40 40 L 90 10" stroke="#22c55e" strokeWidth="2.5" fill="none" />
                     </svg>
                  </div>
                  <div className="text-center pb-1 pt-2 z-10 bg-white"><span className="text-[13px] font-bold text-gray-800">Buy Call</span></div>
               </div>

               <div className="border border-gray-200 p-2 rounded-xl h-36 flex flex-col active:scale-95 transition-transform cursor-pointer" onClick={() => loadStrategy('Sell Put')}>
                  <div className="flex-1 w-full relative pt-4">
                     <svg viewBox="0 0 100 60" className="w-[110%] h-[110%] -left-[5%] preserve-aspect-ratio-none overflow-visible absolute inset-0">
                        <polygon points="10,35 40,35 10,50" fill="#fee2e2" opacity="0.6" />
                        <polygon points="40,35 90,35 90,20 40,20" fill="#dcfce7" opacity="0.7" />
                        <path d="M 10 50 L 40 20" stroke="#ef4444" strokeWidth="2.5" fill="none" />
                        <path d="M 40 20 L 90 20" stroke="#22c55e" strokeWidth="2.5" fill="none" />
                     </svg>
                  </div>
                  <div className="text-center pb-1 pt-2 z-10 bg-white"><span className="text-[13px] font-bold text-gray-800">Sell Put</span></div>
               </div>

               <div className="border border-gray-200 p-2 rounded-xl h-36 flex flex-col active:scale-95 transition-transform cursor-pointer" onClick={() => loadStrategy('Bull Call Spread')}>
                  <div className="flex-1 w-full relative pt-4">
                     <svg viewBox="0 0 100 60" className="w-[110%] h-[110%] -left-[5%] preserve-aspect-ratio-none overflow-visible absolute inset-0">
                        <polygon points="10,35 30,35 30,45 10,45" fill="#fee2e2" opacity="0.6" />
                        <polygon points="45,35 90,35 90,15 45,15" fill="#dcfce7" opacity="0.7" />
                        <path d="M 10 45 L 30 45 L 45 15" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                        <path d="M 30 45 L 45 15 L 90 15" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                     </svg>
                  </div>
                  <div className="text-center pb-1 pt-2 z-10 bg-white"><span className="text-[13px] font-bold text-gray-800">Bull Call Spread</span></div>
               </div>

               <div className="border border-gray-200 p-2 rounded-xl h-36 flex flex-col active:scale-95 transition-transform cursor-pointer" onClick={() => loadStrategy('Long Calendar')}>
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
                  <div className="text-center pb-1 pt-2 z-10 bg-white"><span className="text-[13px] font-bold text-gray-800">Long Calendar</span></div>
               </div>

               <div className="col-span-2 border border-gray-200 p-2 rounded-xl h-36 flex flex-col active:scale-95 transition-transform cursor-pointer" onClick={() => loadStrategy('Iron Condor')}>
                  <div className="flex-1 w-full relative pt-4 pb-2">
                     <svg viewBox="0 0 100 60" className="w-[110%] h-[110%] -left-[5%] preserve-aspect-ratio-none overflow-visible absolute inset-0">
                        <polygon points="10,35 30,35 30,45 10,45" fill="#fee2e2" opacity="0.6" />
                        <polygon points="40,35 60,35 60,15 40,15" fill="#dcfce7" opacity="0.7" />
                        <polygon points="70,35 90,35 90,45 70,45" fill="#fee2e2" opacity="0.6" />
                        <path d="M 10 45 L 30 45 L 40 15" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                        <path d="M 30 45 L 40 15 L 60 15 L 70 45" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                        <path d="M 70 45 L 90 45" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                     </svg>
                  </div>
                  <div className="text-center pb-1 pt-2 z-10 bg-white"><span className="text-[13px] font-bold text-gray-800">Iron Condor</span></div>
               </div>
             </div>
          </div>
        </div>
      )}
      
      {activeTab === 'Payoff' && selectedStrategy && (
        <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
            <div className="bg-white p-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-[15px] text-gray-900">{selectedStrategy}</h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-[#eff6ff] text-blue-600 border border-blue-200 rounded shadow-sm text-xs font-bold" onClick={() => setSelectedStrategy(null)}>Strategy List</button>
                </div>
            </div>
            
            {/* Dynamic Stats Grid */}
            <div className="grid grid-cols-2 p-4 gap-y-4 gap-x-2 bg-white">
               <div>
                  <p className="text-[11px] text-gray-500 mb-1">Live P&L</p>
                  <div className={`font-bold text-sm px-2 py-0.5 rounded inline-block ${stats.livePl >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {stats.livePl >= 0 ? '+' : ''}{stats.livePl.toFixed(2)}
                  </div>
               </div>
               <div>
                  <p className="text-[11px] text-gray-500 mb-1">Est. Margin</p>
                  <div className="text-gray-900 font-bold text-sm">{(positions.filter(p=>p.enabled).length * 45000 / 100000).toFixed(2)}L</div>
               </div>
               <div>
                  <p className="text-[11px] text-gray-500 mb-1">POP</p>
                  <div className="text-gray-900 font-bold text-sm">54%</div>
               </div>
               <div>
                  <p className="text-[11px] text-gray-500 mb-1">Max Profit</p>
                  <div className="text-emerald-600 font-bold text-sm">{stats.maxP}</div>
               </div>
               <div>
                  <p className="text-[11px] text-gray-500 mb-1">Max Loss</p>
                  <div className="text-red-600 font-bold text-sm">{stats.maxL}</div>
               </div>
               <div>
                  <p className="text-[11px] text-gray-500 mb-1">Breakevens</p>
                  {stats.be.length > 0 ? stats.be.map((b, i) => (
                    <div key={i} className="text-gray-900 font-bold text-xs mt-0.5">{b.toFixed(0)} <span className="text-gray-400 font-normal">({(((b - spotPrice) / spotPrice)*100).toFixed(2)}%)</span></div>
                  )) : (
                    <div className="text-gray-900 font-bold text-xs mt-0.5">None</div>
                  )}
               </div>
            </div>

            <div className="bg-white border-t border-gray-100 p-2 flex justify-center items-center text-[12px] font-bold text-gray-700 relative overflow-hidden">
               <span className={`relative z-10 transition-colors ${isAutoplay ? 'text-red-600' : ''}`}>Spot: {spotPrice.toFixed(2)}</span>
            </div>

            {/* Dynamic Interactive Chart */}
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
                    <XAxis dataKey="spot" type="number" domain={['dataMin', 'dataMax']} tick={{fontSize: 10, fill: '#6b7280'}} tickLine={false} axisLine={{stroke: '#e5e7eb'}} tickFormatter={(val) => Math.round(val).toLocaleString('en-IN')} />
                    <YAxis tick={{fontSize: 10, fill: '#6b7280'}} tickLine={false} axisLine={{stroke: '#e5e7eb'}} tickFormatter={(val) => val >= 100000 || val <= -100000 ? `${(val/100000).toFixed(2)}L` : val} />
                    <RechartsTooltip contentStyle={{fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} labelStyle={{fontWeight: 'bold', color: '#111827'}} formatter={(val: number) => val.toFixed(2)} labelFormatter={(label) => `Spot: ${Math.round(label as number)}`} />
                    <ReferenceLine y={0} stroke="#6b7280" strokeWidth={1} />
                    <ReferenceLine x={spotPrice} stroke={isAutoplay ? "#ef4444" : "#111827"} strokeWidth={1.5} strokeDasharray={isAutoplay ? "3 3" : "0"} />
                    <Area type="linear" dataKey="pl" stroke="url(#strokeColor)" strokeWidth={2} fill="url(#splitColor)" isAnimationActive={false} />
                    <Line type="monotone" dataKey="t0" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" fill="none" dot={false} isAnimationActive={false} />
                  </ComposedChart>
               </ResponsiveContainer>
            </div>

            {/* Live Positions Table */}
            <div className="bg-white mt-2 pb-6">
               <div className="flex px-4 border-b border-gray-100 overflow-x-auto no-scrollbar">
                  <button className="py-3 px-2 border-b-2 border-blue-600 text-blue-600 font-bold text-[13px] mr-6 whitespace-nowrap">Positions</button>
                  <button className="py-3 px-2 border-b-2 border-transparent text-gray-500 font-bold text-[13px] hover:text-gray-900 mr-auto whitespace-nowrap">Greeks</button>
                  <button className="py-3 px-4 bg-red-50 text-red-600 font-bold text-[13px] rounded-t-lg whitespace-nowrap" onClick={() => setPositions([])}>Reset</button>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-left min-w-[340px]">
                    <thead className="bg-gray-50 text-gray-500 text-[11px] font-medium border-b border-gray-100">
                       <tr>
                          <th className="py-2.5 px-3 w-8"><CheckSquare className="w-4 h-4 text-blue-600 rounded bg-white" /></th>
                          <th className="py-2.5 px-2 text-center text-gray-900 font-bold">Action</th>
                          <th className="py-2.5 px-2">Lots</th>
                          <th className="py-2.5 px-2">Strike</th>
                          <th className="py-2.5 px-2">Entry</th>
                          <th className="py-2.5 px-2 w-[50px]">LTP</th>
                          <th className="py-2.5 px-3 w-8"></th>
                       </tr>
                    </thead>
               <tbody>
                  {positions.map((p) => {
                     const diff = p.strike - spotPrice;
                     let ltp = 0;
                     if (p.type === 'CE') ltp = Math.max(spotPrice - p.strike, 0) + 140 * Math.exp(-Math.abs(diff)/150);
                     if (p.type === 'PE') ltp = Math.max(p.strike - spotPrice, 0) + 140 * Math.exp(-Math.abs(diff)/150);
                     
                     return (
                        <tr key={p.id} className="border-b border-gray-50">
                           <td className="py-3 px-3">
                              <button onClick={() => toggleLeg(p.id)}>
                                 {p.enabled ? <CheckSquare className="w-4 h-4 text-blue-600 rounded bg-white" /> : <div className="w-4 h-4 border border-gray-300 rounded bg-white" />}
                              </button>
                           </td>
                           <td className="py-3 px-2 text-center">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${p.action === 'Buy' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{p.action === 'Buy' ? 'B' : 'S'}</span>
                              <span className="ml-1 text-[11px] font-bold text-gray-700">{p.type}</span>
                           </td>
                           <td className="py-3 px-2 text-[12px] font-bold text-gray-900">{p.qty * 25}</td>
                           <td className="py-3 px-2 text-[12px] font-bold text-gray-900">{p.strike}</td>
                           <td className="py-3 px-2 text-[12px] font-medium text-gray-500">{p.price.toFixed(2)}</td>
                           <td className="py-3 px-2 text-[12px] font-bold text-gray-900">{ltp.toFixed(2)}</td>
                           <td className="py-3 px-3 text-right">
                              <button onClick={() => removeLeg(p.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                           </td>
                        </tr>
                     )
                  })}
               </tbody>
            </table>
               </div>
         </div>
        </div>
      )}

      {/* OPTION CHAIN TAB */}
      {activeTab === 'Option Chain' && (
         <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col relative">
            <div className="flex px-4 items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-30">
               <div className="font-bold text-[13px] text-gray-800 py-3">Option Chain</div>
               <div className="text-[11px] font-bold text-gray-500">Spot: <span className="text-gray-900">{spotPrice.toFixed(2)}</span></div>
            </div>
            
            <div className="bg-white flex-1 relative">
               <table className="w-full text-left min-w-[340px] tabular-nums">
                  <thead className="bg-[#f8f9fa] text-gray-400 text-[10px] uppercase font-bold tracking-wider border-b border-gray-100 sticky top-[45px] z-20">
                     <tr>
                        <th className="py-3 px-1 text-center w-[40px]">CE Δ</th>
                        <th className="py-3 px-2 text-center">CALLS</th>
                        <th className="py-3 px-2 text-center w-[70px]">STRIKE</th>
                        <th className="py-3 px-2 text-center">PUTS</th>
                        <th className="py-3 px-1 text-center w-[40px]">PE Δ</th>
                     </tr>
                  </thead>
                  <tbody>
                     {optionChain.map((r) => {
                        const ceBuy  = pendingLegs.find(l => l.strike === r.s && l.type === 'CE' && l.action === 'Buy');
                        const ceSell = pendingLegs.find(l => l.strike === r.s && l.type === 'CE' && l.action === 'Sell');
                        const peBuy  = pendingLegs.find(l => l.strike === r.s && l.type === 'PE' && l.action === 'Buy');
                        const peSell = pendingLegs.find(l => l.strike === r.s && l.type === 'PE' && l.action === 'Sell');
                        const isAtmRow = Math.abs(r.s - spotPrice) <= 25;
                        
                        const QtyPicker = ({leg, type, action}: {leg: any, type: any, action: any}) => leg ? (
                          <div style={{display:'flex',alignItems:'center',background:'#f3f4f6',borderRadius:'6px',padding:'2px'}}>
                            <button type="button" onClick={() => adjustPendingQty(r.s, type, action, -1)}
                              style={{width:24,height:24,borderRadius:'4px',background:'#fff',boxShadow:'0 1px 2px rgba(0,0,0,0.05)',fontWeight:800,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#374151',border:'none'}}>-</button>
                            <span style={{fontWeight:800,fontSize:13,width:24,textAlign:'center',color:'#111827'}}>{leg.qty}</span>
                            <button type="button" onClick={() => adjustPendingQty(r.s, type, action, 1)}
                              style={{width:24,height:24,borderRadius:'4px',background:'#fff',boxShadow:'0 1px 2px rgba(0,0,0,0.05)',fontWeight:800,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#374151',border:'none'}}>+</button>
                          </div>
                        ) : null;

                        return (
                          <tr key={r.s} style={{borderBottom:'1px solid #f9fafb',background:isAtmRow?'#fcfdfd':'#fff',verticalAlign:'top'}}>
                            <td style={{padding:'12px 2px',verticalAlign:'top'}}>
                              <div style={{height:'30px',display:'flex',alignItems:'center',justifyContent:'center',color:'#9ca3af',fontWeight:600,fontSize:'11px'}}>{r.cd.toFixed(2)}</div>
                            </td>
                            <td style={{padding:'12px 2px',verticalAlign:'top'}}>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                                <div style={{width:'64px',height:'30px',display:'flex',alignItems:'center',justifyContent:'flex-end',fontWeight:800,fontSize:'15px',color:'#111827',marginBottom:8}}>{r.cl.toFixed(2)}</div>
                                {(ceBuy||ceSell) ? (
                                  <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'center'}}>
                                    {ceBuy  && <div style={{display:'flex',alignItems:'center',gap:4}}><span style={{fontSize:10,color:'#16a34a',fontWeight:800,textTransform:'uppercase'}}>BUY</span><QtyPicker leg={ceBuy}  type="CE" action="Buy"  /></div>}
                                    {ceSell && <div style={{display:'flex',alignItems:'center',gap:4}}><span style={{fontSize:10,color:'#dc2626',fontWeight:800,textTransform:'uppercase'}}>SELL</span><QtyPicker leg={ceSell} type="CE" action="Sell" /></div>}
                                  </div>
                                ) : (
                                  <div style={{display:'flex',gap:6,justifyContent:'center'}}>
                                    <button type="button" onClick={() => addOrTogglePending(r.s,'CE','Buy',parseFloat(r.cl.toFixed(2)))}
                                      style={{fontSize:'10px',fontWeight:700,background:'#f0fdf4',color:'#16a34a',borderRadius:'4px',padding:'4px 10px',cursor:'pointer',border:'none'}}>BUY</button>
                                    <button type="button" onClick={() => addOrTogglePending(r.s,'CE','Sell',parseFloat(r.cl.toFixed(2)))}
                                      style={{fontSize:'10px',fontWeight:700,background:'#fef2f2',color:'#dc2626',borderRadius:'4px',padding:'4px 10px',cursor:'pointer',border:'none'}}>SELL</button>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td style={{padding:'12px 4px',verticalAlign:'top'}}>
                              <div style={{display:'flex',justifyContent:'center',position:'relative',width:'60px',margin:'0 auto'}}>
                                 <div style={{background:isAtmRow?'#eff6ff':'#f9fafb',border:isAtmRow?'1px solid #bfdbfe':'1px solid #f3f4f6',borderRadius:'6px',fontWeight:800,fontSize:'13px',width:'100%',height:'30px',display:'flex',alignItems:'center',justifyContent:'center',color:isAtmRow?'#1d4ed8':'#374151'}}>{r.s}</div>
                                 {r.isAtm && <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:10,pointerEvents:'none'}}><span style={{background:'#3b82f6',color:'white',fontWeight:800,fontSize:'9px',letterSpacing:'0.5px',padding:'2px 6px',borderRadius:'4px',boxShadow:'0 2px 4px rgba(59,130,246,.3)'}}>ATM</span></div>}
                              </div>
                            </td>
                            <td style={{padding:'12px 2px',verticalAlign:'top'}}>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                                <div style={{width:'64px',height:'30px',display:'flex',alignItems:'center',justifyContent:'flex-end',fontWeight:800,fontSize:'15px',color:'#111827',marginBottom:8}}>{r.pl.toFixed(2)}</div>
                                {(peBuy||peSell) ? (
                                  <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'center'}}>
                                    {peBuy  && <div style={{display:'flex',alignItems:'center',gap:4}}><span style={{fontSize:10,color:'#16a34a',fontWeight:800,textTransform:'uppercase'}}>BUY</span><QtyPicker leg={peBuy}  type="PE" action="Buy"  /></div>}
                                    {peSell && <div style={{display:'flex',alignItems:'center',gap:4}}><span style={{fontSize:10,color:'#dc2626',fontWeight:800,textTransform:'uppercase'}}>SELL</span><QtyPicker leg={peSell} type="PE" action="Sell" /></div>}
                                  </div>
                                ) : (
                                  <div style={{display:'flex',gap:6,justifyContent:'center'}}>
                                    <button type="button" onClick={() => addOrTogglePending(r.s,'PE','Buy',parseFloat(r.pl.toFixed(2)))}
                                      style={{fontSize:'10px',fontWeight:700,background:'#f0fdf4',color:'#16a34a',borderRadius:'4px',padding:'4px 10px',cursor:'pointer',border:'none'}}>BUY</button>
                                    <button type="button" onClick={() => addOrTogglePending(r.s,'PE','Sell',parseFloat(r.pl.toFixed(2)))}
                                      style={{fontSize:'10px',fontWeight:700,background:'#fef2f2',color:'#dc2626',borderRadius:'4px',padding:'4px 10px',cursor:'pointer',border:'none'}}>SELL</button>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td style={{padding:'12px 2px',verticalAlign:'top'}}>
                              <div style={{height:'30px',display:'flex',alignItems:'center',justifyContent:'center',color:'#9ca3af',fontWeight:600,fontSize:'11px'}}>{r.pd.toFixed(2)}</div>
                            </td>
                          </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>

            {/* Floating Execute Button */}
            {pendingLegs.length > 0 && (
               <div style={{position:'sticky',bottom:0,padding:'12px 16px',background:'white',borderTop:'1px solid #e5e7eb',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 -4px 20px rgba(0,0,0,.1)', zIndex:40}}>
                  <div>
                    <div style={{fontSize:'12px',fontWeight:700,color:'#374151'}}>{pendingLegs.length} leg{pendingLegs.length>1?'s':''} selected</div>
                    <div style={{fontSize:'10px',color:'#9ca3af',marginTop:2}}>{pendingLegs.map(l=>`${l.action==='Buy'?'B':'S'} ${l.strike}${l.type} x${l.qty}`).join(' · ')}</div>
                  </div>
                  <button type="button" onClick={executePending}
                    style={{background:'linear-gradient(135deg,#1d4ed8,#7c3aed)',color:'white',fontWeight:800,fontSize:'13px',padding:'10px 20px',borderRadius:'10px',border:'none',cursor:'pointer',boxShadow:'0 4px 12px rgba(99,102,241,.4)',whiteSpace:'nowrap'}}>
                    View Strategy →
                  </button>
               </div>
            )}
         </div>
      )}
    </div>
  );
}
