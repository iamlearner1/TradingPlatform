import React, { useState } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, X, Globe, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";

type MarketIndex = {
  id: string;
  name: string;
  value: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  open: string;
  high: string;
  low: string;
  prevClose: string;
  constituents: { name: string; weight: string; change: string; isPositive: boolean }[];
};

const mockIndices: Record<string, MarketIndex[]> = {
  "Domestic": [
    {
      id: "nifty50", name: "NIFTY 50", value: "22,514.65", change: "150.50", changePercent: "0.67%", isPositive: true,
      open: "22,400.10", high: "22,525.00", low: "22,380.50", prevClose: "22,364.15",
      constituents: [
        { name: "HDFC Bank", weight: "11.5%", change: "+1.2%", isPositive: true },
        { name: "Reliance Ind.", weight: "10.1%", change: "+0.8%", isPositive: true },
        { name: "Infosys", weight: "5.8%", change: "-0.4%", isPositive: false },
      ]
    },
    {
      id: "sensex", name: "SENSEX", value: "74,119.39", change: "508.21", changePercent: "0.69%", isPositive: true,
      open: "73,800.50", high: "74,150.00", low: "73,750.20", prevClose: "73,611.18",
      constituents: [
        { name: "HDFC Bank", weight: "14.5%", change: "+1.2%", isPositive: true },
        { name: "Reliance Ind.", weight: "12.1%", change: "+0.8%", isPositive: true },
        { name: "TCS", weight: "5.1%", change: "+0.1%", isPositive: true },
      ]
    },
    {
      id: "banknifty", name: "NIFTY BANK", value: "48,159.00", change: "-120.45", changePercent: "-0.25%", isPositive: false,
      open: "48,300.00", high: "48,350.00", low: "48,050.00", prevClose: "48,279.45",
      constituents: [
        { name: "HDFC Bank", weight: "29.5%", change: "+1.2%", isPositive: true },
        { name: "ICICI Bank", weight: "23.1%", change: "-1.8%", isPositive: false },
        { name: "SBI", weight: "11.1%", change: "-0.5%", isPositive: false },
      ]
    },
    {
      id: "niftyit", name: "NIFTY IT", value: "35,100.20", change: "450.80", changePercent: "1.30%", isPositive: true,
      open: "34,800.00", high: "35,150.00", low: "34,750.00", prevClose: "34,649.40",
      constituents: [
        { name: "TCS", weight: "27.5%", change: "+1.5%", isPositive: true },
        { name: "Infosys", weight: "25.1%", change: "-0.4%", isPositive: false },
        { name: "HCL Tech", weight: "10.1%", change: "+2.5%", isPositive: true },
      ]
    },
    {
      id: "niftymidcap", name: "NIFTY MIDCAP 100", value: "49,500.25", change: "890.30", changePercent: "1.85%", isPositive: true,
      open: "48,800.00", high: "49,600.00", low: "48,700.00", prevClose: "48,609.95",
      constituents: [
        { name: "Power Finance", weight: "3.5%", change: "+4.2%", isPositive: true },
        { name: "REC Ltd", weight: "3.2%", change: "+3.8%", isPositive: true },
        { name: "Trent", weight: "2.8%", change: "+2.5%", isPositive: true },
      ]
    }
  ],
  "Global": [
    {
      id: "sp500", name: "S&P 500", value: "5,150.48", change: "25.12", changePercent: "0.49%", isPositive: true,
      open: "5,130.00", high: "5,160.00", low: "5,120.00", prevClose: "5,125.36",
      constituents: [
        { name: "Microsoft", weight: "7.1%", change: "+1.2%", isPositive: true },
        { name: "Apple", weight: "6.5%", change: "-0.8%", isPositive: false },
        { name: "NVIDIA", weight: "5.1%", change: "+3.5%", isPositive: true },
      ]
    },
    {
      id: "nasdaq", name: "NASDAQ 100", value: "18,200.50", change: "150.20", changePercent: "0.83%", isPositive: true,
      open: "18,100.00", high: "18,250.00", low: "18,050.00", prevClose: "18,050.30",
      constituents: [
        { name: "Microsoft", weight: "8.5%", change: "+1.2%", isPositive: true },
        { name: "Apple", weight: "7.8%", change: "-0.8%", isPositive: false },
        { name: "NVIDIA", weight: "6.2%", change: "+3.5%", isPositive: true },
      ]
    },
    {
      id: "ftse", name: "FTSE 100", value: "7,650.00", change: "-45.20", changePercent: "-0.59%", isPositive: false,
      open: "7,690.00", high: "7,700.00", low: "7,640.00", prevClose: "7,695.20",
      constituents: [
        { name: "Shell", weight: "8.5%", change: "-1.2%", isPositive: false },
        { name: "AstraZeneca", weight: "7.8%", change: "-0.8%", isPositive: false },
        { name: "HSBC", weight: "6.2%", change: "+0.5%", isPositive: true },
      ]
    },
    {
      id: "nikkei", name: "NIKKEI 225", value: "39,500.25", change: "890.30", changePercent: "2.35%", isPositive: true,
      open: "38,800.00", high: "39,600.00", low: "38,700.00", prevClose: "38,609.95",
      constituents: [
        { name: "Fast Retailing", weight: "10.5%", change: "+4.2%", isPositive: true },
        { name: "Tokyo Electron", weight: "8.2%", change: "+5.1%", isPositive: true },
        { name: "SoftBank Group", weight: "4.8%", change: "+2.5%", isPositive: true },
      ]
    }
  ]
};

