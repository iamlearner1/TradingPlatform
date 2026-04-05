import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Search, Settings, Activity, PlusCircle, Minus, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const generateOptionChain = (spotPrice: number) => {
  const strikes = [];
  const startMode = Math.floor(spotPrice / 50) * 50 - 250; 
  for (let i = 0; i < 11; i++) {
    const strike = startMode + (i * 50);
    strikes.push({
      strike,
      pcr: (Math.random() * 1.5 + 0.5).toFixed(2),
      ce: {
        oi: (Math.random() * 30 + 5).toFixed(2),
        oiChg: (Math.random() * 100).toFixed(2) + "%",
        oiPos: Math.random() > 0.3,
        ltp: (Math.random() * 400 + 100).toFixed(2),
        ltpChg: "-" + (Math.random() * 20).toFixed(2) + "%",
      },
      pe: {
        oi: (Math.random() * 30 + 5).toFixed(2),
        oiChg: (Math.random() * 100).toFixed(2) + "%",
        oiPos: Math.random() > 0.3,
        ltp: (Math.random() * 400 + 100).toFixed(2),
        ltpChg: "-" + (Math.random() * 20).toFixed(2) + "%",
      }
    });
  }
  return strikes;
};

type SelectedLeg = { strike: number, type: 'CE' | 'PE', action: 'Buy' | 'Sell', qty: number };

