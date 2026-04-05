import React, { useState } from "react";
import { ArrowLeft, TrendingUp, Target, Rocket, CheckSquare, Square, ChevronRight, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";

type ETFType = {
  id: string;
  name: string;
  short: string;
  iconBg: string;
  overview: { category: string; age: string; size: string; };
  returns: { m3: string; m6: string; y1: string; y3: string; y5: string; };
  risk: { stdDev: string; sharpe: string; beta: string; sortino: string; alpha: string; trackingError: string; };
  portfolio: {
    equity: string;
    debt: string;
  };
  details: {
    expenseRatio: string;
    exitLoad: string;
    lockIn: string;
    benchmark: string;
    minSip: string;
    horizon: string;
    managers: string[];
  };
};

const mockETFsData: Record<string, ETFType[]> = {
  "Large": [
    {
      id: "large-1",
      name: "Nippon India ETF Nifty 50 BeES",
      short: "NIFTYBEES",
      iconBg: "bg-blue-100 text-blue-700",
      overview: { category: "ETF, Large Cap", age: "20 yrs 3 m", size: "₹25,455 Cr" },
      returns: { m3: "-5.75%", m6: "-2.21%", y1: "15.8%", y3: "14.88%", y5: "12.41%" },
      risk: { stdDev: "15.75", sharpe: "0.56", beta: "1.00", sortino: "0.89", alpha: "-0.18", trackingError: "0.04%" },
      portfolio: { 
        equity: "99.92%", debt: "0.08%"
      },
      details: { expenseRatio: "0.05%", exitLoad: "0%", lockIn: "No Lockin", benchmark: "NIFTY 50", minSip: "NA", horizon: "Good for long term", managers: ["Aman Sharma"] },
    },
    {
      id: "large-2",
      name: "SBI Nifty 50 ETF",
      short: "SETFNIF50",
      iconBg: "bg-indigo-100 text-indigo-700",
      overview: { category: "ETF, Large Cap", age: "8 yrs 9 m", size: "₹1,50,186 Cr" },
      returns: { m3: "-5.84%", m6: "-2.35%", y1: "15.71%", y3: "14.78%", y5: "12.36%" },
      risk: { stdDev: "15.79", sharpe: "0.53", beta: "1.00", sortino: "0.82", alpha: "-0.22", trackingError: "0.05%" },
      portfolio: { 
        equity: "99.88%", debt: "0.12%"
      },
      details: { expenseRatio: "0.07%", exitLoad: "0%", lockIn: "No Lockin", benchmark: "NIFTY 50", minSip: "NA", horizon: "Good for long term", managers: ["Raviprakash Sharma"] },
    },
    {
      id: "large-3",
      name: "Kotak Nifty 50 ETF",
      short: "KOTAKNIFTY",
      iconBg: "bg-green-100 text-green-700",
      overview: { category: "ETF, Large Cap", age: "11 yrs 10 m", size: "₹3,253 Cr" },
      returns: { m3: "-5.78%", m6: "-2.27%", y1: "15.76%", y3: "14.84%", y5: "12.38%" },
      risk: { stdDev: "15.75", sharpe: "0.61", beta: "1.00", sortino: "0.92", alpha: "-0.15", trackingError: "0.03%" },
      portfolio: { 
        equity: "99.95%", debt: "0.05%"
      },
      details: { expenseRatio: "0.10%", exitLoad: "0%", lockIn: "No Lockin", benchmark: "NIFTY 50", minSip: "NA", horizon: "Good for long term", managers: ["Nilesh Shah"] },
    }
  ]
};

// Fallback generator for other categories copying Large data but modifying names
const getMockData = (category: string) => {
  if (mockETFsData[category]) return mockETFsData[category];
  return mockETFsData["Large"].map(f => ({
    ...f,
    id: `${category.toLowerCase()}-${f.id}`,
    name: f.name.replace("Nifty 50", `Nifty ${category}cap`),
    short: f.short.replace("NIFTY", category.toUpperCase()),
    overview: { ...f.overview, category: `ETF, ${category} Cap` }
  }));
};

const sections = [
  {
    title: "ETF OVERVIEW",
    keys: [
      { label: "Category, Sub-Category", path: ["overview", "category"] },
      { label: "ETF Age", path: ["overview", "age"] },
      { label: "ETF AUM Size", path: ["overview", "size"] }
    ]
  },
  {
    title: "RETURN",
    keys: [
      { label: "3 months", path: ["returns", "m3"] },
      { label: "6 months", path: ["returns", "m6"] },
      { label: "1 year", path: ["returns", "y1"] },
      { label: "3 year", path: ["returns", "y3"] },
      { label: "5 year", path: ["returns", "y5"] },
    ]
  },
  {
    title: "RISK MEASURES",
    keys: [
      { label: "Tracking Error", path: ["risk", "trackingError"] },
      { label: "Standard Deviation", path: ["risk", "stdDev"] },
      { label: "Sharpe", path: ["risk", "sharpe"] },
      { label: "Beta", path: ["risk", "beta"] },
      { label: "Sortino", path: ["risk", "sortino"] },
      { label: "Alpha", path: ["risk", "alpha"] }
    ]
  },
  {
    title: "PORTFOLIO",
    keys: [
      { label: "Equity%", path: ["portfolio", "equity"] },
      { label: "Debt%", path: ["portfolio", "debt"] }
    ]
  },
  {
    title: "ETF DETAILS",
    keys: [
      { label: "Expense Ratio", path: ["details", "expenseRatio"] },
      { label: "Exit Load", path: ["details", "exitLoad"] },
      { label: "Lock-in", path: ["details", "lockIn"] },
      { label: "Benchmark Index", path: ["details", "benchmark"] },
      { label: "Min. Investment", path: ["details", "minSip"] },
      { label: "Investment Horizon", path: ["details", "horizon"] },
      { label: "Managed By", path: ["details", "managers"] },
    ]
  }
];

const categories = [
  { id: "Large", name: "Large Cap", desc: "Top 100 companies tracking major indices.", icon: TrendingUp, color: "bg-green-50 text-green-600 border-green-100" },
  { id: "Mid", name: "Mid Cap", desc: "Emerging companies ETF trackers.", icon: Target, color: "bg-purple-50 text-purple-600 border-purple-100" },
  { id: "Small", name: "Small Cap", desc: "Small cap enterprise ETF trackers.", icon: Rocket, color: "bg-orange-50 text-orange-600 border-orange-100" },
];

export default function ETF() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "comparison">("list");
  const [selectedETFIds, setSelectedETFIds] = useState<string[]>([]);
  const [showTopPerforming, setShowTopPerforming] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ age: "All", size: "All", returns: "All" });

  const renderValue = (obj: any, path: string[]) => {
    const val = path.reduce((acc, part) => (acc ? acc[part] : null), obj);
    if (Array.isArray(val)) {
      return (
        <div className="space-y-1">
          {val.map((item, idx) => (
            <div key={idx} className="leading-tight text-[13px]">{item}</div>
          ))}
        </div>
      );
    }
    return val || "NA";
  };

  const getRawValue = (obj: any, path: string[]) => {
    return path.reduce((acc, part) => (acc ? acc[part] : "-"), obj);
  };

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setViewMode("list");
    setSelectedETFIds([]);
    setShowTopPerforming(false);
    setFilters({ age: "All", size: "All", returns: "All" });
  }

  const handleBack = () => {
    if (viewMode === "comparison") {
      setViewMode("list");
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  let currentETFs = selectedCategory ? getMockData(selectedCategory) : [];

  if (filters.age !== "All") {
    currentETFs = currentETFs.filter(f => parseInt(f.overview.age) >= (filters.age === "> 5 Years" ? 5 : 10));
  }
  if (filters.size !== "All") {
    currentETFs = currentETFs.filter(f => parseInt(f.overview.size.replace(/[^0-9]/g, ''), 10) >= (filters.size === "> 5000 Cr" ? 5000 : 10000));
  }
  if (filters.returns !== "All") {
    currentETFs = currentETFs.filter(f => parseFloat(f.returns.y3) >= (filters.returns === "> 15%" ? 15 : 20));
  }

  if (showTopPerforming) {
    currentETFs = [...currentETFs].sort((a, b) => {
      const aRet = parseFloat(a.returns.y3.replace('%', ''));
      const bRet = parseFloat(b.returns.y3.replace('%', ''));
      return bRet - aRet;
    });
  }

  const comparingETFs = currentETFs.filter(f => selectedETFIds.includes(f.id));

  const toggleETF = (id: string) => {
    if (selectedETFIds.includes(id)) {
      setSelectedETFIds(selectedETFIds.filter(fId => fId !== id));
    } else {
      if (selectedETFIds.length < 4) {
        setSelectedETFIds([...selectedETFIds, id]);
      }
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden max-w-md mx-auto relative shadow-2xl">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 flex items-center px-4 py-3 flex-shrink-0 relative z-10 shadow-sm">
        {selectedCategory ? (
          <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
        ) : (
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </Link>
        )}
        <div className="ml-2">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            {selectedCategory && viewMode === "comparison" 
              ? (comparingETFs.length === 1 ? comparingETFs[0].name : "Comparing ETFs")
              : selectedCategory 
                ? `${selectedCategory} Cap ETFs` 
                : "Exchange Traded Funds"}
          </h1>
          <p className="text-[13px] text-gray-500">
            {selectedCategory && viewMode === "comparison"
              ? (comparingETFs.length === 1 ? "ETF Details" : `${comparingETFs.length} ETFs side-by-side`)
              : selectedCategory
                ? "Select up to 4 ETFs to compare"
                : "Low cost market tracking funds"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white relative">
        {!selectedCategory && (
          <div className="p-4 space-y-4 pb-10">
            <h2 className="text-[15px] font-bold text-gray-800 uppercase tracking-wider mb-2 mt-2 px-1">
              Select ETF Category
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className={`p-4 rounded-2xl shrink-0 ${cat.color} group-hover:scale-105 transition-transform`}>
                    <cat.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{cat.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{cat.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedCategory && viewMode === "list" && (
          <div className="p-4 space-y-4 pb-24">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[15px] font-bold text-gray-800 uppercase tracking-wider px-1">
                Available ETFs <span className="text-gray-400 text-xs ml-1 font-semibold">({currentETFs.length})</span>
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${(filters.age !== "All" || filters.size !== "All" || filters.returns !== "All") ? 'bg-violet-600 text-white border border-violet-600' : 'bg-white border border-gray-200 text-gray-600'}`}
                >
                  <Filter className="w-3.5 h-3.5 inline mr-1" />
                  Filter
                </button>
                <button 
                  onClick={() => setShowTopPerforming(!showTopPerforming)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${showTopPerforming ? 'bg-violet-600 text-white border border-violet-600' : 'bg-white border border-gray-200 text-gray-600'}`}
                >
                  Top (3Y)
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {currentETFs.map(etf => (
                 <div 
                   key={etf.id} 
                   onClick={() => { setSelectedETFIds([etf.id]); setViewMode("comparison"); }} 
                   className={`bg-white border rounded-2xl p-4 flex items-center gap-4 transition-all cursor-pointer ${
                     selectedETFIds.includes(etf.id) ? 'border-violet-600 bg-violet-50/30' : 'border-gray-200 hover:border-gray-300'
                   }`}
                 >
                   <div 
                     onClick={(e) => { e.stopPropagation(); toggleETF(etf.id); }}
                     className={`p-2 -ml-2 ${selectedETFIds.includes(etf.id) ? "text-violet-600" : "text-gray-300"}`}
                   >
                     {selectedETFIds.includes(etf.id) ? <CheckSquare className="w-6 h-6"/> : <Square className="w-6 h-6"/>}
                   </div>
                   <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${etf.iconBg}`}>
                     {etf.short[0]}
                   </div>
                   <div className="flex-1 min-w-0">
                     <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-0.5 truncate">{etf.name}</h3>
                     <div className="flex items-center gap-2">
                       <p className="text-xs text-gray-500 truncate font-medium">{etf.overview.category}</p>
                       <span className="text-[10px] text-violet-600 font-bold bg-violet-50 px-1.5 py-0.5 rounded-sm whitespace-nowrap hidden sm:inline-block">View details ›</span>
                     </div>
                   </div>
                   <div className="text-right shrink-0">
                     <p className="text-[11px] font-medium text-gray-400 mb-0.5">3Y Return</p>
                     <p className="font-bold text-violet-600">{etf.returns.y3}</p>
                   </div>
                 </div>
              ))}
            </div>

            {selectedETFIds.length >= 2 && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pt-4 pb-6">
                <button 
                  onClick={() => setViewMode("comparison")}
                  className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold text-[15px] flex justify-between px-6 items-center transition-transform active:scale-[0.99] shadow-[0_4px_10px_rgba(124,58,237,0.3)] hover:bg-violet-700"
                >
                  <span>Compare {selectedETFIds.length} ETF{selectedETFIds.length > 1 ? 's' : ''}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {selectedCategory && viewMode === "comparison" && (
          <div className="relative pb-10 flex flex-col h-full">
            <div className="w-full overflow-x-auto flex-1 pb-4">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-white z-20 min-w-[150px] p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-r align-bottom shadow-[4px_0_12px_rgba(0,0,0,0.03)]">
                      {comparingETFs.length === 1 ? "ETF Details" : <>Comparing<br/>{comparingETFs.length} ETFs</>}
                    </th>
                    {comparingETFs.map((etf) => (
                      <th key={etf.id} className="min-w-[200px] p-5 bg-white border-b border-r align-top relative">
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center font-bold text-xl ${etf.iconBg}`}>
                            {etf.short[0]}
                          </div>
                          <h3 className="font-bold text-gray-900 text-[15px] leading-snug h-12 mb-2 line-clamp-2">{etf.name}</h3>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sections.map((sec, secIndex) => (
                    <React.Fragment key={sec.title}>
                      <tr>
                        <td className="sticky left-0 z-20 bg-[#F9FAFB] p-4 text-xs font-bold text-gray-500 border-b border-r border-t shadow-[4px_0_12px_rgba(0,0,0,0.03)] uppercase tracking-wider">
                          {sec.title}
                        </td>
                        {comparingETFs.map((etf) => (
                          <td key={`${etf.id}-sec-${secIndex}`} className="bg-[#F9FAFB] border-b border-r border-t p-3"></td>
                        ))}
                      </tr>
                      {sec.keys.map((k) => (
                        <tr key={k.label} className="hover:bg-gray-50/50 transition-colors">
                          <td className="sticky left-0 z-20 bg-white p-4 text-[13px] font-medium text-gray-500 border-b border-r shadow-[4px_0_12px_rgba(0,0,0,0.03)] align-top w-[150px]">
                            {k.label}
                          </td>
                          {comparingETFs.map((etf) => {
                            const rawVal = getRawValue(etf, k.path);
                            const renderedVal = renderValue(etf, k.path);
                            const isNegative = typeof rawVal === 'string' && rawVal.startsWith('-');
                            const isPositive = typeof rawVal === 'string' && rawVal.endsWith('%') && !isNegative && k.path[0] === 'returns';
                            
                            return (
                              <td key={`${etf.id}-${k.label}`} className="p-4 text-[14px] text-gray-800 border-b border-r align-top leading-relaxed">
                                <span className={isPositive ? "text-green-600 font-bold" : isNegative ? "text-red-600 font-bold" : ""}>
                                  {renderedVal}
                                </span>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            
          </div>
        )}
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 pb-10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Filter ETFs</h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2.5 text-[15px]">ETF Age</h4>
                <div className="flex gap-2 flex-wrap">
                   {["All", "> 5 Years", "> 10 Years"].map(opt => (
                     <button key={opt} onClick={() => setFilters({...filters, age: opt})} className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${filters.age === opt ? 'bg-violet-100 text-violet-700 border border-violet-200 shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{opt}</button>
                   ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2.5 text-[15px]">ETF Size</h4>
                <div className="flex gap-2 flex-wrap">
                   {["All", "> 5000 Cr", "> 10000 Cr"].map(opt => (
                     <button key={opt} onClick={() => setFilters({...filters, size: opt})} className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${filters.size === opt ? 'bg-violet-100 text-violet-700 border border-violet-200 shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{opt}</button>
                   ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2.5 text-[15px]">3Y Return Scale</h4>
                <div className="flex gap-2 flex-wrap">
                   {["All", "> 15%", "> 20%"].map(opt => (
                     <button key={opt} onClick={() => setFilters({...filters, returns: opt})} className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${filters.returns === opt ? 'bg-violet-100 text-violet-700 border border-violet-200 shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{opt}</button>
                   ))}
                </div>
              </div>
            </div>
            
            <button onClick={() => setIsFilterOpen(false)} className="w-full mt-8 py-3.5 bg-violet-600 text-white rounded-xl font-bold text-[15px] shadow-sm hover:bg-violet-700 transition-colors flex justify-center items-center gap-1">
               Show {currentETFs.length} Result{currentETFs.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
