import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Stocks from "./pages/Stocks";
import StockDetails from "./pages/StockDetails";
import IPO from "./pages/IPO";
import MutualFunds from "./pages/MutualFunds";
import ETF from "./pages/ETF";
import Indices from "./pages/Indices";
import Portfolio from "./pages/Portfolio";
import Strategy from "./pages/Strategy";
import PaperTrade from "./pages/PaperTrade";
import Backtest from "./pages/Backtest";
import OptionChain from "./pages/OptionChain";
import StrategyBuilder from "./pages/StrategyBuilder";
import CalendarPage from "./pages/Calendar";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/stock/:ticker" element={<StockDetails />} />
          <Route path="/ipo" element={<IPO />} />
          <Route path="/mutual-funds" element={<MutualFunds />} />
          <Route path="/etf" element={<ETF />} />
          <Route path="/indices" element={<Indices />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/strategy" element={<Strategy />} />
          <Route path="/paper-trade" element={<PaperTrade />} />
          <Route path="/backtest" element={<Backtest />} />
          <Route path="/option-chain/:symbol" element={<OptionChain />} />
          <Route path="/strategy-builder" element={<StrategyBuilder />} />
          <Route path="/calendar" element={<CalendarPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
