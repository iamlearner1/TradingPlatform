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
import IPO from "./pages/IPO";
import MutualFunds from "./pages/MutualFunds";
import ETF from "./pages/ETF";
import Indices from "./pages/Indices";
import Portfolio from "./pages/Portfolio";
import Strategy from "./pages/Strategy";
import PaperTrade from "./pages/PaperTrade";
import Backtest from "./pages/Backtest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/ipo" element={<IPO />} />
          <Route path="/mutual-funds" element={<MutualFunds />} />
          <Route path="/etf" element={<ETF />} />
          <Route path="/indices" element={<Indices />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/strategy" element={<Strategy />} />
          <Route path="/paper-trade" element={<PaperTrade />} />
          <Route path="/backtest" element={<Backtest />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
