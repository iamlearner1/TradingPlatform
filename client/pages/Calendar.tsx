import { ArrowLeft, Calendar as CalendarIcon, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const upcomingResults = [
  { id: 1, symbol: 'ICICIAMC', company: 'ICICI Prudential Asset Management', purpose: 'Financial Results', details: 'To consider and approve the financial results for the quarter and yearly ended March 31, 2026', date: '13-Apr-2026' },
  { id: 2, symbol: 'INNOVISION', company: 'Innovision Limited', purpose: 'Dividend', details: 'To consider final dividend, if any', date: '13-Apr-2026' },
  { id: 3, symbol: 'JUSTDIAL', company: 'Just Dial Limited', purpose: 'Financial Results', details: 'To consider and approve the financial results for the period ended December 31, 2025', date: '13-Apr-2026' },
  { id: 4, symbol: 'LICI', company: 'Life Insurance Corporation Of India', purpose: 'Financial Results', details: 'To consider and approve the financial results for the period ended March 31, 2026', date: '13-Apr-2026' },
  { id: 5, symbol: 'NOIDATOLL', company: 'Noida Toll Bridge Company', purpose: 'Bonus', details: 'To consider bonus', date: '13-Apr-2026' },
  { id: 6, symbol: 'SWARAJENG', company: 'Swaraj Engines Limited', purpose: 'Other business matters', details: 'To consider other business matters', date: '13-Apr-2026' },
  { id: 7, symbol: 'ARSSBL', company: 'Anand Rathi Share and Stock', purpose: 'Financial Results/Dividend', details: 'To consider and approve the financial results for the period ended March 31, 2026 and dividend', date: '14-Apr-2026' },
  { id: 8, symbol: 'DEN', company: 'Den Networks Limited', purpose: 'Financial Results', details: 'To consider and approve the financial results for the period ended March 31, 2026', date: '14-Apr-2026' },
];

export default function CalendarPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 flex-shrink-0 z-20">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-violet-600" />
            <h1 className="text-lg font-bold text-gray-900">Results & Events Calendar</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm mb-4 bg-white">
          <div className="bg-[#312579] px-3 py-2.5 flex justify-between items-center text-white">
            <h4 className="text-[11px] font-bold uppercase tracking-wider">Upcoming Board Meetings & Results</h4>
          </div>
          <div className="overflow-x-auto relative scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[480px]">
              <thead>
                <tr className="bg-[#312579] text-white/90 border-t border-white/10">
                  <th className="px-3 py-2 text-[10px] font-bold uppercase w-[90px] sticky left-0 bg-[#312579] z-20 shadow-[4px_0_12px_rgba(0,0,0,0.15)]">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">Date <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                  </th>
                  <th className="px-3 py-2 text-[10px] font-bold uppercase w-[160px] whitespace-nowrap">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">Symbol / Company <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                  </th>
                  <th className="px-3 py-2 text-[10px] font-bold uppercase w-[240px]">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">Purpose / Details <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {upcomingResults.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 align-top sticky left-0 bg-white/95 backdrop-blur-sm shadow-[4px_0_12px_rgba(0,0,0,0.04)] border-r border-gray-100 z-10 w-[90px]">
                      <div className="text-[11px] font-bold text-gray-800 whitespace-nowrap">{row.date}</div>
                    </td>
                    <td className="px-3 py-3 align-top">
                      <div className="text-[11px] font-bold text-[#1a5f9e] cursor-pointer hover:underline">{row.symbol}</div>
                      <div className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-snug pr-2">{row.company}</div>
                    </td>
                    <td className="px-3 py-3 align-top">
                      <div className="text-[11px] font-bold text-gray-800">{row.purpose}</div>
                      <div className="text-[10px] text-gray-500 mt-1 leading-snug">{row.details}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm mb-4">
          <div className="bg-blue-50 px-3 py-2 border-b border-blue-100/50">
            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider">Global Macro Events</h4>
          </div>
          <div className="divide-y divide-gray-50 bg-white">
            <div className="p-4 hover:bg-gray-50 flex flex-col gap-1.5">
               <div className="flex justify-between items-center">
                  <span className="font-bold text-[15px] text-gray-900">US CPI Inflation Data</span>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">High Impact</span>
               </div>
               <p className="text-xs font-medium text-gray-500">Expected: 3.1% YoY • Date: Tomorrow, 6:00 PM</p>
            </div>
            <div className="p-4 hover:bg-gray-50 flex flex-col gap-1.5">
               <div className="flex justify-between items-center">
                  <span className="font-bold text-[15px] text-gray-900">FOMC Fed Meeting Outcome</span>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">High Impact</span>
               </div>
               <p className="text-xs font-medium text-gray-500">Interest Rate Decision & Dot Plot • Date: Wed 11:30 PM</p>
            </div>
            <div className="p-4 hover:bg-gray-50 flex flex-col gap-1.5">
               <div className="flex justify-between items-center">
                  <span className="font-bold text-[15px] text-gray-900">India CPI & IIP Data</span>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Medium Impact</span>
               </div>
               <p className="text-xs font-medium text-gray-500">Domestic Inflation & Prod Data • Date: Fri 5:30 PM</p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
