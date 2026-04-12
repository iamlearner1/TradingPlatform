import { ArrowLeft, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
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

export default function StrategyBuilder() {
  const [spotPrice, setSpotPrice] = useState(23900);
  const [currentDate] = useState(new Date());

  const [showSymbolDropdown, setShowSymbolDropdown] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState("NIFTY");
  const INDICES = ["NIFTY", "BANKNIFTY", "FINNIFTY", "SENSEX"];

  const [positions, setPositions] = useState<Position[]>([]);

  // Helper: fair-value of an option at any arbitrary spot price
  const optionFairValue = (strike: number, type: 'CE' | 'PE', atSpot: number) => {
    const diff = strike - atSpot;
    if (type === 'CE') return Math.max(atSpot - strike, 0) + 140 * Math.exp(-Math.abs(diff) / 150);
    return Math.max(strike - atSpot, 0) + 140 * Math.exp(-Math.abs(diff) / 150);
  };

  // Live 1-second market tick
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotPrice(prev => prev + (Math.random() - 0.5) * 6);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Reset spot when symbol changes
  useEffect(() => {
    const baseSpots: Record<string, number> = {
      NIFTY: 23900, BANKNIFTY: 51500, FINNIFTY: 21550, SENSEX: 78500
    };
    setSpotPrice(baseSpots[selectedSymbol] ?? 23900);
    setPositions([]);
  }, [selectedSymbol]);

  const adjustPositionQty = (strike: number, type: 'CE' | 'PE', action: 'Buy' | 'Sell', delta: number) => {
    setPositions(prev => {
      const idx = prev.findIndex(l => l.strike === strike && l.type === type && l.action === action);
      if (idx >= 0) {
        const nextQty = prev[idx].qty + delta;
        if (nextQty <= 0) return prev.filter((_, i) => i !== idx);
        return prev.map((l, i) => i === idx ? { ...l, qty: nextQty } : l);
      }
      return prev;
    });
  };

  const addOrTogglePosition = (strike: number, type: 'CE' | 'PE', action: 'Buy' | 'Sell', price: number) => {
    setPositions(prev => {
      const idx = prev.findIndex(l => l.strike === strike && l.type === type && l.action === action);
      if (idx >= 0) return prev.filter((_, i) => i !== idx);
      return [...prev, { id: Date.now().toString(), action, qty: 1, type, strike, price, enabled: true }];
    });
  };

  const chartData = useMemo(() => {
    const data = [];
    const activePositions = positions.filter(p => p.enabled);
    const strikes = activePositions.map(p => p.strike);
    const range = selectedSymbol === 'BANKNIFTY' ? 2000 : selectedSymbol === 'SENSEX' ? 4000 : 800;
    const step = selectedSymbol === 'BANKNIFTY' || selectedSymbol === 'SENSEX' ? 100 : 25;
    const minS = strikes.length > 0 ? Math.min(...strikes) - range : spotPrice - range;
    const maxS = strikes.length > 0 ? Math.max(...strikes) + range : spotPrice + range;

    for (let i = minS; i <= maxS; i += step) {
      let totalPl = 0;
      let t0Pl = 0;

      activePositions.forEach(p => {
        const mult = (p.action === 'Buy' ? 1 : -1) * p.qty * 25;
        const expVal = p.type === 'CE' ? Math.max(i - p.strike, 0) : Math.max(p.strike - i, 0);
        totalPl += (expVal - p.price) * mult;

        const liveEntryPrice = optionFairValue(p.strike, p.type, spotPrice);
        const fairAtI = optionFairValue(p.strike, p.type, i);
        t0Pl += (fairAtI - liveEntryPrice) * mult;
      });

      data.push({ spot: i, pl: totalPl, t0: t0Pl });
    }
    return data;
  }, [positions, spotPrice, selectedSymbol]);

  const stats = useMemo(() => {
    if (positions.length === 0) return { livePl: 0, maxP: '₹0', maxL: '₹0' };
    const livePl = chartData.find(d => d.spot >= spotPrice)?.t0 || 0;
    const vals = chartData.map(d => d.pl);
    const maxP = Math.max(...vals);
    const maxL = Math.min(...vals);
    return {
      livePl,
      maxP: maxP > 500000 ? 'Unlimited' : `₹${maxP.toLocaleString('en-IN')}`,
      maxL: maxL < -500000 ? 'Unlimited' : `₹${maxL.toLocaleString('en-IN')}`,
    };
  }, [chartData, spotPrice, positions]);

  const off = useMemo(() => {
    if (chartData.length === 0) return 0;
    const max = Math.max(...chartData.map(d => Math.max(d.pl, 0)));
    const min = Math.min(...chartData.map(d => Math.min(d.pl, 0)));
    if (max <= 0) return 1;
    if (min >= 0) return 0;
    return max / (max - min);
  }, [chartData]);

  const optionChain = useMemo(() => {
    const step = selectedSymbol === 'BANKNIFTY' ? 100 : selectedSymbol === 'SENSEX' ? 200 : 50;
    const ATM = Math.round(spotPrice / step) * step;
    const chain = [];
    for (let i = ATM - step * 6; i <= ATM + step * 6; i += step) {
      const diff = i - spotPrice;
      const cl = Math.max(spotPrice - i, 0) + 140 * Math.exp(-Math.abs(diff) / 150);
      const pl = Math.max(i - spotPrice, 0) + 140 * Math.exp(-Math.abs(diff) / 150);
      let cd = 0.5 - diff / (step * 16);
      cd = Math.max(0.01, Math.min(0.99, cd));
      chain.push({ s: i, cd, cl, pd: 1 - cd, pl, isAtm: i === ATM });
    }
    return chain;
  }, [spotPrice, selectedSymbol]);

  return (
    <div className="h-screen flex flex-col overflow-hidden max-w-md mx-auto relative shadow-2xl bg-[#f8f9fa]">
      {/* HEADER */}
      <div className="bg-violet-600 flex items-center px-4 py-3 border-b border-violet-700 flex-shrink-0 justify-between z-[90]">
        <div className="flex items-center gap-2">
          <Link to="/strategy" className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <span className="text-[16px] font-bold text-white tracking-tight ml-1">Strategy Builder</span>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSymbolDropdown(!showSymbolDropdown)}
            className="flex items-center gap-2 bg-[#1e1b4b] text-white rounded-lg px-3 py-1.5 shadow-sm min-w-[120px] active:bg-[#2d2870] transition-colors">
            <span className="bg-white text-[#1e1b4b] text-[9px] font-black px-1 py-0.5 rounded">
              {selectedSymbol === 'NIFTY' ? '50' : selectedSymbol === 'BANKNIFTY' ? 'BNK' : selectedSymbol === 'FINNIFTY' ? 'FIN' : 'SEN'}
            </span>
            <span className="font-extrabold text-[12px] tracking-wide flex-1 text-left">{selectedSymbol}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSymbolDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showSymbolDropdown && (
            <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 z-[999] py-2 overflow-hidden">
              <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 mb-1">Select Index</div>
              {INDICES.map(sym => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => { setSelectedSymbol(sym); setShowSymbolDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-bold flex items-center gap-3 transition-colors ${sym === selectedSymbol ? 'bg-blue-50 text-blue-600' : 'text-gray-800 hover:bg-gray-50'}`}>
                  <span className={`w-7 h-5 rounded text-[9px] font-black flex items-center justify-center text-white ${sym === selectedSymbol ? 'bg-blue-600' : 'bg-[#1e1b4b]'}`}>
                    {sym === 'NIFTY' ? '50' : sym === 'BANKNIFTY' ? 'BNK' : sym === 'FINNIFTY' ? 'FIN' : 'SEN'}
                  </span>
                  {sym}
                  {sym === selectedSymbol && <span className="ml-auto text-blue-500">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
        {/* OPTION CHAIN */}
        <div className="bg-white flex-shrink-0">
          <div className="flex px-4 items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-30">
            <div className="font-bold text-[13px] text-gray-800 py-3">Option Chain</div>
            <div className="text-[11px] font-bold text-gray-500">Spot: <span className="text-gray-900">{spotPrice.toFixed(2)}</span></div>
          </div>

          <table className="w-full text-left tabular-nums">
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
                const ceBuy  = positions.find(l => l.strike === r.s && l.type === 'CE' && l.action === 'Buy');
                const ceSell = positions.find(l => l.strike === r.s && l.type === 'CE' && l.action === 'Sell');
                const peBuy  = positions.find(l => l.strike === r.s && l.type === 'PE' && l.action === 'Buy');
                const peSell = positions.find(l => l.strike === r.s && l.type === 'PE' && l.action === 'Sell');
                const isAtmRow = Math.abs(r.s - spotPrice) <= 50;

                const QtyPicker = ({ leg, type, action }: { leg: any; type: any; action: any }) =>
                  leg ? (
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', borderRadius: '6px', padding: '2px' }}>
                      <button type="button" onClick={() => adjustPositionQty(r.s, type, action, -1)}
                        style={{ width: 24, height: 24, borderRadius: '4px', background: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', color: '#374151', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                      <span style={{ fontWeight: 800, fontSize: 13, width: 24, textAlign: 'center', color: '#111827' }}>{leg.qty}</span>
                      <button type="button" onClick={() => adjustPositionQty(r.s, type, action, 1)}
                        style={{ width: 24, height: 24, borderRadius: '4px', background: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', color: '#374151', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                  ) : null;

                return (
                  <tr key={r.s} style={{ borderBottom: '1px solid #f9fafb', background: isAtmRow ? '#fcfdfd' : '#fff', verticalAlign: 'top' }}>
                    <td className="py-2.5 px-0.5 align-top text-center text-[10px] font-semibold text-gray-400">{r.cd.toFixed(2)}</td>
                    <td className="py-2.5 px-1 align-top text-center">
                      <div className="font-extrabold text-[14px] text-gray-900 mb-1.5">{r.cl.toFixed(2)}</div>
                      {(ceBuy || ceSell) ? (
                        <div className="flex flex-col gap-1 items-center">
                          {ceBuy  && <div className="flex items-center gap-1"><span className="text-[9px] font-black text-emerald-600 uppercase">Buy</span><QtyPicker leg={ceBuy}  type="CE" action="Buy"  /></div>}
                          {ceSell && <div className="flex items-center gap-1"><span className="text-[9px] font-black text-red-600 uppercase">Sell</span><QtyPicker leg={ceSell} type="CE" action="Sell" /></div>}
                        </div>
                      ) : (
                        <div className="flex gap-1.5 justify-center">
                          <button onClick={() => addOrTogglePosition(r.s, 'CE', 'Buy',  parseFloat(r.cl.toFixed(2)))} className="text-[9px] font-bold bg-emerald-50 text-emerald-600 rounded px-2.5 py-1 cursor-pointer">BUY</button>
                          <button onClick={() => addOrTogglePosition(r.s, 'CE', 'Sell', parseFloat(r.cl.toFixed(2)))} className="text-[9px] font-bold bg-red-50 text-red-600 rounded px-2.5 py-1 cursor-pointer">SELL</button>
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-1 align-top">
                      <div className={`border rounded-[6px] font-extrabold text-[12px] w-[60px] mx-auto h-[28px] flex items-center justify-center ${isAtmRow ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>{r.s}</div>
                    </td>
                    <td className="py-2.5 px-1 align-top text-center">
                      <div className="font-extrabold text-[14px] text-gray-900 mb-1.5">{r.pl.toFixed(2)}</div>
                      {(peBuy || peSell) ? (
                        <div className="flex flex-col gap-1 items-center">
                          {peBuy  && <div className="flex items-center gap-1"><span className="text-[9px] font-black text-emerald-600 uppercase">Buy</span><QtyPicker leg={peBuy}  type="PE" action="Buy"  /></div>}
                          {peSell && <div className="flex items-center gap-1"><span className="text-[9px] font-black text-red-600 uppercase">Sell</span><QtyPicker leg={peSell} type="PE" action="Sell" /></div>}
                        </div>
                      ) : (
                        <div className="flex gap-1.5 justify-center">
                          <button onClick={() => addOrTogglePosition(r.s, 'PE', 'Buy',  parseFloat(r.pl.toFixed(2)))} className="text-[9px] font-bold bg-emerald-50 text-emerald-600 rounded px-2.5 py-1 cursor-pointer">BUY</button>
                          <button onClick={() => addOrTogglePosition(r.s, 'PE', 'Sell', parseFloat(r.pl.toFixed(2)))} className="text-[9px] font-bold bg-red-50 text-red-600 rounded px-2.5 py-1 cursor-pointer">SELL</button>
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-0.5 align-top text-center text-[10px] font-semibold text-gray-400">{r.pd.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAYOFF GRAPH */}
        <div className="bg-white mt-1 border-t border-gray-200 flex-shrink-0 pb-10">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fa]">
            <h2 className="font-black text-[14px] text-[#1e1b4b] uppercase tracking-widest">Net Strategy Payoff</h2>
            {positions.length > 0 && (
              <button onClick={() => setPositions([])} className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded">CLEAR ALL</button>
            )}
          </div>

          {positions.length > 0 && (
            <div className="grid grid-cols-2 p-4 gap-y-3 gap-x-2 bg-white border-b border-gray-100">
              <div>
                <p className="text-[11px] text-gray-500 font-bold mb-0.5">Live P&L</p>
                <div className={`font-black text-[15px] px-2 py-0.5 rounded inline-block ${stats.livePl >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {stats.livePl >= 0 ? '+' : ''}{stats.livePl.toFixed(2)}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-bold mb-0.5">Max Profit</p>
                <div className="text-emerald-600 font-black text-[15px]">{stats.maxP}</div>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-bold mb-0.5">Max Loss</p>
                <div className="text-red-600 font-black text-[15px]">{stats.maxL}</div>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-bold mb-0.5">Est. Margin</p>
                <div className="text-gray-900 font-black text-[15px]">{(positions.length * 45000 / 100000).toFixed(2)}L</div>
              </div>
            </div>
          )}

          <div className="bg-white px-2 py-6">
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sbSplitColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset={off} stopColor="#dcfce7" stopOpacity={0.8} />
                    <stop offset={off} stopColor="#fee2e2" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="sbStrokeColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset={off} stopColor="#22c55e" stopOpacity={1} />
                    <stop offset={off} stopColor="#ef4444" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="spot" type="number" domain={['dataMin', 'dataMax']} tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} tickFormatter={(v) => Math.round(v).toLocaleString('en-IN')} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} tickFormatter={(v) => v >= 100000 || v <= -100000 ? `${(v / 100000).toFixed(1)}L` : v} />
                <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} formatter={(v: number) => v.toFixed(2)} labelFormatter={(l) => `Spot: ${Math.round(l as number)}`} />
                <ReferenceLine y={0} stroke="#6b7280" strokeWidth={1} />
                <ReferenceLine x={spotPrice} stroke="#1d4ed8" strokeWidth={1.5} strokeDasharray="4 4" />
                <Area type="linear" dataKey="pl" stroke="url(#sbStrokeColor)" strokeWidth={2.5} fill="url(#sbSplitColor)" isAnimationActive={false} />
                <Line type="monotone" dataKey="t0" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
