import { ChevronDown, Bell, Search } from "lucide-react";
import { useState } from "react";

// Category Icons
const StocksIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2V17zm4 0h-2V7h2V17zm4 0h-2v-4h2V17z"/></svg>;
const IPOIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>;
const MutualFundsIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>;
const ETFIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2zm4 4h2v16h-2z"/></svg>;
const IndicesIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.04-2.71c-.2-.28-.57-.42-.9-.35-.33.05-.6.31-.66.63l-1.17 6.3h11.01L15.5 6.5c-.05-.32-.31-.58-.64-.63-.33-.07-.7.07-.9.35z"/></svg>;
const GlobalFuturesIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>;

const CategoryCard = ({ icon: Icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center gap-2 p-3">
    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-primary">
      {Icon}
    </div>
    <p className="text-xs font-medium text-center text-gray-800">{label}</p>
  </div>
);

const NewsCard = ({ date, title, description }: { date: string; title: string; description: string }) => (
  <div className="bg-white p-4 border-b border-gray-100">
    <p className="text-xs text-gray-500 mb-2">{date}</p>
    <h4 className="text-sm font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const ResultCard = ({ symbol, change, title, description }: { symbol: string; change: string; title: string; description: string }) => (
  <div className="bg-white p-4 border-b border-gray-100">
    <div className="flex justify-between items-start mb-2">
      <div>
        <p className="text-sm font-bold text-gray-900">{symbol}</p>
        <p className={`text-xs font-semibold ${change.includes('-') ? 'text-red-600' : 'text-green-600'}`}>{change}</p>
      </div>
    </div>
    <h4 className="text-sm font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const allIndices = [
  { id: 'nifty50', name: 'NIFTY 50', value: '22,819.60', change: '-486.85', changePercent: '2.09', isNegative: true },
  { id: 'niftybank', name: 'NIFTY BANK', value: '52,274.60', change: '-1,433.50', changePercent: '2.67', isNegative: true },
  { id: 'sensex', name: 'SENSEX', value: '73,583.22', change: '-1,690.23', changePercent: '2.25', isNegative: true },
  { id: 'bankex', name: 'BANKEX', value: '48,762.15', change: '+425.50', changePercent: '0.88', isNegative: false },
  { id: 'niftyit', name: 'NIFTY IT', value: '42,105.30', change: '-852.40', changePercent: '1.98', isNegative: true },
  { id: 'niftypharm', name: 'NIFTY PHARMA', value: '18,456.75', change: '+267.80', changePercent: '1.47', isNegative: false },
  { id: 'niftyinfra', name: 'NIFTY INFRA', value: '8,942.50', change: '-123.45', changePercent: '1.36', isNegative: true },
  { id: 'niftyenergyc', name: 'NIFTY ENERGY', value: '3,205.40', change: '+89.20', changePercent: '2.86', isNegative: false },
  { id: 'niftypse', name: 'NIFTY PSE', value: '5,834.60', change: '-245.30', changePercent: '4.03', isNegative: true },
  { id: 'niftyrealty', name: 'NIFTY REALTY', value: '892.30', change: '+12.50', changePercent: '1.41', isNegative: false },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<"news" | "results">("news");
  const [selectedIndices, setSelectedIndices] = useState(['nifty50', 'niftybank', 'sensex', 'bankex']);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleIndex = (indexId: string) => {
    if (selectedIndices.includes(indexId)) {
      if (selectedIndices.length > 1) {
        setSelectedIndices(selectedIndices.filter(id => id !== indexId));
      }
    } else {
      if (selectedIndices.length < 4) {
        setSelectedIndices([...selectedIndices, indexId]);
      } else {
        setSelectedIndices([...selectedIndices.slice(1), indexId]);
      }
    }
  };

  const displayedIndices = allIndices.filter(idx => selectedIndices.includes(idx.id));

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UP</span>
            </div>
          </div>
          <div className="flex-1 mx-4">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for Indices"
                className="bg-transparent text-sm outline-none flex-1 placeholder-gray-400"
              />
            </div>
          </div>
          <button className="p-2">
            <Bell className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Market Indices with Dropdown */}
      <div className="px-4 py-4 border-b border-gray-100 relative">
        <div className="flex justify-between items-start gap-4 mb-4">
          {displayedIndices.slice(0, 2).map((idx) => (
            <div key={idx.id} className="flex-1">
              <div className="text-xs text-gray-600 mb-1">{idx.name}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">{idx.value}</span>
                <span className={`text-sm font-medium ${idx.isNegative ? 'text-red-600' : 'text-green-600'}`}>
                  {idx.isNegative ? '-' : '+'}{idx.change} ({idx.changePercent}%)
                </span>
              </div>
            </div>
          ))}
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 relative z-30"
          >
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex justify-between items-start gap-4">
          {displayedIndices.slice(2, 4).map((idx) => (
            <div key={idx.id} className="flex-1">
              <div className="text-xs text-gray-600 mb-1">{idx.name}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">{idx.value}</span>
                <span className={`text-sm font-medium ${idx.isNegative ? 'text-red-600' : 'text-green-600'}`}>
                  {idx.isNegative ? '-' : '+'}{idx.change} ({idx.changePercent}%)
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
            <div className="max-h-64 overflow-y-auto">
              {allIndices.map((idx) => (
                <button
                  key={idx.id}
                  onClick={() => toggleIndex(idx.id)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                >
                  <span className={`text-sm font-medium ${selectedIndices.includes(idx.id) ? 'text-primary' : 'text-gray-800'}`}>
                    {idx.name}
                  </span>
                  {selectedIndices.includes(idx.id) && (
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
              Selected: {selectedIndices.length}/4
            </div>
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <div className="px-4 mt-6">
        <div className="grid grid-cols-6 gap-2">
          <CategoryCard icon={<StocksIcon />} label="Stocks" />
          <CategoryCard icon={<IPOIcon />} label="IPO" />
          <CategoryCard icon={<MutualFundsIcon />} label="Mutual Funds" />
          <CategoryCard icon={<ETFIcon />} label="ETF" />
          <CategoryCard icon={<IndicesIcon />} label="Indices" />
          <CategoryCard icon={<GlobalFuturesIcon />} label="Global Futures" />
        </div>
      </div>

      {/* Tabs Section - Centered */}
      <div className="mt-6">
        <div className="flex border-b border-gray-200 px-4 justify-center">
          <button
            onClick={() => setActiveTab("news")}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === "news"
                ? "text-primary border-primary"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            News
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === "results"
                ? "text-primary border-primary"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Results
          </button>
        </div>

        {/* News Tab Content - Centered */}
        {activeTab === "news" && (
          <div className="flex justify-center">
            <div className="w-full max-w-2xl overflow-y-auto max-h-96">
              <NewsCard
                date="Mar 28, 2026"
                title="Market Rallies on Strong Banking Sector Performance"
                description="Banking stocks showed resilience today with major indices gaining momentum. HDFC Bank and ICICI Bank led the gains amid positive quarterly results from sector leaders."
              />
              <NewsCard
                date="Mar 27, 2026"
                title="RBI Maintains Interest Rates, Signals Hawkish Stance"
                description="The Reserve Bank of India kept benchmark rates unchanged but indicated a shift towards monetary tightening. This could impact market sentiment in the coming weeks as investors reassess valuations."
              />
              <NewsCard
                date="Mar 26, 2026"
                title="IT Sector Faces Global Headwinds, Stocks Decline"
                description="Information technology stocks declined 2.5% as concerns over global recession persist. Major IT service companies are reviewing their FY2027 guidance amid uncertain macro conditions."
              />
            </div>
          </div>
        )}

        {/* Results Tab Content - Centered */}
        {activeTab === "results" && (
          <div className="flex justify-center">
            <div className="w-full max-w-2xl overflow-y-auto max-h-96">
              <ResultCard
                symbol="INFY"
                change="+2.45% (↑)"
                title="Infosys Q4 Results Beat Expectations"
                description="Infosys reported strong Q4 results with revenue growth of 4.2% and margin expansion of 50 bps. The company issued optimistic guidance for FY2027 driving investor confidence."
              />
              <ResultCard
                symbol="TCS"
                change="-1.82% (↓)"
                title="TCS Misses Margin Targets in Q4"
                description="Tata Consultancy Services reported mixed Q4 results with lower-than-expected margins. The company attributed challenges to increased attrition costs and wage inflation in key markets."
              />
              <ResultCard
                symbol="RELIANCE"
                change="+3.12% (↑)"
                title="Reliance Industries Announces 50% Dividend Increase"
                description="Reliance Industries announced an exceptional dividend hike along with strong refinery margins. The downstream segment showed robust performance driving overall company profitability."
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-20">
        <button className="flex flex-col items-center gap-1 text-primary font-medium">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.04-2.71c-.2-.28-.57-.42-.9-.35-.33.05-.6.31-.66.63l-1.17 6.3h11.01L15.5 6.5c-.05-.32-.31-.58-.64-.63-.33-.07-.7.07-.9.35z"/></svg>
          <span className="text-xs">Portfolio</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-600 font-medium hover:text-primary">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
          <span className="text-xs">Strategy</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-600 font-medium hover:text-primary">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/></svg>
          <span className="text-xs">Paper Trade</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-600 font-medium hover:text-primary">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2zm4 4h2v16h-2z"/></svg>
          <span className="text-xs">Backtest</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-600 font-medium hover:text-primary">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>
          <span className="text-xs">More</span>
        </button>
      </div>
    </div>
  );
}
