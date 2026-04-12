import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Phone, User, ArrowRight, Apple, Github, ChevronLeft } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    if (name.trim().length < 3) {
      setError("Please enter your full name");
      return;
    }
    setError("");
    setStep("otp");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "123456") {
      navigate("/dashboard");
    } else {
      setError("Invalid OTP. Try 123456");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-8 font-inter">
      {/* Back Button */}
      {step === "otp" && (
        <button 
          onClick={() => { setStep("phone"); setError(""); }}
          className="absolute top-8 left-6 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Header */}
      <div className="flex flex-col items-center mt-12 mb-12 animate-in fade-in slide-in-from-top-10 duration-700">
        <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-violet-200">
          <TrendingUp className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight text-center">
          {step === "phone" ? "Create Account" : "Verify Number"}
        </h2>
        <p className="text-gray-400 font-medium text-sm mt-1 text-center max-w-[240px]">
          {step === "phone" 
            ? "Start your trading journey with Intox today" 
            : `Enter the code sent to ${phone}`}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-in fade-in zoom-in duration-300">
          {error}
        </div>
      )}

      {/* Form Area */}
      {step === "phone" ? (
        <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe" 
                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-violet-600 transition-all placeholder:text-gray-300"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold border-r border-gray-100 pr-3">+91</span>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="00000 00000" 
                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-16 pr-4 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-violet-600 transition-all placeholder:text-gray-300 tracking-widest"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="h-14 bg-violet-600 rounded-2xl text-white font-black flex items-center justify-center gap-2 mt-2 shadow-lg shadow-violet-200 active:scale-95 transition-all"
          >
            Create Account
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1 text-center">Verification Code</label>
            <input 
              type="text" 
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="0 0 0 0 0 0" 
              className="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-gray-900 font-black text-2xl text-center focus:outline-none focus:ring-2 focus:ring-violet-600 transition-all placeholder:text-gray-200 tracking-[0.5em]"
              required
            />
          </div>

          <button 
            type="submit"
            className="h-14 bg-violet-600 rounded-2xl text-white font-black flex items-center justify-center gap-2 mt-2 shadow-lg shadow-violet-200 active:scale-95 transition-all"
          >
            Verify & Continue
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="flex justify-between px-2">
            <p className="text-xs text-gray-400 font-medium">Didn't receive it?</p>
            <button type="button" className="text-xs font-bold text-violet-600">Resend OTP</button>
          </div>
        </form>
      )}

      <div className="mt-12 flex flex-col items-center gap-6 animate-in fade-in duration-1000 delay-500">
        <div className="flex items-center gap-4 w-full text-gray-100">
          <div className="h-px bg-current flex-1"></div>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Connect With</span>
          <div className="h-px bg-current flex-1"></div>
        </div>

        <div className="flex gap-4 w-full">
          <button className="flex-1 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 active:scale-95 transition-all">
            <Apple className="w-6 h-6 text-gray-900" />
          </button>
          <button className="flex-1 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 active:scale-95 transition-all">
            <Github className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>

      <div className="mt-auto pt-8 text-center text-gray-400 text-xs font-medium">
        Already have an account? <button onClick={() => navigate("/login")} className="text-violet-600 font-black">Sign In</button>
      </div>
    </div>
  );
};

export default SignUp;
