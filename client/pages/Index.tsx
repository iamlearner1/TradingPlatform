import { ChevronDown, Bell, Search, X, Calendar, Home, User, Settings, CreditCard, HelpCircle, LogOut, Shield, TrendingUp, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Category Icons
const StocksIcon = () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2V17zm4 0h-2V7h2V17zm4 0h-2v-4h2V17z"/></svg>;
const IPOIcon = () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>;
const MutualFundsIcon = () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>;
const ETFIcon = () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2zm4 4h2v16h-2z"/></svg>;
const IndicesIcon = () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.04-2.71c-.2-.28-.57-.42-.9-.35-.33.05-.6.31-.66.63l-1.17 6.3h11.01L15.5 6.5c-.05-.32-.31-.58-.64-.63-.33-.07-.7.07-.9.35z"/></svg>;
const GlobalFuturesIcon = () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>;

const CategoryCard = ({ icon: Icon, label, to }: { icon: React.ReactNode; label: string; to: string }) => (
  <Link to={to} className="flex flex-col items-center gap-2 p-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-xl">
    <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 shadow-sm border border-violet-100/50 hover:bg-violet-100 transition-colors">
      {Icon}
    </div>
    <p className="text-[11px] font-bold text-center text-gray-800 leading-tight">{label}</p>
  </Link>
);

const NewsCard = ({ date, title, description }: { date: string; title: string; description: string }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
    <p className="text-[10px] font-bold tracking-wider uppercase text-violet-500 mb-1.5">{date}</p>
    <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-3 leading-snug">{title}</h4>
    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mt-auto">{description}</p>
  </div>
);

const ResultCard = ({ symbol, change, title, description }: { symbol: string; change: string; title: string; description: string }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
    <div className="flex justify-between items-start mb-2">
      <div>
        <p className="text-sm font-black text-gray-900">{symbol}</p>
        <p className={`text-xs font-bold mt-0.5 ${change.includes('-') ? 'text-red-500' : 'text-green-500'}`}>{change}</p>
      </div>
    </div>
    <h4 className="text-xs font-bold text-gray-800 mb-2 line-clamp-2 leading-snug">{title}</h4>
    <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mt-auto">{description}</p>
  </div>
);

const allIndices = [
  // Equity Indices
  { id: 'nifty50',    name: 'NIFTY 50',   value: '22,819.00', change: '486.00',    changePercent: '2.09', isNegative: true  },
  { id: 'niftybank',  name: 'NIFTY BANK', value: '52,274.60', change: '1,433.50',  changePercent: '2.67', isNegative: true  },
  { id: 'sensex',     name: 'SENSEX',     value: '73,583.22', change: '1,690.23',  changePercent: '2.25', isNegative: true  },
  { id: 'bankex',     name: 'BANKEX',     value: '48,762.15', change: '425.50',    changePercent: '0.88', isNegative: false },
  { id: 'niftyit',   name: 'NIFTY IT',   value: '42,105.30', change: '852.40',    changePercent: '1.98', isNegative: true  },
  { id: 'finnifty',  name: 'FINNIFTY',   value: '21,554.40', change: '120.25',    changePercent: '0.56', isNegative: false },
  // Currencies
  { id: 'inrusd',    name: 'INR / USD',  value: '84.29',     change: '0.18',      changePercent: '0.21', isNegative: true  },
  { id: 'eurusd',    name: 'EUR / USD',  value: '1.0841',    change: '0.0023',    changePercent: '0.21', isNegative: false },
  // Commodities
  { id: 'gold',      name: 'GOLD',       value: '93,450',    change: '320',       changePercent: '0.34', isNegative: false },
  { id: 'silver',    name: 'SILVER',     value: '96,800',    change: '1,120',     changePercent: '1.17', isNegative: false },
  { id: 'crudeoil',  name: 'CRUDE OIL',  value: '6,842',     change: '85',        changePercent: '1.26', isNegative: true  },
];


const newsData = [
  { id: 1, date: "Mar 28, 2026", title: "Market Rallies on Strong Banking Sector Performance", description: "Banking stocks showed resilience today with major indices gaining momentum. HDFC Bank and ICICI Bank led the gains amid positive quarterly results from sector leaders." },
  { id: 2, date: "Mar 27, 2026", title: "RBI Maintains Interest Rates, Signals Hawkish Stance", description: "The Reserve Bank of India kept benchmark rates unchanged but indicated a shift towards monetary tightening. This could impact market sentiment in the coming weeks." },
  { id: 3, date: "Mar 26, 2026", title: "IT Sector Faces Global Headwinds, Stocks Decline", description: "Information technology stocks declined 2.5% as concerns over global recession persist. Major IT service companies are reviewing their FY2027 guidance." },
  { id: 4, date: "Mar 25, 2026", title: "EV Startups See Surge in Funding Despite Market Volatility", description: "Several electric vehicle startups announced new rounds of funding, showing continued interest in the green technology sector." },
  { id: 5, date: "Mar 24, 2026", title: "Consumer Goods FMCG Growth Outpaces Estimates", description: "Fast-moving consumer goods companies reported higher-than-expected sales growth for the quarter, driven by rural demand recovery." },
  { id: 6, date: "Mar 23, 2026", title: "Oil Prices Stabilize After Recent Supply Constraints", description: "Global crude oil prices stabilized around $85 per barrel following weeks of volatility due to geopolitical tensions." },
  { id: 7, date: "Mar 22, 2026", title: "New Regulations for Mutual Funds Announced", description: "SEBI announced a new set of regulations aimed at increasing transparency in mutual fund disclosures and protecting retail investors." },
  { id: 8, date: "Mar 21, 2026", title: "Infrastructure Projects Get Fast-Track Approvals", description: "The government has set up a new committee to fast-track approvals for large-scale infrastructure projects to boost economic growth." },
];

const resultsData = [
  { id: 1, symbol: "INFY", change: "+2.45% (↑)", title: "Infosys Q4 Results Beat Expectations", description: "Infosys reported strong Q4 results with revenue growth of 4.2% and margin expansion of 50 bps." },
  { id: 2, symbol: "TCS", change: "-1.82% (↓)", title: "TCS Misses Margin Targets in Q4", description: "Tata Consultancy Services reported mixed Q4 results with lower-than-expected margins due to wage inflation." },
  { id: 3, symbol: "RELIANCE", change: "+3.12% (↑)", title: "Reliance Industries Announces 50% Dividend Increase", description: "Reliance Industries announced an exceptional dividend hike along with strong refinery margins." },
  { id: 4, symbol: "HDFCBANK", change: "+1.95% (↑)", title: "HDFC Bank Shows Robust Credit Growth", description: "HDFC Bank reported a 15% year-on-year growth in its loan book, driven by strong retail and corporate demand." },
  { id: 5, symbol: "WIPRO", change: "-0.75% (↓)", title: "Wipro Q4 Revenue Flat, Guidance Cautious", description: "Wipro reported flat revenue growth for the quarter and provided a cautious outlook for the upcoming financial year." },
  { id: 6, symbol: "ITC", change: "+1.20% (↑)", title: "ITC Cigarette Volumes Beat Estimates", description: "ITC reported a strong quarter with cigarette volumes exceeding analyst expectations, leading to a bump in stock price." },
  { id: 7, symbol: "SBIN", change: "+2.50% (↑)", title: "SBI Asset Quality Improves Further", description: "State Bank of India reported lower non-performing assets and higher profit margins for the quarter." },
  { id: 8, symbol: "BHARTIARTL", change: "+1.80% (↑)", title: "Bharti Airtel ARPU Reaches New High", description: "Bharti Airtel reported its highest ever Average Revenue Per User (ARPU) following recent tariff hikes." },
];

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"news" | "results">("news");
  const [selectedIndices, setSelectedIndices] = useState(['nifty50', 'niftybank', 'sensex', 'bankex']);
  const [showIndicesDropdown, setShowIndicesDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const indicesDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (indicesDropdownRef.current && !indicesDropdownRef.current.contains(event.target as Node)) {
        setShowIndicesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close profile on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Searchable dataset
  const searchData = [
    ...allIndices.map(i => ({ type: 'index', label: i.name, sub: `${i.value} ${i.isNegative ? '▼' : '▲'} ${i.changePercent}%`, to: `/option-chain/${i.id}` })),
    ...newsData.map(n => ({ type: 'news', label: n.title, sub: n.date, to: '/dashboard' })),
    ...resultsData.map(r => ({ type: 'result', label: `${r.symbol} — ${r.title}`, sub: r.change, to: '/dashboard' })),
    { type: 'page', label: 'Portfolio', sub: 'View your holdings', to: '/portfolio' },
    { type: 'page', label: 'Strategy Builder', sub: 'Build options strategies', to: '/strategy' },
    { type: 'page', label: 'Paper Trade', sub: 'Simulated trading', to: '/paper-trade' },
    { type: 'page', label: 'Backtest', sub: 'Simulate historical strategies', to: '/backtest' },
    { type: 'page', label: 'Results Calendar', sub: 'Upcoming earnings & events', to: '/calendar' },
    { type: 'page', label: 'Stocks', sub: 'Browse all stocks', to: '/stocks' },
    { type: 'page', label: 'IPO', sub: 'Upcoming IPOs', to: '/ipo' },
    { type: 'page', label: 'Mutual Funds', sub: 'Browse mutual funds', to: '/mutual-funds' },
    { type: 'page', label: 'ETF', sub: 'Exchange Traded Funds', to: '/etf' },
    { type: 'page', label: 'Indices', sub: 'All market indices', to: '/indices' },
  ];

  const searchResults = (() => {
    const q = searchQuery.trim();
    if (!q) return [];
    let regex: RegExp;
    try { regex = new RegExp(q, 'i'); } catch { return []; }
    return searchData.filter(item => regex.test(item.label) || regex.test(item.sub)).slice(0, 8);
  })();

  const typeColor: Record<string, string> = {
    index: 'bg-violet-100 text-violet-700',
    news: 'bg-blue-50 text-blue-600',
    result: 'bg-emerald-50 text-emerald-700',
    page: 'bg-gray-100 text-gray-600',
  };
  const typeLabel: Record<string, string> = {
    index: 'Index', news: 'News', result: 'Result', page: 'Page',
  };

  const toggleIndex = (indexId: string) => {
    if (selectedIndices.includes(indexId)) {
      // Prevent unselecting to ensure we always have 4 cards
      return;
    }
    
    // Always keep 4 items by replacing the oldest selection
    setSelectedIndices([...selectedIndices.slice(1), indexId]);
    setShowIndicesDropdown(false);
  };

  const displayedIndices = allIndices.filter(idx => selectedIndices.includes(idx.id));

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Profile Settings Overlay */}
      {showProfile && (
        <div className="fixed inset-0 z-[300] flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowProfile(false)} />
          {/* Panel */}
          <div ref={profileRef} className="relative ml-auto w-[88vw] max-w-sm h-full bg-white flex flex-col shadow-2xl animate-[slideInRight_0.2s_ease-out]">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-violet-600 to-violet-800 px-6 pt-12 pb-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-white/70 text-sm font-semibold uppercase tracking-widest">Profile</span>
                <button onClick={() => setShowProfile(false)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center">
                  <span className="text-2xl font-black text-white">SS</span>
                </div>
                <div>
                  <h2 className="text-white font-black text-lg leading-tight">Sunny Shiva</h2>
                  <p className="text-violet-200 text-sm font-medium">sunnyshiva@example.com</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider">Pro Member</span>
                  </div>
                </div>
              </div>
              {/* Stats row */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-white font-black text-base">₹2.4L</p>
                  <p className="text-violet-200 text-[10px] font-semibold">Portfolio</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-emerald-300 font-black text-base">+18.4%</p>
                  <p className="text-violet-200 text-[10px] font-semibold">Returns</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-white font-black text-base">34</p>
                  <p className="text-violet-200 text-[10px] font-semibold">Trades</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">Account</p>
                <div className="flex flex-col gap-1">
                  {[
                    { icon: User, label: 'Personal Information', sub: 'Name, email, phone' },
                    { icon: Shield, label: 'Security & Privacy', sub: '2FA, password, KYC' },
                    { icon: CreditCard, label: 'Payment Methods', sub: 'UPI, bank accounts' },
                    { icon: TrendingUp, label: 'Trading Preferences', sub: 'Risk level, defaults' },
                  ].map(({ icon: Icon, label, sub }) => (
                    <button key={label} className="flex items-center gap-4 w-full text-left px-3 py-3.5 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-violet-100 transition-colors">
                        <Icon className="w-4.5 h-4.5 text-violet-600" size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{label}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{sub}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    </button>
                  ))}
                </div>

                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1 mt-6">Support</p>
                <div className="flex flex-col gap-1">
                  {[
                    { icon: Settings, label: 'App Settings', sub: 'Notifications, theme' },
                    { icon: HelpCircle, label: 'Help & Support', sub: 'FAQs, contact us' },
                  ].map(({ icon: Icon, label, sub }) => (
                    <button key={label} className="flex items-center gap-4 w-full text-left px-3 py-3.5 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                        <Icon className="w-4.5 h-4.5 text-gray-600" size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{label}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{sub}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-gray-100">
              <button 
                onClick={() => navigate("/login")}
                className="flex items-center gap-3 w-full px-4 py-3.5 bg-red-50 hover:bg-red-100 rounded-xl transition-colors group"
              >
                <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-sm font-bold text-red-600">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 flex-shrink-0 z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProfile(true)}
              className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center active:scale-95 transition-transform hover:bg-violet-700"
            >
              <span className="text-white font-bold text-sm">UP</span>
            </button>
          </div>
          <div className="flex-1 mx-4" ref={searchRef}>
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search indices, stocks, news..."
                className="bg-transparent text-sm outline-none flex-1 placeholder-gray-400"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setSearchFocused(false); }} className="flex-shrink-0">
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
          <button className="p-2">
            <Bell className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Search Results Panel — Overlaying content */}
      {searchFocused && searchQuery.trim().length > 0 && (
        <div className="absolute top-[64px] left-4 right-4 max-h-[70vh] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden border border-gray-100 flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="divide-y divide-gray-50">
                <p className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/50">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
                {searchResults.map((item, i) => (
                  <Link
                    key={i}
                    to={item.to}
                    onClick={() => { 
                      setSearchQuery(""); 
                      setSearchFocused(false); 
                      if (item.type === 'news') setActiveTab('news');
                      if (item.type === 'result') setActiveTab('results');
                    }}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors group text-left w-full"
                  >
                    <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded flex-shrink-0 ${typeColor[item.type]}`}>
                      {typeLabel[item.type]}
                    </span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-bold text-gray-900 group-hover:text-violet-600 transition-colors truncate">{item.label}</span>
                      <span className="text-[11px] text-gray-400 truncate">{item.sub}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-400 transition-colors" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-8 bg-white">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-base font-bold text-gray-700 mb-1">No results found</p>
                <p className="text-sm text-gray-400 text-center">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ${searchFocused && searchQuery.trim().length > 0 ? 'opacity-40 pointer-events-none' : ''}`}>

      <div className="p-4 bg-white border-b border-gray-100 relative flex-shrink-0 shadow-sm z-30" ref={indicesDropdownRef}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-gray-900">Market Indices</h2>
          <button 
            onClick={() => setShowIndicesDropdown(!showIndicesDropdown)}
            className="p-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showIndicesDropdown ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {displayedIndices.map((idx) => (
            <Link to={`/option-chain/${idx.id}`} key={idx.id} className="bg-gray-50 rounded-xl p-3 border border-gray-200 shadow-sm flex items-center justify-between gap-2 hover:bg-gray-100 transition-colors">
              <div className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider leading-tight flex-1 pr-1">{idx.name}</div>
              <div className="flex flex-col items-end text-right flex-shrink-0">
                <div className="text-sm font-black text-gray-900 mb-0.5">{idx.value}</div>
                <div className={`text-[10px] font-bold whitespace-nowrap ${idx.isNegative ? 'text-red-500' : 'text-green-500'}`}>
                  {idx.isNegative ? '▼' : '▲'} {idx.change} ({idx.changePercent}%)
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Dropdown Menu */}
        {showIndicesDropdown && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="max-h-64 overflow-y-auto p-2">
              {allIndices.map((idx) => (
                <button
                  key={idx.id}
                  onClick={() => toggleIndex(idx.id)}
                  className={`w-full px-3 py-3 text-left transition-colors mb-1 last:mb-0 rounded-lg flex items-center justify-between ${
                    selectedIndices.includes(idx.id) ? 'bg-violet-50 hover:bg-violet-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-sm font-bold ${selectedIndices.includes(idx.id) ? 'text-violet-700' : 'text-gray-700'}`}>
                    {idx.name}
                  </span>
                  {selectedIndices.includes(idx.id) ? (
                    <div className="text-[10px] uppercase tracking-wider font-bold text-violet-700 bg-violet-100 px-2 py-1 rounded border border-violet-200 shadow-sm flex-shrink-0">
                      Pinned
                    </div>
                  ) : (
                    <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded border border-gray-200 flex-shrink-0 transition-colors">
                      Swap
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 font-semibold flex justify-between items-center">
              <span>Selected Indices</span>
              <span className="text-violet-700 bg-violet-100 px-2 py-0.5 rounded-md">{selectedIndices.length} / 4</span>
            </div>
          </div>
        )}
      </div>

      {/* Categories Grid - 5 items only */}
      <div className="px-4 mt-6 flex-shrink-0">
        <div className="grid grid-cols-5 gap-2">
          <CategoryCard icon={<StocksIcon />} label="Stocks" to="/stocks" />
          <CategoryCard icon={<IPOIcon />} label="IPO" to="/ipo" />
          <CategoryCard icon={<MutualFundsIcon />} label="Mutual Funds" to="/mutual-funds" />
          <CategoryCard icon={<ETFIcon />} label="ETF" to="/etf" />
          <CategoryCard icon={<IndicesIcon />} label="Indices" to="/indices" />
        </div>
      </div>

      {/* Tabs Section - Centered */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex border-b border-gray-200 justify-center flex-shrink-0">
          <button
            onClick={() => setActiveTab("news")}
            className={`flex-1 py-3.5 font-bold text-sm border-b-2 transition-colors text-center ${
              activeTab === "news"
                ? "text-violet-600 border-violet-600"
                : "text-gray-500 border-transparent hover:text-gray-900 bg-gray-50/50"
            }`}
          >
            News
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`flex-1 py-3.5 font-bold text-sm border-b-2 transition-colors text-center ${
              activeTab === "results"
                ? "text-violet-600 border-violet-600"
                : "text-gray-500 border-transparent hover:text-gray-900 bg-gray-50/50"
            }`}
          >
            Results
          </button>
        </div>

        {/* News Tab Content - Centered */}
        {activeTab === "news" && (
          <div className="flex justify-center flex-1 min-h-0 overflow-hidden bg-gray-50 pb-20 pt-4">
            <div className="w-full max-w-2xl overflow-y-auto px-4">
              <div className="flex flex-col gap-3 pb-8">
                {newsData.map(news => (
                  <NewsCard key={news.id} date={news.date} title={news.title} description={news.description} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Tab Content - Centered */}
        {activeTab === "results" && (
          <div className="flex justify-center flex-1 min-h-0 overflow-hidden bg-gray-50 pb-20 pt-4">
            <div className="w-full max-w-2xl overflow-y-auto px-4">
              <div className="flex flex-col gap-3 pb-8">
                {resultsData.map(res => (
                  <ResultCard key={res.id} symbol={res.symbol} change={res.change} title={res.title} description={res.description} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 flex-shrink-0 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center gap-1 font-medium w-full h-full py-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-lg mx-1 ${
            location.pathname === '/dashboard' ? 'text-violet-600' : 'text-gray-500 hover:text-violet-600'
          }`}
        >
          <Home className="w-5 h-5" strokeWidth={location.pathname === '/dashboard' ? 2.5 : 1.75} />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link to="/portfolio" className="flex flex-col items-center justify-center gap-1 text-gray-500 font-medium hover:text-violet-600 w-full h-full py-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-lg mx-1">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.04-2.71c-.2-.28-.57-.42-.9-.35-.33.05-.6.31-.66.63l-1.17 6.3h11.01L15.5 6.5c-.05-.32-.31-.58-.64-.63-.33-.07-.7.07-.9.35z"/></svg>
          <span className="text-[10px]">Portfolio</span>
        </Link>
        <Link to="/strategy" className="flex flex-col items-center justify-center gap-1 text-gray-500 font-medium hover:text-violet-600 w-full h-full py-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-lg mx-1">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
          <span className="text-[10px]">Strategy</span>
        </Link>
        <Link to="/backtest" className="flex flex-col items-center justify-center gap-1 text-gray-500 font-medium hover:text-violet-600 w-full h-full py-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-lg mx-1">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2zm4 4h2v16h-2z"/></svg>
          <span className="text-[10px]">Backtest</span>
        </Link>
        <Link to="/calendar" className="flex flex-col items-center justify-center gap-1 text-gray-500 font-medium hover:text-violet-600 relative w-full h-full py-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-lg mx-1">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Calendar</span>
        </Link>
      </div>
    </div>
  );
}
