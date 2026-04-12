import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function PaperTrade() {
  const navigate = useNavigate();
  
  // Mock live indices data
  const [indices, setIndices] = useState([
    { symbol: 'nifty50', name: 'NIFTY 50', price: 22713.10, change: 33.70, percent: 0.15 },
    { symbol: 'niftybank', name: 'NIFTY BANK', price: 48250.10, change: -45.20, percent: -0.10 },
    { symbol: 'sensex', name: 'SENSEX', price: 74450.90, change: 350.10, percent: 0.48 },
    { symbol: 'finnifty', name: 'FINNIFTY', price: 21550.00, change: 15.00, percent: 0.07 },
    { symbol: 'midcpnifty', name: 'MIDCPNIFTY', price: 10850.25, change: 80.25, percent: 0.77 },
  ]);

  // Simulate live price ticks every 1.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prev => prev.map(index => {
        const volatility = index.price * 0.0003; // 0.03% move per tick
        const tick = (Math.random() - 0.5) * volatility;
        const newPrice = index.price + tick;
        const newChange = index.change + tick;
        const newPercent = (newChange / (newPrice - newChange)) * 100;
        return {
          ...index,
          price: newPrice,
          change: newChange,
          percent: newPercent
        };
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col pb-20">
      <div className="bg-[#312579] border-b flex items-center px-4 py-3 flex-shrink-0 relative z-10 shadow-sm text-white">
        <Link to="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="ml-2">
           <h1 className="text-base font-bold text-white leading-tight">Paper Trade</h1>
           <p className="text-[10px] text-white/70 font-medium">Select an index to build strategy</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4 mt-1 px-1">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Activity className="w-4 h-4 text-violet-600" /> Market Indices
          </h2>
          <span className="flex h-2 w-2 relative" title="Live Market">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {indices.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <div 
                key={item.symbol}
                onClick={() => navigate(`/option-chain/${item.symbol}`)}
                className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex justify-between items-center group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: isPositive ? '#10b981' : '#ef4444' }}></div>
                <div className="flex flex-col gap-1.5 pl-1.5">
                  <h3 className="font-black text-[16px] text-gray-900 leading-none">{item.name}</h3>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#1a5f9e]">NSE • F&O Expiry</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end gap-1">
                    <span className={`font-black text-[16px] leading-none ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                      {item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`text-[11px] font-bold flex items-center gap-0.5 ${isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'} px-1.5 py-0.5 rounded shadow-sm`}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isPositive ? '+' : ''}{item.change.toFixed(2)} ({item.percent.toFixed(2)}%)
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-violet-600 transition-colors transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
