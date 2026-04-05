import { ArrowLeft, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function Stocks() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-100 flex items-center px-4 py-3 flex-shrink-0 relative z-10 shadow-sm">
        <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <h1 className="text-base font-bold text-gray-900 ml-2">Stocks</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 mb-4">
             <TrendingUp className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Explore Stocks</h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
            Discover and trade top performing stocks across various sectors. Market data and analytics coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
