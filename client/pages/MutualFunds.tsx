import React, { useState } from "react";
import { ArrowLeft, Briefcase, TrendingUp, Target, Rocket, CheckSquare, Square, ChevronRight, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";

type Fund = {
  id: string;
  name: string;
  short: string;
  iconBg: string;
  overview: { category: string; age: string; size: string; };
  returns: { m3: string; m6: string; y1: string; y3: string; y5: string; };
  risk: { stdDev: string; sharpe: string; beta: string; sortino: string; alpha: string; };
  portfolio: {
    topSectors: string[];
    topHoldings: string[];
    equity: string;
    debt: string;
    turnoverRatio: string;
    ytm: string;
    modDuration: string;
    avgMaturity: string;
    avgCreditQuality: string;
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

const mockFundsData: Record<string, Fund[]> = {
  "Flexi": [
    {
      id: "flexi-1",
      name: "HDFC Flexi Cap Fund",
      short: "HDFC",
      iconBg: "bg-blue-100 text-blue-700",
      overview: { category: "Equity, Flexi Cap", age: "31 yrs 3 m", size: "₹1,00,455 Cr" },
      returns: { m3: "-11.75%", m6: "-9.21%", y1: "4.8%", y3: "17.88%", y5: "18.41%" },
      risk: { stdDev: "12.75", sharpe: "0.86", beta: "0.84", sortino: "0.99", alpha: "4.88" },
      portfolio: { 
        topSectors: ["Financial (34.16%)", "Automobile (11.95%)", "Healthcare (8.24%)"],
        topHoldings: ["ICICI Bank Ltd. (8.78%)", "Axis Bank Ltd. (7.44%)", "HDFC Bank Ltd. (7.25%)", "State Bank of India (5.26%)", "SBI Life Insurance Company Ltd. (4.06%)"],
        equity: "90.92%", debt: "0.51%", turnoverRatio: "NA", ytm: "NA", modDuration: "NA", avgMaturity: "NA", avgCreditQuality: "NA"
      },
      details: { expenseRatio: "1.35%", exitLoad: "1%", lockIn: "No Lockin", benchmark: "NIFTY 500 TRI", minSip: "SIP ₹3000 & Lumpsum ₹5000", horizon: "Good for medium term", managers: ["Amit Ganatra"] },
    },
    {
      id: "flexi-2",
      name: "Bank of India Flexi Cap",
      short: "BOI",
      iconBg: "bg-indigo-100 text-indigo-700",
      overview: { category: "Equity, Flexi Cap", age: "5 yrs 9 m", size: "₹2,186 Cr" },
      returns: { m3: "-9.14%", m6: "-7.75%", y1: "11.11%", y3: "19.38%", y5: "17.06%" },
      risk: { stdDev: "17.79", sharpe: "0.73", beta: "1.08", sortino: "1.02", alpha: "5.12" },
      portfolio: { 
        topSectors: ["Financial (21.93%)", "Capital Goods (10%)", "Consumer Staples (8.01%)"],
        topHoldings: ["State Bank of India (4.79%)", "ICICI Bank Ltd. (4.44%)", "HDFC Bank Ltd. (3.15%)", "Bharti Airtel Ltd. (3.11%)", "Hindustan Aeronautics Ltd. (3.04%)"],
        equity: "74.88%", debt: "5.03%", turnoverRatio: "NA", ytm: "NA", modDuration: "NA", avgMaturity: "NA", avgCreditQuality: "NA"
      },
      details: { expenseRatio: "1.98%", exitLoad: "1%", lockIn: "No Lockin", benchmark: "BSE 500 TRI", minSip: "SIP ₹3000 & Lumpsum ₹5000", horizon: "Good for medium term", managers: ["Alok Singh"] },
    },
    {
      id: "flexi-3",
      name: "Parag Parikh Flexi Cap",
      short: "PPFAS",
      iconBg: "bg-green-100 text-green-700",
      overview: { category: "Equity, Flexi Cap", age: "12 yrs 10 m", size: "₹1,34,253 Cr" },
      returns: { m3: "-9.38%", m6: "-7.27%", y1: "4.76%", y3: "16.34%", y5: "15.58%" },
      risk: { stdDev: "9.75", sharpe: "1.01", beta: "0.62", sortino: "1.32", alpha: "5.35" },
      portfolio: { 
        topSectors: ["Financial (25.58%)", "Services (9.68%)", "Technology (8.86%)"],
        topHoldings: ["HDFC Bank Ltd. (7.73%)", "Power Grid Corporation Of India Ltd. (6.12%)", "Coal India Ltd. (5.18%)", "ITC Ltd. (5.04%)", "Bajaj Holdings & Investment Ltd. (4.85%)"],
        equity: "76.47%", debt: "14.51%", turnoverRatio: "NA", ytm: "NA", modDuration: "NA", avgMaturity: "NA", avgCreditQuality: "NA"
      },
      details: { expenseRatio: "1.27%", exitLoad: "2%", lockIn: "No Lockin", benchmark: "NIFTY 500 TRI", minSip: "SIP ₹3000 & Lumpsum ₹5000", horizon: "Good for medium term", managers: ["Raj Mehta", "Rajeev Thakkar", "Rukun Tarachandani", "Mansi Kariya", "Tejas Soman", "Aishwarya Dhar"] },
    }
  ]
};

// Fallback generator for other categories copying Flexi data but modifying names
const getMockData = (category: string) => {
  if (mockFundsData[category]) return mockFundsData[category];
  return mockFundsData["Flexi"].map(f => ({
    ...f,
    id: `${category.toLowerCase()}-${f.id}`,
    name: f.name.replace("Flexi Cap Fund", `${category} Cap Fund`).replace("Flexi Cap", `${category} Cap`),
    overview: { ...f.overview, category: `Equity, ${category} Cap` }
  }));
};

const sections = [
  {
    title: "FUND OVERVIEW",
    keys: [
      { label: "Category, Sub-Category", path: ["overview", "category"] },
      { label: "Fund Age", path: ["overview", "age"] },
      { label: "Fund Size", path: ["overview", "size"] }
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
      { label: "Top 3 sectors", path: ["portfolio", "topSectors"] },
      { label: "Top 5 holdings", path: ["portfolio", "topHoldings"] },
      { label: "Equity%", path: ["portfolio", "equity"] },
      { label: "Debt%", path: ["portfolio", "debt"] }
    ]
  },
  {
    title: "FUND DETAILS",
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
  { id: "Flexi", name: "Flexi Cap", desc: "Invest across large, mid & small cap stocks flexibly.", icon: Briefcase, color: "bg-blue-50 text-blue-600 border-blue-100" },
  { id: "Large", name: "Large Cap", desc: "Top 100 companies. Lower risk, steady returns.", icon: TrendingUp, color: "bg-green-50 text-green-600 border-green-100" },
  { id: "Mid", name: "Mid Cap", desc: "Emerging companies with high growth potential.", icon: Target, color: "bg-purple-50 text-purple-600 border-purple-100" },
  { id: "Small", name: "Small Cap", desc: "Smaller companies with highest growth & risk.", icon: Rocket, color: "bg-orange-50 text-orange-600 border-orange-100" },
];

export default function MutualFunds() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "comparison">("list");
  const [selectedFundIds, setSelectedFundIds] = useState<string[]>([]);
  const [showTopPerforming, setShowTopPerforming] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ age: "All", size: "All", returns: "All" });

  // Custom getter to render arrays cleanly
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
    setSelectedFundIds([]);
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

  let currentFunds = selectedCategory ? getMockData(selectedCategory) : [];

  if (filters.age !== "All") {
    currentFunds = currentFunds.filter(f => parseInt(f.overview.age) >= (filters.age === "> 5 Years" ? 5 : 10));
  }
  if (filters.size !== "All") {
    currentFunds = currentFunds.filter(f => parseInt(f.overview.size.replace(/[^0-9]/g, ''), 10) >= (filters.size === "> 5000 Cr" ? 5000 : 10000));
  }
  if (filters.returns !== "All") {
    currentFunds = currentFunds.filter(f => parseFloat(f.returns.y3) >= (filters.returns === "> 15%" ? 15 : 20));
  }

  if (showTopPerforming) {
    currentFunds = [...currentFunds].sort((a, b) => {
      const aRet = parseFloat(a.returns.y3.replace('%', ''));
      const bRet = parseFloat(b.returns.y3.replace('%', ''));
      return bRet - aRet;
    });
  }

  const comparingFunds = currentFunds.filter(f => selectedFundIds.includes(f.id));

  const toggleFund = (id: string) => {
    if (selectedFundIds.includes(id)) {
      setSelectedFundIds(selectedFundIds.filter(fId => fId !== id));
    } else {
      if (selectedFundIds.length < 4) {
        setSelectedFundIds([...selectedFundIds, id]);
      }
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden max-w-md mx-auto relative shadow-2xl">
      {/* Header */}
      <div className="bg-violet-600 border-b border-violet-700 flex items-center px-4 py-3 flex-shrink-0 relative z-10">
        {selectedCategory ? (
          <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-violet-700 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
        ) : (
          <Link to="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-violet-700 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
        )}
        <div className="ml-2">
          <h1 className="text-xl font-bold text-white leading-tight">
            {selectedCategory && viewMode === "comparison" 
              ? (comparingFunds.length === 1 ? comparingFunds[0].name : "Comparing Funds")
              : selectedCategory 
                ? `${selectedCategory} Cap Funds` 
                : "Mutual Funds"}
          </h1>
          <p className="text-[13px] text-violet-200">
            {selectedCategory && viewMode === "comparison"
              ? (comparingFunds.length === 1 ? "Fund Details" : `${comparingFunds.length} funds side-by-side`)
              : selectedCategory
                ? "Select up to 4 funds to compare"
                : "Explore wealth creation options"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white relative">
        {!selectedCategory && (
          <div className="p-4 space-y-4 pb-10">
            <h2 className="text-[15px] font-bold text-gray-800 uppercase tracking-wider mb-2 mt-2 px-1">
              Select Fund Category
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
                Available Funds <span className="text-gray-400 text-xs ml-1 font-semibold">({currentFunds.length})</span>
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
              {currentFunds.map(fund => (
                 <div 
                   key={fund.id} 
                   onClick={() => { setSelectedFundIds([fund.id]); setViewMode("comparison"); }} 
                   className={`bg-white border rounded-2xl p-4 flex items-center gap-4 transition-all cursor-pointer ${
                     selectedFundIds.includes(fund.id) ? 'border-violet-600 bg-green-50/30' : 'border-gray-200 hover:border-gray-300'
                   }`}
                 >
                   <div 
                     onClick={(e) => { e.stopPropagation(); toggleFund(fund.id); }}
                     className={`p-2 -ml-2 ${selectedFundIds.includes(fund.id) ? "text-violet-600" : "text-gray-300"}`}
                   >
                     {selectedFundIds.includes(fund.id) ? <CheckSquare className="w-6 h-6"/> : <Square className="w-6 h-6"/>}
                   </div>
                   <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${fund.iconBg}`}>
                     {fund.short[0]}
                   </div>
                   <div className="flex-1 min-w-0">
                     <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-0.5 truncate">{fund.name}</h3>
                     <div className="flex items-center gap-2">
                       <p className="text-xs text-gray-500 truncate font-medium">{fund.overview.category}</p>
                       <span className="text-[10px] text-violet-600 font-bold bg-violet-50 px-1.5 py-0.5 rounded-sm whitespace-nowrap hidden sm:inline-block">View details ›</span>
                     </div>
                   </div>
                   <div className="text-right shrink-0">
                     <p className="text-[11px] font-medium text-gray-400 mb-0.5">3Y Return</p>
                     <p className="font-bold text-violet-600">{fund.returns.y3}</p>
                   </div>
                 </div>
              ))}
            </div>

            {selectedFundIds.length >= 2 && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pt-4 pb-6">
                <button 
                  onClick={() => setViewMode("comparison")}
                  className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold text-[15px] flex justify-between px-6 items-center transition-transform active:scale-[0.99] shadow-[0_4px_10px_rgba(124,58,237,0.3)] hover:bg-violet-700"
                >
                  <span>Compare {selectedFundIds.length} Fund{selectedFundIds.length > 1 ? 's' : ''}</span>
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
                      {comparingFunds.length === 1 ? "Fund Details" : <>Comparing<br/>{comparingFunds.length} funds</>}
                    </th>
                    {comparingFunds.map((fund) => (
                      <th key={fund.id} className="min-w-[200px] p-5 bg-white border-b border-r align-top relative">
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center font-bold text-xl ${fund.iconBg}`}>
                            {fund.short[0]}
                          </div>
                          <h3 className="font-bold text-gray-900 text-[15px] leading-snug h-12 mb-2 line-clamp-2">{fund.name}</h3>
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
                        {comparingFunds.map((fund) => (
                          <td key={`${fund.id}-sec-${secIndex}`} className="bg-[#F9FAFB] border-b border-r border-t p-3"></td>
                        ))}
                      </tr>
                      {sec.keys.map((k) => (
                        <tr key={k.label} className="hover:bg-gray-50/50 transition-colors">
                          <td className="sticky left-0 z-20 bg-white p-4 text-[13px] font-medium text-gray-500 border-b border-r shadow-[4px_0_12px_rgba(0,0,0,0.03)] align-top w-[150px]">
                            {k.label}
                          </td>
                          {comparingFunds.map((fund) => {
                            const rawVal = getRawValue(fund, k.path);
                            const renderedVal = renderValue(fund, k.path);
                            // Highlight negative or positive returns
                            const isNegative = typeof rawVal === 'string' && rawVal.startsWith('-');
                            const isPositive = typeof rawVal === 'string' && rawVal.endsWith('%') && !isNegative && k.path[0] === 'returns';
                            
                            return (
                              <td key={`${fund.id}-${k.label}`} className="p-4 text-[14px] text-gray-800 border-b border-r align-top leading-relaxed">
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
              <h3 className="text-xl font-bold text-gray-900">Filter Funds</h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2.5 text-[15px]">Fund Age</h4>
                <div className="flex gap-2 flex-wrap">
                   {["All", "> 5 Years", "> 10 Years"].map(opt => (
                     <button key={opt} onClick={() => setFilters({...filters, age: opt})} className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${filters.age === opt ? 'bg-violet-100 text-violet-700 border border-violet-200 shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{opt}</button>
                   ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2.5 text-[15px]">Fund Size</h4>
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
               Show {currentFunds.length} Result{currentFunds.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