export default function Indices() {
  const [activeTab, setActiveTab] = useState<string>("Domestic");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<MarketIndex | null>(null);

  const displayedIndices = mockIndices[activeTab].filter(idx => 
    idx.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden max-w-md mx-auto relative shadow-2xl">
      {/* Header */}
      <div className="bg-violet-600 border-b border-violet-700 flex items-center px-4 py-3 flex-shrink-0 relative z-10">
        <Link to="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-violet-700 transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <div className="ml-2">
          <h1 className="text-xl font-bold text-white leading-tight">Market Indices</h1>
          <p className="text-[13px] text-violet-200">Track domestic and global markets</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative">
        <div className="p-4 bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
           {/* Custom Tabs */}
           <div className="flex bg-gray-100 p-1.5 rounded-xl mb-4">
             {["Domestic", "Global"].map(tab => (
               <button 
                 key={tab}
                 onClick={() => { setActiveTab(tab); setSearchQuery(""); }}
                 className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[14px] font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
               >
                 {tab === "Domestic" ? <MapPin className="w-4 h-4"/> : <Globe className="w-4 h-4"/>}
                 {tab}
               </button>
             ))}
           </div>
           
           <div className="relative">
             <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder={`Search ${activeTab} Indices...`}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
             />
           </div>
        </div>

        <div className="p-4 pb-10 space-y-3">
          {displayedIndices.length > 0 ? displayedIndices.map((idx) => (
            <div 
              key={idx.id} 
              onClick={() => setSelectedIndex(idx)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:border-violet-300 transition-colors active:scale-[0.98]"
            >
              <div>
                <h3 className="font-bold text-gray-900 text-[16px] mb-1">{idx.name}</h3>
                <p className="text-[12px] text-gray-500 font-medium">Index</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-[16px] mb-1">{idx.value}</p>
                <div className={`flex items-center justify-end gap-1 text-[13px] font-bold ${idx.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                  {idx.isPositive ? <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} /> : <TrendingDown className="w-3.5 h-3.5" strokeWidth={3} />}
                  <span>{idx.change} ({idx.changePercent})</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-sm">No indices found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Index Detail Bottom Sheet */}
      {selectedIndex && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Sheet Header */}
            <div className="flex justify-between items-start p-5 bg-gray-50 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedIndex.name}</h3>
                <p className={`text-[15px] font-bold flex items-center gap-1 ${selectedIndex.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                   <span className="text-gray-900 mr-2">{selectedIndex.value}</span>
                   {selectedIndex.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                   {selectedIndex.change} ({selectedIndex.changePercent})
                </p>
              </div>
              <button 
                onClick={() => setSelectedIndex(null)} 
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 pb-8 space-y-6">
              
              {/* Stats Grid */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-[15px]">Market Stats</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[12px] text-gray-500 font-medium mb-1">Open</p>
                    <p className="font-bold text-gray-900">{selectedIndex.open}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[12px] text-gray-500 font-medium mb-1">Prev. Close</p>
                    <p className="font-bold text-gray-900">{selectedIndex.prevClose}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[12px] text-gray-500 font-medium mb-1">High</p>
                    <p className="font-bold text-gray-900">{selectedIndex.high}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[12px] text-gray-500 font-medium mb-1">Low</p>
                    <p className="font-bold text-gray-900">{selectedIndex.low}</p>
                  </div>
                </div>
              </div>

              {/* Top Constituents */}
              <div>
                <h4 className="font-bold text-gray-900 items-center justify-between flex mb-3 text-[15px]">
                   Top Weightage Constituents
                </h4>
                <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
                  {selectedIndex.constituents.map((stock, i) => (
                    <div key={i} className="bg-white p-3.5 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <div>
                        <h5 className="font-bold text-gray-900 text-[14px]">{stock.name}</h5>
                        <p className="text-[12px] text-gray-500 font-medium mt-0.5">Weight: {stock.weight}</p>
                      </div>
                      <div className={`text-right font-bold text-[14px] ${stock.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                        {stock.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
