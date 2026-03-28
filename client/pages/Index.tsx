import { ChevronDown, Bell, Search, ChevronRight } from "lucide-react";

// Icons for categories
const UpArrow = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4" /></svg>;
const BarChart = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="13" width="2" height="8"/><rect x="7" y="9" width="2" height="12"/><rect x="11" y="6" width="2" height="15"/><rect x="15" y="3" width="2" height="18"/><rect x="19" y="5" width="2" height="16"/></svg>;
const PieChart = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" opacity="0.3"/><path d="M12 3a9 9 0 0 1 8.485 13.286" opacity="0.7"/></svg>;
const Hat = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 8v2h20V8l-10-6zm0 6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/></svg>;
const Apple = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="15" cy="10" r="2"/><path d="M9 18c0 0-2-2-2-6s4-9 6-9c2 0 4 3 4 9 0 4-2 6-2 6H9z"/></svg>;
const Bag = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 4V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4z"/></svg>;
const TrendingChart = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13v8h18V9.5" strokeWidth={2} stroke="currentColor" fill="none"/><circle cx="6" cy="11" r="1.5" fill="currentColor"/><circle cx="13" cy="6" r="1.5" fill="currentColor"/></svg>;
const Umbrella = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3v6h-3v2h3v2h2v-2h3v-2h-3V5h-2z"/></svg>;
const Star = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const Grid = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="3" height="3"/><rect x="10" y="3" width="3" height="3"/><rect x="17" y="3" width="3" height="3"/><rect x="3" y="10" width="3" height="3"/><rect x="10" y="10" width="3" height="3"/><rect x="17" y="10" width="3" height="3"/></svg>;

const CategoryCard = ({ icon: Icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center gap-2 p-3">
    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-primary">
      {Icon}
    </div>
    <p className="text-xs font-medium text-center text-gray-800">{label}</p>
  </div>
);

const ToolButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-primary transition-colors">
    <span className="text-lg">{icon}</span>
    <span className="text-sm font-medium text-gray-800">{label}</span>
  </button>
);

export default function Index() {
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

      {/* Market Indices */}
      <div className="px-4 py-4 border-b border-gray-100">
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
      </div>

      {/* Promotional Banner */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-teal-700 to-teal-600 rounded-lg p-6 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-1">Expert-backed Swing Trades</h3>
          <p className="text-sm text-teal-100 mb-3">Buy with up to 4X margin</p>
          <a href="#" className="text-cyan-300 text-sm font-semibold hover:underline flex items-center gap-1">
            View MTF Advisory <span>&gt;</span>
          </a>
        </div>
        <div className="absolute right-0 top-0 text-right pr-6 pt-4">
          <div className="text-4xl font-bold text-white opacity-90">30%</div>
          <div className="text-xs text-teal-100">UPSIDE</div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-4 mt-6">
        <div className="grid grid-cols-5 gap-2">
          <CategoryCard icon={<UpArrow />} label="Options" />
          <CategoryCard icon={<BarChart />} label="Stocks" />
          <CategoryCard icon={<PieChart />} label="MF" />
          <CategoryCard icon={<Hat />} label="IPO" />
          <CategoryCard icon={<Apple />} label="Commodity" />
          <CategoryCard icon={<Bag />} label="MTF" />
          <CategoryCard icon={<TrendingChart />} label="Futures" />
          <CategoryCard icon={<Umbrella />} label="Insurance" />
          <CategoryCard icon={<Star />} label="Advisory" />
          <CategoryCard icon={<Grid />} label="More" />
        </div>
      </div>

      {/* Tools Section */}
      <div className="px-4 mt-6 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <ToolButton icon="📊" label="Option Chain" />
          <ToolButton icon="📈" label="Chart 360" />
          <ToolButton icon="⚡" label="Scalper" />
          <ToolButton icon="📰" label="News" />
          <ToolButton icon="🌐" label="Algoverse" />
          <ToolButton icon="🔍" label="Intraday Screeners" />
          <ToolButton icon="₹" label="FII/DII" />
          <ToolButton icon="📍" label="Str..." />
        </div>
      </div>

      {/* Referral Section */}
      <div className="mx-4 mt-6 bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎁</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">Earn ₹7,500 monthly</p>
          <p className="text-xs text-gray-600">₹1,500 per referral</p>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-primary/90">
          Refer Now
        </button>
      </div>

      {/* Trending Commodities */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📈</span>
            <h3 className="font-bold text-gray-900">Trending Commodities</h3>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4">
          <button className="px-3 py-1.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 whitespace-nowrap hover:border-primary">
            Futures ▼
          </button>
          <button className="px-3 py-1.5 border-2 border-primary rounded-full text-sm font-medium text-primary whitespace-nowrap">
            Crude Oil
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 whitespace-nowrap hover:border-primary">
            Natural Gas
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 whitespace-nowrap hover:border-primary">
            Gold
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 whitespace-nowrap hover:border-primary">
            Silver
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900">CRUDEOIL FUT</p>
          </div>
          <span className="text-lg font-bold text-primary">9,402.00</span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-20">
        <button className="flex flex-col items-center gap-1 text-primary font-medium">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-600 font-medium hover:text-primary">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/></svg>
          <span className="text-xs">My lists</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-600 font-medium hover:text-primary">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-. 9-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7.17 14.75l.03-.12.9-1.63h7.05c.92 0 1.74-.57 2.08-1.4l3.85-7.01-5.32-5.32H4c-1.1 0-1.99.9-1.99 2L2 4c0 1.1.9 2 2 2h3.6l5.57 9.75z"/></svg>
          <span className="text-xs">Orders</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-600 font-medium hover:text-primary">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.04-2.71c-.2-.28-.57-.42-.9-.35-.33.05-.6.31-.66.63l-1.17 6.3h11.01L15.5 6.5c-.05-.32-.31-.58-.64-.63-.33-.07-.7.07-.9.35z"/></svg>
          <span className="text-xs">Portfolio</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-600 font-medium hover:text-primary">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4h3c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm-1 6h-3v-2h3v2z"/></svg>
          <span className="text-xs">Funds</span>
        </button>
      </div>
    </div>
  );
}
