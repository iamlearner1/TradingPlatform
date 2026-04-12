import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2500); // Redirect after 2.5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-violet-600 to-violet-900 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-violet-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Main Logo Content */}
      <div className="z-10 flex flex-col items-center animate-in fade-in zoom-in duration-1000 ease-out">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-6 transform rotate-12 hover:rotate-0 transition-transform duration-500">
          <TrendingUp className="w-14 h-14 text-violet-600" />
        </div>
        <h1 className="text-6xl font-black text-white tracking-tighter mb-2">
          INTOXS
        </h1>
        <p className="text-violet-200 font-bold tracking-widest uppercase text-xs">
          Smart Trading. Simplified.
        </p>
      </div>

      {/* Footer / Skip Button */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4 px-6">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce delay-150"></div>
          <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce delay-300"></div>
        </div>
        
        <button 
          onClick={() => navigate("/login")}
          className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white/80 text-sm font-bold border border-white/20 transition-all active:scale-95"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default Splash;
