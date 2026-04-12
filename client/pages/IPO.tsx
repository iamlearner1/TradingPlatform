import { useState } from "react";
import { ArrowLeft, Filter, ArrowUpRight, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function IPO() {
  const [activeTab, setActiveTab] = useState("current");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedIPO, setSelectedIPO] = useState<any>(null);

  const currentIPOs = [
    {
      id: 1,
      name: "TechVision Ltd",
      status: "Open",
      issueSize: "₹500 Cr",
      priceRange: "₹230-250",
      currentPrice: "₹245",
      lotSize: "60 shares",
      minInvestment: "₹14,700"
    },
    {
      id: 2,
      name: "GreenEnergy Corp",
      status: "Open",
      issueSize: "₹350 Cr",
      priceRange: "₹165-185",
      currentPrice: "₹180",
      lotSize: "75 shares",
      minInvestment: "₹13,500"
    },
    {
      id: 3,
      name: "EcoPlastics Inc",
      status: "Closed",
      issueSize: "₹150 Cr",
      priceRange: "₹100-110",
      currentPrice: "₹105",
      lotSize: "100 shares",
      minInvestment: "₹10,500"
    }
  ];

  const greyMarketIPOs = [
    {
      id: 1,
      name: "TechVision Ltd",
      gmpPercent: "+18.4%",
      gmp: "₹45",
      expectedListing: "₹290",
      premiumStatus: "High Demand",
    },
    {
      id: 2,
      name: "GreenEnergy Corp",
      gmpPercent: "+13.9%",
      gmp: "₹25",
      expectedListing: "₹205",
      premiumStatus: "",
    }
  ];

  const upcomingIPOs = [
    {
      id: 1,
      name: "DataCloud Systems",
      issueSize: "₹650 Cr",
      priceRange: "₹350-380",
      timeline: "Apr 15, 2026 - Apr 18, 2026"
    },
    {
      id: 2,
      name: "Retail Express",
      issueSize: "₹420 Cr",
      priceRange: "₹215-230",
      timeline: "Apr 20, 2026 - Apr 23, 2026"
    }
  ];

  const filteredIPOs = currentIPOs.filter(
    (ipo) => filterStatus === "All" || ipo.status === filterStatus
  );

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden max-w-md mx-auto relative shadow-2xl">
      {/* Header */}
      <div className="bg-violet-600 border-b border-violet-700 px-4 py-3 flex items-center gap-3 shrink-0 relative z-10">
        <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-violet-700 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-[19px] font-bold text-white leading-tight">IPO Center</h1>
          <p className="text-[13px] text-violet-200">Track and invest in IPOs</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 relative">
        {/* Tabs */}
        <div className="px-4 py-4">
          <div className="bg-gray-100 p-1.5 rounded-2xl flex">
            {["current", "grey market", "upcoming"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 font-medium text-[13px] rounded-xl capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Current Tab */}
        {activeTab === "current" && (
          <div className="px-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Current IPOs</h2>
              <span className="px-3 py-1 bg-gray-100 border border-gray-200 text-gray-800 rounded-full text-xs font-semibold">
                {filteredIPOs.length} Active
              </span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white py-3.5 rounded-xl font-medium text-sm transition-colors hover:bg-violet-700 active:scale-[0.99]"
              >
                <Filter className="w-4 h-4" />
                Filter by Status {filterStatus !== "All" && `(${filterStatus})`}
              </button>
              
              {isFilterMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-20"
                    onClick={() => setIsFilterMenuOpen(false)}
                  />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-2 w-48 z-30 border border-gray-100">
                    {["All", "Open", "Closed"].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setIsFilterMenuOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 text-[15px] font-medium hover:bg-gray-50 transition-colors ${
                          filterStatus === status ? "text-gray-900 font-bold" : "text-gray-600"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4 mt-6 relative z-10">
              {filteredIPOs.map((ipo) => (
                <div key={ipo.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="font-bold text-lg text-gray-900">{ipo.name}</h3>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold leading-none flex items-center justify-center ${
                      ipo.status === 'Open' ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {ipo.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-[15px] mb-6">Issue Size: {ipo.issueSize}</p>
                  
                  <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
                    <div>
                      <p className="text-[13px] font-medium text-gray-400 mb-1">Price Range</p>
                      <p className="font-bold text-gray-900 text-[15px]">{ipo.priceRange}</p>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-400 mb-1">Current Price</p>
                      <p className="font-bold text-violet-600 text-[15px]">{ipo.currentPrice}</p>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-400 mb-1">Lot Size</p>
                      <p className="font-bold text-gray-900 text-[15px]">{ipo.lotSize}</p>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-400 mb-1">Min Investment</p>
                      <p className="font-bold text-gray-900 text-[15px]">{ipo.minInvestment}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedIPO(ipo)}
                    className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white py-3.5 rounded-xl font-medium text-[15px] transition-colors hover:bg-violet-700 active:scale-[0.99]"
                  >
                    {ipo.status === 'Closed' ? 'Check IPO Status' : 'Check IPO Details'}
                    {ipo.status === 'Open' && <ArrowUpRight className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grey Market Tab */}
        {activeTab === "grey market" && (
          <div className="px-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Grey Market Premium</h2>
              <TrendingUp className="w-5 h-5 text-violet-600" strokeWidth={2.5} />
            </div>

            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 mb-6">
              <p className="text-[#1D4ED8] text-sm leading-relaxed text-[13px]">
                <span className="font-bold">GMP</span> is the price at which IPO shares are traded before listing. Higher GMP indicates strong demand.
              </p>
            </div>

            <div className="space-y-4">
              {greyMarketIPOs.map((ipo) => (
                <div key={ipo.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-lg text-gray-900">{ipo.name}</h3>
                    <span className="px-3.5 py-1 bg-[#F5F3FF] text-[#7C3AED] rounded-full text-xs font-bold border border-[#EDE9FE]">
                      {ipo.gmpPercent}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-[#ECFDF5] rounded-xl p-4">
                      <p className="text-[13px] text-[#047857] mb-2 font-medium leading-tight">Grey Market<br/>Premium</p>
                      <p className="text-[22px] font-extrabold text-[#059669] mb-1 leading-none">{ipo.gmp}</p>
                      <p className="text-[12px] font-medium text-[#047857]">{ipo.gmpPercent} gain</p>
                    </div>
                    <div className="bg-[#EFF6FF] rounded-xl p-4">
                      <p className="text-[13px] text-[#1D4ED8] mb-2 font-medium leading-tight">Expected Listing</p>
                      <p className="text-[22px] font-extrabold text-[#2563EB] mb-2 leading-none">{ipo.expectedListing}</p>
                      <p className="text-[12px] font-medium text-[#2563EB]">At listing day</p>
                    </div>
                  </div>
                  
                  {ipo.premiumStatus && (
                    <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center text-[13px]">
                      <span className="text-gray-500 font-medium">Premium Status:</span>
                      <span className="font-bold text-violet-600">{ipo.premiumStatus}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Tab */}
        {activeTab === "upcoming" && (
          <div className="px-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upcoming IPOs</h2>
              <span className="px-3 py-1 bg-gray-100 border border-gray-200 text-gray-800 rounded-full text-xs font-semibold">
                {upcomingIPOs.length} Coming
              </span>
            </div>

            <div className="space-y-4 mt-6">
              {upcomingIPOs.map((ipo) => (
                <div key={ipo.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{ipo.name}</h3>
                    <span className="px-3 py-1 border border-amber-400 text-amber-600 rounded-full text-[11px] font-bold bg-amber-50 leading-none">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-gray-500 text-[15px] mb-5">Issue Size: {ipo.issueSize}</p>
                  
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-[14px] text-gray-500">Price Range</p>
                    <p className="font-bold text-gray-900">{ipo.priceRange}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3 relative mb-5">
                    <div className="mt-0.5">
                      <Calendar className="w-[18px] h-[18px] text-gray-500 shrink-0" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-500 mb-0.5">IPO Timeline</p>
                      <p className="font-bold text-gray-900 text-[14px]">{ipo.timeline}</p>
                    </div>
                    {ipo.id === 1 && (
                      <div className="absolute right-3 -bottom-2 bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded uppercase font-bold">
                        Preview
                      </div>
                    )}
                  </div>
                  
                  <button className="w-full flex items-center justify-center bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 py-3 rounded-xl font-bold text-[14px] shadow-sm transition-all active:scale-[0.99]">
                    Set Reminder
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Bottom Sheet Overlay */}
      {selectedIPO && (
        <>
          <div 
            className="absolute inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setSelectedIPO(null)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-50 p-6 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] pb-10 origin-bottom animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-[22px] font-bold text-gray-900 mb-3">{selectedIPO.name}</h2>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold leading-none inline-flex items-center justify-center ${
                  selectedIPO.status === 'Open' ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {selectedIPO.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-medium text-gray-500 mb-1">Current Price</p>
                <p className={`text-2xl font-bold ${selectedIPO.status === 'Open' ? 'text-violet-600' : 'text-gray-900'}`}>{selectedIPO.currentPrice}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[13px] text-gray-500 mb-1.5 font-medium">Price Range</p>
                <p className="font-bold text-[16px] text-gray-900">{selectedIPO.priceRange}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[13px] text-gray-500 mb-1.5 font-medium">Lot Size</p>
                <p className="font-bold text-[16px] text-gray-900">{selectedIPO.lotSize}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[13px] text-gray-500 mb-1.5 font-medium">Issue Size</p>
                <p className="font-bold text-[16px] text-gray-900">{selectedIPO.issueSize}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[13px] text-gray-500 mb-1.5 font-medium">Min Investment</p>
                <p className="font-bold text-[16px] text-gray-900">{selectedIPO.minInvestment}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full py-4 bg-violet-600 text-white rounded-[16px] font-bold text-[15px] transition-colors hover:bg-violet-700 active:scale-[0.99] shadow-sm">
                Apply for IPO
              </button>
              <button 
                onClick={() => setSelectedIPO(null)}
                className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-[16px] font-bold text-[15px] hover:bg-gray-50 transition-colors active:scale-[0.99]"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
