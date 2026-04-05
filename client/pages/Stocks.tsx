import React, { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Search, TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Base realistic top Indian stocks
const baseIndianStocks = [
  { id: "s-1", name: "Reliance Industries Ltd", ticker: "RELIANCE", marketCap: "Large Cap", price: "2980.50", change: "+1.24%", isPositive: true },
  { id: "s-2", name: "Tata Consultancy Services", ticker: "TCS", marketCap: "Large Cap", price: "4125.00", change: "+0.85%", isPositive: true },
  { id: "s-3", name: "HDFC Bank Ltd", ticker: "HDFCBANK", marketCap: "Large Cap", price: "1530.25", change: "-0.45%", isPositive: false },
  { id: "s-4", name: "ICICI Bank Ltd", ticker: "ICICIBANK", marketCap: "Large Cap", price: "1098.50", change: "+1.50%", isPositive: true },
  { id: "s-5", name: "Infosys Ltd", ticker: "INFY", marketCap: "Large Cap", price: "1480.30", change: "-1.10%", isPositive: false },
  { id: "s-6", name: "State Bank of India", ticker: "SBIN", marketCap: "Large Cap", price: "765.90", change: "+2.10%", isPositive: true },
  { id: "s-7", name: "Bharti Airtel Ltd", ticker: "BHARTIARTL", marketCap: "Large Cap", price: "1230.40", change: "+0.30%", isPositive: true },
  { id: "s-8", name: "ITC Ltd", ticker: "ITC", marketCap: "Large Cap", price: "415.80", change: "+0.15%", isPositive: true },
  { id: "s-9", name: "Larsen & Toubro Ltd", ticker: "LT", marketCap: "Large Cap", price: "3750.60", change: "-0.95%", isPositive: false },
  { id: "s-10", name: "Bajaj Finance Ltd", ticker: "BAJFINANCE", marketCap: "Large Cap", price: "7200.25", change: "+3.20%", isPositive: true },
  
  { id: "s-11", name: "Yes Bank Ltd", ticker: "YESBANK", marketCap: "Mid Cap", price: "24.50", change: "-2.50%", isPositive: false },
  { id: "s-12", name: "IDFC First Bank", ticker: "IDFCFIRSTB", marketCap: "Mid Cap", price: "84.20", change: "+1.80%", isPositive: true },
  { id: "s-13", name: "Paytm (One 97 Comm)", ticker: "PAYTM", marketCap: "Mid Cap", price: "412.30", change: "-4.20%", isPositive: false },
  { id: "s-14", name: "Polycab India", ticker: "POLYCAB", marketCap: "Mid Cap", price: "5250.00", change: "+2.90%", isPositive: true },
  { id: "s-15", name: "Dixon Technologies", ticker: "DIXON", marketCap: "Mid Cap", price: "7100.80", change: "+5.10%", isPositive: true },
  
  { id: "s-16", name: "Suzlon Energy Ltd", ticker: "SUZLON", marketCap: "Small Cap", price: "42.10", change: "+4.85%", isPositive: true },
  { id: "s-17", name: "Zomato Ltd", ticker: "ZOMATO", marketCap: "Large Cap", price: "165.40", change: "+3.50%", isPositive: true },
  { id: "s-18", name: "Jio Financial Services", ticker: "JIOFIN", marketCap: "Large Cap", price: "355.20", change: "-1.20%", isPositive: false },
  { id: "s-19", name: "IRFC Ltd", ticker: "IRFC", marketCap: "Mid Cap", price: "145.80", change: "+8.50%", isPositive: true },
  { id: "s-20", name: "RVNL", ticker: "RVNL", marketCap: "Mid Cap", price: "265.40", change: "+4.10%", isPositive: true },
];

let generatedStocksCache: any[] | null = null;
const get1000Stocks = () => {
  if (generatedStocksCache) return generatedStocksCache;
  const list = baseIndianStocks.map(s => ({
    ...s,
    fundamentals: {
      peRatio: (Math.random() * 40 + 10).toFixed(2),
      pbRatio: (Math.random() * 5 + 1).toFixed(2),
      divYield: (Math.random() * 3).toFixed(2) + "%",
      roe: (Math.random() * 20 + 5).toFixed(2) + "%",
      roce: (Math.random() * 25 + 5).toFixed(2) + "%",
      debtToEq: (Math.random() * 1.5).toFixed(2),
      bookValue: "₹" + (Math.random() * 500 + 50).toFixed(2),
      faceValue: "₹" + (Math.random() > 0.5 ? "10" : "5"),
    }
  }));
  
  const caps = ["Large Cap", "Mid Cap", "Small Cap"];
  const prefixes = ["National", "Global", "Indian", "Tata", "Reliance", "Birla", "Hindalco", "Apex", "Nova", "Zenith"];
  const suffixes = ["Industries", "Enterprises", "Corp", "Ltd", "Holdings", "Technologies", "Motors", "Power", "Cement"];
  
  for (let i = list.length; i < 1000; i++) {
    const cap = caps[Math.floor(Math.random() * caps.length)];
    const isPos = Math.random() > 0.45; 
    const priceStr = (Math.random() * 8000 + 10).toFixed(2);
    const changeStr = `${isPos ? '+' : '-'}${(Math.random() * 5).toFixed(2)}%`;
    
    const pre = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suf = suffixes[Math.floor(Math.random() * suffixes.length)];
    const randomName = `${pre} ${suf} ${i}`;
    const randomTicker = `${pre.toUpperCase().substring(0,3)}${suf.toUpperCase().substring(0,3)}${i}`;
    
    list.push({
      id: `m-${i}`,
      name: randomName,
      ticker: randomTicker,
      marketCap: cap,
      price: priceStr,
      change: changeStr,
      isPositive: isPos,
      fundamentals: {
        peRatio: (Math.random() * 40 + 10).toFixed(2),
        pbRatio: (Math.random() * 5 + 1).toFixed(2),
        divYield: (Math.random() * 3).toFixed(2) + "%",
        roe: (Math.random() * 20 + 5).toFixed(2) + "%",
        roce: (Math.random() * 25 + 5).toFixed(2) + "%",
        debtToEq: (Math.random() * 1.5).toFixed(2),
        bookValue: "₹" + (Math.random() * 500 + 50).toFixed(2),
        faceValue: "₹" + (Math.random() > 0.5 ? "10" : "5"),
      }
    });
  }
  
  list.sort((a, b) => a.name.localeCompare(b.name));
  generatedStocksCache = list;
  return list;
}

export default function Stocks() {
  const allStocks = useMemo(() => get1000Stocks(), []);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(50); 
  const navigate = useNavigate();

  useEffect(() => {
    setVisibleCount(50);
  }, [searchQuery, activeFilter]);

  const filteredStocks = useMemo(() => {
    return allStocks.filter(stock => {
      const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            stock.ticker.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCap = activeFilter === "All" || stock.marketCap === activeFilter;
      return matchesSearch && matchesCap;
    });
  }, [searchQuery, activeFilter, allStocks]);

  const displayedStocks = filteredStocks.slice(0, visibleCount);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 100) {
      if (visibleCount < filteredStocks.length) {
        setVisibleCount(prev => prev + 50);
      }
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden max-w-md mx-auto relative shadow-2xl">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 flex items-center px-4 py-3 flex-shrink-0 relative z-10 shadow-sm">
        <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </Link>
        <div className="ml-2">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">Indian Stocks</h1>
          <p className="text-[13px] text-gray-500">Analytics & trading across 1,000+ equities</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border-b border-gray-100 z-10 px-4 pt-4 pb-3">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by company or ticker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium placeholder:font-normal"
          />
        </div>

        {/* Market Cap Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          {["All", "Large Cap", "Mid Cap", "Small Cap"].map(cap => (
            <button 
              key={cap}
              onClick={() => setActiveFilter(cap)}
              className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${
                activeFilter === cap 
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cap}
            </button>
          ))}
        </div>
      </div>

      {/* Stock List with Infinite Scroll Behavior */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-3 pb-safe"
        onScroll={handleScroll}
      >
        <div className="flex justify-between items-center mb-1 px-1">
           <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider text-[13px]">
             Match Results
           </h2>
           <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded">
             {filteredStocks.length} Found
           </span>
        </div>

        {displayedStocks.length > 0 ? displayedStocks.map((stock) => (
          <div key={stock.id} onClick={() => navigate(`/stock/${stock.ticker}`)} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:border-violet-300 transition-colors cursor-pointer group active:scale-[0.98]">
            <div className="flex items-center gap-3 overflow-hidden flex-1 mr-4">
              <div className="w-12 h-12 bg-gray-50 border border-gray-100 text-violet-600 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-violet-50 transition-colors">
                {stock.name.charAt(0)}
              </div>
              
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-900 text-[15px] truncate leading-tight mb-1">
                  {stock.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-gray-500 tracking-wide uppercase px-1.5 py-0.5 bg-gray-100 rounded">
                    {stock.ticker}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {stock.marketCap}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right shrink-0">
              <p className="font-bold text-gray-900 text-[15px] mb-1">₹{stock.price}</p>
              <div className={`flex items-center justify-end gap-1 text-[13px] font-bold ${stock.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {stock.isPositive ? <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} /> : <TrendingDown className="w-3.5 h-3.5" strokeWidth={3} />}
                <span>{stock.change}</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
               <Search className="w-8 h-8 text-gray-300" />
             </div>
             <h3 className="text-gray-900 font-bold mb-1">No stocks found</h3>
             <p className="text-gray-500 text-sm max-w-[200px]">We couldn't find any equities matching your criteria.</p>
          </div>
        )}
        
        {visibleCount < filteredStocks.length && (
          <div className="py-6 flex justify-center text-gray-400">
             <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
