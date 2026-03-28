import { ChevronDown, Bell, Search, ChevronRight } from "lucide-react";
import { useState } from "react";

// Icons for categories
const UpArrow = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4" /></svg>;
const BarChart = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="13" width="2" height="8"/><rect x="7" y="9" width="2" height="12"/><rect x="11" y="6" width="2" height="15"/><rect x="15" y="3" width="2" height="18"/><rect x="19" y="5" width="2" height="16"/></svg>;
const PieChart = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" opacity="0.3"/><path d="M12 3a9 9 0 0 1 8.485 13.286" opacity="0.7"/></svg>;
const Hat = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 8v2h20V8l-10-6zm0 6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/></svg>;
const Apple = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="15" cy="10" r="2"/><path d="M9 18c0 0-2-2-2-6s4-9 6-9c2 0 4 3 4 9 0 4-2 6-2 6H9z"/></svg>;

const CategoryCard = ({ icon: Icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center gap-2 p-3">
    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-primary">
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

export default function Index() {
  const [activeTab, setActiveTab] = useState<"news" | "results">("news");

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
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

      {/* Market Indices - Extended to 4 items */}
      <div className="px-4 py-4 border-b border-gray-100 space-y-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-600 mb-1">NIFTY 50</div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">22,819.60</span>
              <span className="text-sm text-red-600 font-medium">-486.85 (2.09%)</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-600 mb-1">NIFTY BANK</div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">52,274.60</span>
              <span className="text-sm text-red-600 font-medium">-1,433.50 (2.67%)</span>
            </div>
          </div>
          <button className="p-2">
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-600 mb-1">SENSEX</div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">73,583.22</span>
              <span className="text-sm text-red-600 font-medium">-1,690.23 (2.25%)</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-600 mb-1">BANKEX</div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">48,762.15</span>
              <span className="text-sm text-green-600 font-medium">+425.50 (0.88%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid - First Row Only */}
      <div className="px-4 mt-6">
        <div className="grid grid-cols-5 gap-2">
          <CategoryCard icon={<UpArrow />} label="Options" />
          <CategoryCard icon={<BarChart />} label="Stocks" />
          <CategoryCard icon={<PieChart />} label="MF" />
          <CategoryCard icon={<Hat />} label="IPO" />
          <CategoryCard icon={<Apple />} label="Commodity" />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-6">
        <div className="flex border-b border-gray-200 px-4">
          <button
            onClick={() => setActiveTab("news")}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === "news"
                ? "text-primary border-primary"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            News
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === "results"
                ? "text-primary border-primary"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Results
          </button>
        </div>

        {/* News Tab Content */}
        {activeTab === "news" && (
          <div className="overflow-y-auto max-h-96">
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
        )}

        {/* Results Tab Content */}
        {activeTab === "results" && (
          <div className="overflow-y-auto max-h-96">
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
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-20">
        <button className="flex flex-col items-center gap-1 text-primary font-medium">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.04-2.71c-.2-.28-.57-.42-.9-.35-.33.05-.6.31-.66.63l-1.17 6.3h11.01L15.5 6.5c-.05-.32-.31-.58-.64-.63-.33-.07-.7.07-.9.35z"/></svg>
          <span className="text-xs">Portfolio</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-600 font-medium hover:text-primary">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
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
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
          <span className="text-xs">More</span>
        </button>
      </div>
    </div>
  );
}