export default function OptionChain() {
  const { symbol } = useParams();
  const indexName = symbol?.replace('nifty', 'Nifty ')?.replace('bank', 'Bank')?.replace(/^./, str => str.toUpperCase()) || "Nifty 50";
  const spotPrice = 22713.10;
  
  const [activeTab, setActiveTab] = useState("Option chain");
  const [selectedContract, setSelectedContract] = useState<{strike: number, type: 'CE'|'PE'} | null>(null);
  
  // Strategy Mode State
  const [isStrategyMode, setIsStrategyMode] = useState(false);
  const [strategyLegs, setStrategyLegs] = useState<SelectedLeg[]>([]);

  // Memoize so prices don't jump on every render
  const [strikes] = useState(() => generateOptionChain(spotPrice));
  const spotIndex = strikes.findIndex(s => s.strike > spotPrice);

  const getLeg = (strike: number, type: 'CE'|'PE') => strategyLegs.find(l => l.strike === strike && l.type === type);

  const toggleLeg = (strike: number, type: 'CE'|'PE', action: 'Buy'|'Sell') => {
    const existing = getLeg(strike, type);
    if (existing && existing.action === action) {
      setStrategyLegs(strategyLegs.filter(l => !(l.strike === strike && l.type === type)));
    } else if (existing) {
      setStrategyLegs(strategyLegs.map(l => l.strike === strike && l.type === type ? { ...l, action } : l));
    } else {
      setStrategyLegs([...strategyLegs, { strike, type, action, qty: 1 }]);
    }
  };

  const updateQty = (strike: number, type: 'CE'|'PE', delta: number) => {
    setStrategyLegs(prev => {
      const legIndex = prev.findIndex(l => l.strike === strike && l.type === type);
      if (legIndex === -1) return prev;
      
      const newQty = prev[legIndex].qty + delta;
      if (newQty < 1) {
        return prev.filter((_, idx) => idx !== legIndex);
      }
      
      const newLegs = [...prev];
      newLegs[legIndex] = { ...newLegs[legIndex], qty: newQty };
      return newLegs;
    });
  };

  const thStyle: React.CSSProperties = { padding: '10px 4px', fontSize: '12px', color: '#6b7280', fontWeight: '500', textAlign: 'center', borderBottom: '1px solid #f3f4f6' };
  const tdStyle: React.CSSProperties = { padding: '10px 4px', textAlign: 'center', borderBottom: '1px solid #f3f4f6', verticalAlign: 'top' };

  // Calculate dynamic margins
  const availableBalance = 53042.78;
  const lotSize = 65;
  const marginPerSellLot = 115000;
  
  const requiredMargin = strategyLegs.reduce((total, leg) => {
    const row = strikes.find(s => s.strike === leg.strike);
    if (!row) return total;
    
    const ltp = parseFloat(leg.type === 'CE' ? row.ce.ltp : row.pe.ltp);
    return leg.action === 'Buy' 
      ? total + (ltp * leg.qty * lotSize)
      : total + (marginPerSellLot * leg.qty);
  }, 0);

  const bufferMargin = isStrategyMode && strategyLegs.length > 0 ? requiredMargin * 0.05 : 0;
  const totalRequired = requiredMargin + bufferMargin;
  const shortfall = Math.max(0, totalRequired - availableBalance);

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden text-gray-800 font-sans relative">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-1 -ml-1">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </Link>
          <div>
            <h1 className="text-lg font-medium text-gray-900 leading-tight">{indexName}</h1>
            <p className="text-[11px] text-gray-500 uppercase">NSE</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium text-gray-900 leading-tight">{spotPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
          <p className="text-xs text-emerald-600 font-medium">+33.70 (0.15%)</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 flex-shrink-0">
        {["Summary", "Charts", "Option chain", "Future chain"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 flex-shrink-0 bg-white shadow-sm z-10 transition-all">
        <div className="flex gap-4">
          <div>
            <p className="text-[10px] text-gray-500 mb-0.5">Expiry</p>
            <div className="flex items-center gap-1 font-medium text-sm">
              07 Apr <span className="bg-gray-100 text-gray-500 text-[9px] px-1 rounded">W</span>
              <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div>
            <p className="text-[10px] text-gray-500 mb-0.5">{isStrategyMode ? 'Legs added' : 'View'}</p>
            <div className="flex items-center gap-1 font-medium text-sm">
              {isStrategyMode ? <span className="text-gray-900">{strategyLegs.length}</span> : 'Call & Put'}
              {!isStrategyMode && <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-gray-800">Strategy</span>
          <button 
             onClick={() => {
                setIsStrategyMode(!isStrategyMode);
                if (isStrategyMode) setStrategyLegs([]); // Clear legs when exiting strategy mode
             }}
             className={`w-9 h-5 rounded-full relative transition-colors ${isStrategyMode ? 'bg-[#4c1d95]' : 'bg-gray-300'}`}
          >
             <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all ${isStrategyMode ? 'left-[18px]' : 'left-[3px]'}`}></div>
          </button>
          <div className="ml-1 flex items-center justify-center p-1 border border-gray-300 rounded-full">
            <Plus className="w-3 h-3 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-y-auto bg-white relative pb-20">
        <table className="w-full border-collapse table-fixed">
          <thead className="sticky top-0 bg-white z-20 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <tr>
              <th style={{...thStyle, width: '22%'}}>OI <span className="text-[10px] font-normal">(lakhs)</span></th>
              <th style={{...thStyle, width: '18%'}}>LTP</th>
              <th style={{...thStyle, width: '20%', backgroundColor: '#f9fafb'}} className="relative">
                Strike <Search className="w-3 h-3 inline-block absolute right-1 top-3 text-gray-400" />
              </th>
              <th style={{...thStyle, width: '18%'}}>LTP</th>
              <th style={{...thStyle, width: '22%'}}>OI <span className="text-[10px] font-normal">(lakhs)</span></th>
            </tr>
          </thead>
          <tbody className="relative">
            {strikes.map((row, i) => {
              const isSpotRow = i === spotIndex;

              return (
                <React.Fragment key={i}>
                  {isSpotRow && (
                    <tr className="relative">
                      <td colSpan={5} className="p-0 border-none relative text-center">
                        {isStrategyMode ? (
                           <div className="bg-white border-y border-gray-200 py-2 font-bold text-[13px] text-gray-800 shadow-sm z-20 relative">
                              Spot: {spotPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                           </div>
                        ) : (
                          <>
                            <div className="absolute top-0 left-0 right-0 h-px bg-purple-700 z-10 w-full"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#5b21b6] text-white text-xs font-medium px-3 py-1 rounded z-20 shadow-md">
                              {spotPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                  <tr className="active:bg-gray-50 border-b border-gray-100" onClick={() => !isStrategyMode && setSelectedContract({strike: row.strike, type: 'CE'})}>
                    
                    {/* Call Side */}
                    <td colSpan={2} style={{...tdStyle, padding: '10px 8px'}} className={`${row.strike < spotPrice ? 'bg-[#fffbf0]' : ''}`}>
                       <div className="flex justify-between items-start mb-2 px-1">
                          <div className="text-left cursor-pointer" onClick={(e) => { !isStrategyMode && e.stopPropagation(); !isStrategyMode && setSelectedContract({strike: row.strike, type: 'CE'})}}>
                            <div className="text-emerald-700 font-medium text-[13px]">{row.ce.oi}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">{row.ce.oiPos ? '+' : '-'}{row.ce.oiChg}</div>
                          </div>
                          <div className="text-right cursor-pointer" onClick={(e) => { !isStrategyMode && e.stopPropagation(); !isStrategyMode && setSelectedContract({strike: row.strike, type: 'CE'})}}>
                            <div className="text-[#c2410c] font-medium text-[13px]">{row.ce.ltp}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">{row.ce.ltpChg}</div>
                          </div>
                       </div>
                       
                       {isStrategyMode && (
                         <div className="flex flex-col mb-1 w-full max-w-[130px] mx-auto">
                            <div className="flex gap-2 justify-center">
                              <button onClick={(e) => { e.stopPropagation(); toggleLeg(row.strike, 'CE', 'Buy'); }}
                                className={`flex-1 py-1.5 rounded transition font-bold text-xs ${getLeg(row.strike, 'CE')?.action === 'Buy' ? 'bg-[#107c5a] text-white border border-[#107c5a]' : 'bg-transparent text-[#107c5a] border border-[#107c5a] hover:bg-[#107c5a]/10'}`}>
                                Buy
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); toggleLeg(row.strike, 'CE', 'Sell'); }}
                                className={`flex-1 py-1.5 rounded transition font-bold text-xs ${getLeg(row.strike, 'CE')?.action === 'Sell' ? 'bg-[#d85638] text-white border border-[#d85638]' : 'bg-transparent text-[#d85638] border border-[#d85638] hover:bg-[#d85638]/10'}`}>
                                Sell
                              </button>
                            </div>
                            {getLeg(row.strike, 'CE') && (
                              <div className="flex flex-col border border-gray-200 bg-white rounded mt-1.5 shadow-sm overflow-hidden">
                                <div className="flex justify-between items-center px-1.5 py-1.5">
                                  <button className="p-0.5 text-gray-600 rounded-full hover:bg-gray-100 border border-gray-300" onClick={(e) => { e.stopPropagation(); updateQty(row.strike, 'CE', -1); }}><Minus className="w-3 h-3"/></button>
                                  <span className="text-[13px] font-bold text-gray-900">{getLeg(row.strike, 'CE')?.qty}</span>
                                  <button className="p-0.5 text-gray-600 rounded-full hover:bg-gray-100 border border-gray-300" onClick={(e) => { e.stopPropagation(); updateQty(row.strike, 'CE', 1); }}><Plus className="w-3 h-3"/></button>
                                </div>
                                <div className="text-[10px] text-gray-500 pb-1 text-center bg-gray-50">
                                   {getLeg(row.strike, 'CE')?.qty} Lot = {(getLeg(row.strike, 'CE')?.qty || 1) * 65} Qty
                                </div>
                              </div>
                            )}
                         </div>
                       )}
                    </td>
                    
                    {/* Strike Center Column */}
                    <td style={{...tdStyle, backgroundColor: '#f9fafb'}} className="border-l border-r border-[#f3f4f6] align-middle">
                      <div className="flex flex-col justify-center h-full min-h-[4rem]">
                        <div className="text-gray-900 font-bold text-[14px]">{row.strike}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">PCR: {row.pcr}</div>
                      </div>
                    </td>

                    {/* Put Side */}
                    <td colSpan={2} style={{...tdStyle, padding: '10px 8px'}} className={`${row.strike > spotPrice ? 'bg-[#fffbf0]' : ''}`}>
                       <div className="flex justify-between items-start mb-2 px-1">
                          <div className="text-left cursor-pointer" onClick={(e) => { !isStrategyMode && e.stopPropagation(); !isStrategyMode && setSelectedContract({strike: row.strike, type: 'PE'})}}>
                            <div className="text-[#c2410c] font-medium text-[13px]">{row.pe.ltp}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">{row.pe.ltpChg}</div>
                          </div>
                          <div className="text-right cursor-pointer" onClick={(e) => { !isStrategyMode && e.stopPropagation(); !isStrategyMode && setSelectedContract({strike: row.strike, type: 'PE'})}}>
                            <div className="text-emerald-700 font-medium text-[13px]">{row.pe.oi}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">{row.pe.oiPos ? '+' : '-'}{row.pe.oiChg}</div>
                          </div>
                       </div>

                       {isStrategyMode && (
                         <div className="flex flex-col mb-1 w-full max-w-[130px] mx-auto">
                            <div className="flex gap-2 justify-center">
                              <button onClick={(e) => { e.stopPropagation(); toggleLeg(row.strike, 'PE', 'Buy'); }}
                                className={`flex-1 py-1.5 rounded transition font-bold text-xs ${getLeg(row.strike, 'PE')?.action === 'Buy' ? 'bg-[#107c5a] text-white border border-[#107c5a]' : 'bg-transparent text-[#107c5a] border border-[#107c5a] hover:bg-[#107c5a]/10'}`}>
                                Buy
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); toggleLeg(row.strike, 'PE', 'Sell'); }}
                                className={`flex-1 py-1.5 rounded transition font-bold text-xs ${getLeg(row.strike, 'PE')?.action === 'Sell' ? 'bg-[#d85638] text-white border border-[#d85638]' : 'bg-transparent text-[#d85638] border border-[#d85638] hover:bg-[#d85638]/10'}`}>
                                Sell
                              </button>
                            </div>
                            {getLeg(row.strike, 'PE') && (
                              <div className="flex flex-col border border-gray-200 bg-white rounded mt-1.5 shadow-sm overflow-hidden">
                                <div className="flex justify-between items-center px-1.5 py-1.5">
                                  <button className="p-0.5 text-gray-600 rounded-full hover:bg-gray-100 border border-gray-300" onClick={(e) => { e.stopPropagation(); updateQty(row.strike, 'PE', -1); }}><Minus className="w-3 h-3"/></button>
                                  <span className="text-[13px] font-bold text-gray-900">{getLeg(row.strike, 'PE')?.qty}</span>
                                  <button className="p-0.5 text-gray-600 rounded-full hover:bg-gray-100 border border-gray-300" onClick={(e) => { e.stopPropagation(); updateQty(row.strike, 'PE', 1); }}><Plus className="w-3 h-3"/></button>
                                </div>
                                <div className="text-[10px] text-gray-500 pb-1 text-center bg-gray-50">
                                   {getLeg(row.strike, 'PE')?.qty} Lot = {(getLeg(row.strike, 'PE')?.qty || 1) * 65} Qty
                                </div>
                              </div>
                            )}
                         </div>
                       )}
                    </td>

                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sticky Bottom Bars */}
      {!isStrategyMode ? (
        <div className="flex-shrink-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-t border-gray-100 z-30">
          <div className="flex justify-between items-center px-4 py-3 text-xs font-semibold text-gray-600 border-b border-gray-100">
             <div className="flex gap-3">
               <span className="text-gray-900">Orders (0)</span> | 
               <span>Positions (0)</span>
             </div>
             <div className="flex items-center gap-1">
               <Activity className="w-3 h-3" /> Day P&L (Nifty 50): <span className="text-gray-400">0.00</span>
             </div>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
             <div className="flex items-center gap-4 text-xs font-semibold text-gray-700">
               <div className="flex items-center gap-1.5 px-2 py-1 bg-violet-50 text-violet-700 rounded border border-violet-100">
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.04-2.71c-.2-.28-.57-.42-.9-.35-.33.05-.6.31-.66.63l-1.17 6.3h11.01L15.5 6.5c-.05-.32-.31-.58-.64-.63-.33-.07-.7.07-.9.35z"/></svg>
               </div>
               <span>Max pain: 22,800.00</span>
               <span className="text-gray-400">|</span>
               <span>VIX: <span className="text-emerald-600">▲ 25.52</span></span>
             </div>
             <div className="flex gap-2">
               <button className="px-3 py-1 border border-gray-200 rounded font-bold text-xs text-gray-700 shadow-sm bg-white flex items-center gap-1">
                 OI <Activity className="w-3 h-3" />
               </button>
               <button className="p-1 border border-gray-200 rounded shadow-sm bg-white">
                 <Settings className="w-4 h-4 text-gray-700" />
               </button>
             </div>
          </div>
        </div>
      ) : (
        <div className="flex-shrink-0 bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.08)] border-t border-gray-200 z-30 flex flex-col">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
            <span className="text-[13px] font-bold text-gray-800">Entry criteria</span>
            <span className="text-[13px] font-bold text-[#4c1d95]">Set now</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 shadow-sm z-10 hover:bg-gray-50 cursor-pointer">
            <span className="text-[13px] font-bold text-gray-800">Stop-loss & Target</span>
            <span className="text-[13px] font-bold text-[#4c1d95]">Set now</span>
          </div>
          <div className="bg-[#f9fafb] px-4 py-4 flex flex-col gap-4">
             <div className="flex justify-between items-center">
               <div className="text-[13px]">
                 <span className="text-[#4c1d95] font-bold border-b border-dashed border-[#4c1d95]">Required:</span>
                 <span className="font-bold text-gray-900 ml-1">
                   ₹{totalRequired.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                 </span>
                 {strategyLegs.length > 0 && <Activity className="w-3 h-3 inline-block ml-1 text-gray-400 opacity-80" />}
               </div>
               <div className="text-[13px]">
                 <span className="text-gray-500 font-medium">Available:</span>
                 <span className="font-bold text-gray-900 ml-1">
                   ₹{availableBalance.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                 </span>
               </div>
             </div>
             <div className="flex gap-3">
                <div className="w-12 h-12 rounded-lg border border-gray-300 bg-white shadow-sm flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <button className={`flex-1 font-bold rounded-lg shadow-md transition-all text-[15px] ${shortfall > 0 ? 'bg-[#4c1d95] hover:bg-purple-800 text-white active:scale-[0.99]' : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.99]'}`}>
                   {shortfall > 0 
                     ? `Add ₹${shortfall.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} to continue` 
                     : strategyLegs.length > 0 
                       ? 'Execute Strategy' 
                       : 'Select contracts'}
                </button>
             </div>
             {strategyLegs.length > 0 && (
               <p className="text-[11px] text-gray-500 text-center px-4 max-w-sm mx-auto leading-relaxed">
                 ₹{bufferMargin.toLocaleString('en-IN', {minimumFractionDigits: 0, maximumFractionDigits: 0})} has been added as buffer in case the price changes.
               </p>
             )}
          </div>
        </div>
      )}

      {/* Buy/Sell Bottom Sheet Modal (Only active if Strategy Mode is OFF) */}
      {!isStrategyMode && selectedContract && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={() => setSelectedContract(null)}></div>
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col" style={{ height: '85vh' }}>
            {/* Modal Header */}
            <div className="flex justify-between items-start p-4 pb-2 flex-shrink-0">
              <div className="flex flex-col items-center mx-auto absolute left-0 right-0 -top-3">
                 <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
              </div>
              <div className="mt-2">
                <h3 className="text-[15px] font-medium text-[#4c1d95] leading-tight inline-block border-b border-[#4c1d95] pb-0.5">
                  NIFTY {selectedContract.strike} {selectedContract.type}
                </h3>
                <p className="text-[11px] text-gray-500 uppercase mt-1">NFO 07 APR 26</p>
              </div>
              <div className="flex gap-4 mt-2">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <PlusCircle className="w-5 h-5 text-gray-700" />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Chart Placeholder Area */}
              <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                <Activity className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-[13px]">No data available for this period.</p>
                <p className="text-[13px]">Try a different time range.</p>
              </div>

              {/* Timeframe Toggles */}
              <div className="flex justify-center gap-2 px-4 mb-4">
                {['5m', '15m', '30m', '1H', '1D'].map((t, idx) => (
                  <button key={t} className={`px-2.5 py-1 rounded text-xs font-medium border ${idx === 0 ? 'border-purple-800 text-purple-900 bg-purple-50' : 'border-gray-200 text-gray-600'}`}>{t}</button>
                ))}
                <button className="p-1 px-1.5 rounded border border-gray-200 text-purple-800"><Activity className="w-4 h-4" /></button>
                <button className="p-1 px-1.5 rounded border border-gray-200 text-purple-800"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg></button>
              </div>

              {/* Scalper / Chart 360 */}
              <div className="flex border-t border-b border-gray-100 py-3 mb-2 bg-gray-50/50">
                <div className="flex-1 flex justify-center items-center gap-2 text-sm font-bold text-violet-800 border-r border-gray-200">
                  <div className="bg-violet-800 text-white rounded p-0.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                  Scalper
                </div>
                <div className="flex-1 flex justify-center items-center gap-2 text-sm font-bold text-violet-800">
                  Chart 360
                </div>
              </div>

              {/* Data Tabs */}
              <div className="flex border-b border-gray-200 px-4 gap-6 text-sm font-medium text-gray-500 mb-4">
                <button className="pb-2 text-gray-900 border-b-2 border-gray-900">Stats</button>
                <button className="pb-2">Depth</button>
                <button className="pb-2">Orders</button>
                <button className="pb-2">Positions</button>
              </div>

              {/* Stats Content */}
              <div className="px-4 pb-24">
                <div className="grid grid-cols-4 gap-2 border-b border-gray-100 pb-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Open</p>
                    <p className="text-xs font-semibold text-gray-800">98.00</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">High</p>
                    <p className="text-xs font-semibold text-gray-800">193.65</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Low</p>
                    <p className="text-xs font-semibold text-gray-800">61.10</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Prev. close</p>
                    <p className="text-xs font-semibold text-gray-800">221.75</p>
                  </div>
                </div>

                <div className="flex">
                  {/* Left Column Data */}
                  <div className="flex-1 border-r border-gray-100 pr-4">
                    <div className="flex justify-between mb-3 text-xs"><span className="text-gray-500">LTP</span><span className="font-semibold">170.00</span></div>
                    <div className="flex justify-between mb-3 text-xs"><span className="text-gray-500">Ch. in LTP (%)</span><span className="font-semibold">-23.34%</span></div>
                    <div className="flex justify-between mb-3 text-xs"><span className="text-gray-500">OI</span><span className="font-semibold">19,66,770</span></div>
                    <div className="flex justify-between mb-3 text-xs"><span className="text-gray-500">Ch. in OI (%)</span><span className="font-semibold text-gray-800">-8.27%</span></div>
                    <div className="flex justify-between text-xs"><span className="text-gray-500">Implied Vol.</span><span className="font-semibold">23.48</span></div>
                  </div>
                  {/* Right Column Greeks */}
                  <div className="flex-1 pl-4">
                    <div className="flex justify-between mb-3 text-xs"><span className="text-gray-500">Delta</span><span className="font-semibold">0.3901</span></div>
                    <div className="flex justify-between mb-3 text-xs"><span className="text-gray-500">Gamma</span><span className="font-semibold">0.0006</span></div>
                    <div className="flex justify-between mb-3 text-xs"><span className="text-gray-500">Theta</span><span className="font-semibold">-23.9573</span></div>
                    <div className="flex justify-between mb-3 text-xs"><span className="text-gray-500">Vega</span><span className="font-semibold">10.2019</span></div>
                    <div className="flex justify-between text-xs"><span className="text-gray-500">Rho</span><span className="font-semibold">1.1908</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Fixed */}
            <div className="bg-white border-t border-gray-200 px-4 py-3 flex gap-4 flex-shrink-0">
              <button className="flex-1 bg-[#107c5a] text-white font-medium py-3 rounded text-sm hover:bg-emerald-700 transition">
                Buy
              </button>
              <button className="flex-1 bg-[#d85638] text-white font-medium py-3 rounded text-sm hover:bg-red-700 transition">
                Sell
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
