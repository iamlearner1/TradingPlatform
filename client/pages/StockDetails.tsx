import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Youtube } from "lucide-react";

const YEARS = ["Mar-16", "Mar-17", "Mar-18", "Mar-19", "Mar-20", "Mar-21", "Mar-22", "Mar-23", "Mar-24", "Mar-25"];
const QUARTERS = ["Sep-23", "Dec-23", "Mar-24", "Jun-24", "Sep-24", "Dec-24", "Mar-25", "Jun-25", "Sep-25", "Dec-25"];

// Helpers
declare global {
  interface String { hashCode(): number; }
}
String.prototype.hashCode = function() {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};

export default function StockDetails() {
  const { ticker } = useParams();
  const [activeTab, setActiveTab] = useState("Quick Analysis");
  const tabs = ["Quick Analysis", "Profit & Loss", "Quarters", "Balance Sheet", "Cash Flow"];
  const mockPrice = ticker === "RELIANCE" ? "2,980.50" : ((Math.abs(ticker?.hashCode() ?? 1234) % 4000) + 100).toFixed(2);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden max-w-md mx-auto relative shadow-2xl">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 flex items-center px-4 py-3 flex-shrink-0 relative z-10 shadow-sm">
        <Link to="/stocks" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </Link>
        <div className="ml-2 flex-1">
          <h1 className="text-[16px] font-extrabold text-gray-900 leading-tight uppercase truncate mr-2">{ticker}</h1>
          <p className="text-[11px] font-bold text-gray-400 tracking-wide">Live NSE Data</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-900 text-[15px]">₹{mockPrice}</p>
          <div className="flex flex-row items-center justify-end text-[11px] font-bold text-green-600 gap-0.5">
            <TrendingUp className="w-3 h-3 stroke-[3]" />
            +1.24%
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm z-10">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3.5 text-[14px] font-bold whitespace-nowrap border-b-[3px] transition-colors ${activeTab === tab ? 'border-violet-600 text-violet-700 bg-violet-50/50' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#F8F9FA] pb-24">
        {activeTab === "Quick Analysis" && <QuickAnalysisTab />}
        {activeTab === "Profit & Loss" && <SpreadsheetTab type="pnl" headers={YEARS} />}
        {activeTab === "Quarters" && <SpreadsheetTab type="quarters" headers={QUARTERS} />}
        {activeTab === "Balance Sheet" && <SpreadsheetTab type="balance" headers={YEARS} />}
        {activeTab === "Cash Flow" && <SpreadsheetTab type="cash" headers={YEARS} />}
      </div>


    </div>
  );
}

// ----------------------------------------------------
// Spreadsheet Tab
// ----------------------------------------------------
const formatValue = (base: number, multiplier: number, isPercent = false, digits = 2) => {
  const val = base * multiplier;
  if (isPercent) return val.toFixed(digits) + "%";
  return val.toLocaleString('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: digits });
};

const SpreadsheetTab = ({ type, headers }: { type: string; headers: string[] }) => {
  let activeData: any[] = [];
  let extraHeaders: string[] = [];
  let trendsData: any = null;
  let ratiosData: any = null;

  if (type === "pnl") {
    // Exactly match the screenshot structure for P&L
    extraHeaders = ["Trailing", "Best Case", "Worst Case"];
    
    // Using base values to generate numbers that look like the screenshot, 
    // but plugging in precise Best/Worst case static values later.
    activeData = [
      { label: "Sales", base: 272583, step: 1.15, bold: true, best: "1,073,494.93", worst: "962,820.00" },
      { label: "Expenses", base: 230802, step: 1.14, best: "889,075.77", worst: "962,820.00" },
      { label: "Operating Profit", base: 41781, step: 1.18, bold: true, best: "184,419.16", worst: "-" },
      { label: "Other Income", base: 12212, step: 1.05, best: "-", worst: "-" },
      { label: "Depreciation", base: 11565, step: 1.18, best: "-", worst: "-" },
      { label: "Interest", base: 3691, step: 1.25, best: "-", worst: "-" },
      { label: "Profit before tax", base: 38737, step: 1.12, bold: true, best: "184,419.16", worst: "-" },
      { label: "Tax", base: 8876, step: 1.12, best: "0%", worst: "0%" },
      { label: "Net profit", base: 29745, step: 1.12, bold: true, best: "184,419.16", worst: "-" },
      { label: "EPS", base: 21.51, step: 1.12, best: "136.29", worst: "-" },
      { label: "Price to earning", base: 11.04, step: 1.08, best: "25.11", worst: "-" },
      { label: "Price", base: 237.46, step: 1.2, bold: true, trailing: "1,407.25", best: "3,422.94", bestBg: "#9bc2e6", worst: "-", worstBg: "#f4b084" },
    ];

    ratiosData = [
      { label: "Dividend Payout", base: 10.41, step: 1.02, isPercent: true },
      { label: "OPM", base: 15.33, step: 1.01, isPercent: true, trailing: "0.00%" },
    ];

    trendsData = {
      headers: ["TRENDS:", "10 YEARS", "7 YEARS", "5 YEARS", "3 YEARS", "RECENT", "BEST", "WORST"],
      rows: [
        { label: "Sales Growth", vals: ["15.05%", "13.75%", "10.04%", "11.49%", "7.09%", "11.49%", "7.09%"], boldLast: true },
        { label: "OPM", vals: ["16.34%", "16.45%", "16.92%", "17.18%", "0.00%", "17.18%", "0.00%"], boldLast: true },
        { label: "Price to Earning", vals: ["20.45", "23.51", "25.20", "25.11", "-", "25.11", "-"], boldLast: true },
      ]
    };
  } else if (type === "quarters") {
    // Generate quarters from Mar-16 to Dec-25 to match "starting from 2016" request
    headers = [];
    for (let y = 16; y <= 25; y++) {
      headers.push(`Mar-${y}`);
      headers.push(`Jun-${y}`);
      headers.push(`Sep-${y}`);
      headers.push(`Dec-${y}`);
    }
    // No slicing, keep all quarters starting from 2016

    activeData = [
      { label: "Sales", base: 231886, step: 1.02, bold: true },
      { label: "Expenses", base: 190918, step: 1.02 },
      { label: "Operating Profit", base: 40968, step: 1.02, bold: true },
      { label: "Other Income", base: 3841, step: 1.03 },
      { label: "Depreciation", base: 12585, step: 1.05 },
      { label: "Interest", base: 5731, step: 1.01 },
      { label: "Profit before tax", base: 26493, step: 1.03, bold: true },
      { label: "Tax", base: 6673, step: 1.03 },
      { label: "Net profit", base: 17394, step: 1.03, bold: true },
    ];
  } else if (type === "balance") {
    activeData = [
      { label: "Equity Share Capital", base: 2948, step: 1.05 },
      { label: "Reserves", base: 228608, step: 1.15 },
      { label: "Borrowings", base: 194714, step: 1.10 },
      { label: "Other Liabilities", base: 172727, step: 1.12 },
      { label: "Total Liabilities", base: 598997, step: 1.13, bold: true },
      { label: "Net Block", base: 184910, step: 1.18 },
      { label: "Capital Work in Progress", base: 228697, step: 1.05 },
      { label: "Investments", base: 84015, step: 1.15 },
      { label: "Other Assets", base: 101375, step: 1.16 },
      { label: "Total Assets", base: 598997, step: 1.13, bold: true },
    ];
  } else {
    activeData = [
      { label: "Cash from Operating Act.", base: 38134, step: 1.20, bold: true },
      { label: "Cash from Investing Act.", base: -36186, step: 1.15, bold: true },
      { label: "Cash from Financing Act.", base: -3210, step: 1.60, bold: true },
      { label: "Net Cash Flow", base: -1262, step: 0.50, bold: true },
    ];
  }

  const allHeaders = [...headers, ...extraHeaders];

  return (
    <div className="w-full overflow-x-auto bg-white mb-6 p-2 pb-10">
      {/* Top Banner mapping to the screenshot */}
      <div className="flex justify-between items-center bg-white border border-[#bfbfbf] mb-0 px-2 py-1 text-[11px] font-bold">
        <div>RELIANCE INDUSTRIES LTD</div>
        <div>SCREENER.IN</div>
      </div>

      <table className="w-full min-w-max text-left border-collapse font-sans border-t-0 table-fixed">
        <thead>
          <tr className="bg-[#0070C0] text-white">
            <th className="sticky left-0 bg-[#0070C0] z-20 px-2 py-1 text-[11px] font-bold border border-[#bfbfbf] w-[180px]">
              Narration
            </th>
            {headers.map((h, i) => (
              <th key={i} className="px-2 py-1 text-[11px] font-bold border border-[#bfbfbf] text-right w-[80px] min-w-[80px]">{h}</th>
            ))}
            {extraHeaders.map((h, i) => (
              <th key={`ex-${i}`} className="px-2 py-1 text-[11px] font-bold border border-[#bfbfbf] text-right w-[80px] min-w-[80px]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Main Data */}
          {activeData.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-blue-50/10 transition-colors group">
              <td className={`sticky left-0 z-20 bg-white px-2 py-[2px] text-[11px] border border-[#bfbfbf] group-hover:bg-gray-50 transition-colors text-black ${row.bold ? 'font-bold' : ''}`}>
                {row.label}
              </td>
              {headers.map((_, cIdx) => (
                <td key={cIdx} className={`px-2 py-[2px] text-[11px] border border-[#bfbfbf] text-right text-black ${row.bold ? 'font-bold' : ''}`}>
                  {formatValue(row.base, Math.pow(row.step, cIdx), row.isPercent, row.isPercent ? 2 : 0)}
                  {cIdx === headers.length - 1 && type === "pnl" && (
                    <span className="text-blue-600 inline-block ml-1 text-[8px] transform -translate-y-px">▼</span>
                  )}
                </td>
              ))}
              {extraHeaders.length > 0 && (
                <>
                  <td className={`px-2 py-[2px] text-[11px] border border-[#bfbfbf] text-right text-black ${row.bold ? 'font-bold' : ''}`}>
                    {row.trailing || ""}
                  </td>
                  <td className={`px-2 py-[2px] text-[11px] border border-[#bfbfbf] text-right text-black ${row.bold ? 'font-bold' : ''}`} style={{ backgroundColor: row.bestBg || 'transparent' }}>
                     {row.best || ""}
                  </td>
                  <td className={`px-2 py-[2px] text-[11px] border border-[#bfbfbf] text-right text-black ${row.bold ? 'font-bold' : ''}`} style={{ backgroundColor: row.worstBg || 'transparent' }}>
                     {row.worst || ""}
                  </td>
                </>
              )}
            </tr>
          ))}

          {/* Spacer logic */}
          {ratiosData && (
            <>
              <tr><td colSpan={allHeaders.length + 1} className="h-4 border border-[#bfbfbf]"></td></tr>
              <tr>
                <td colSpan={allHeaders.length + 1} className="px-2 py-[2px] text-[11px] font-bold border border-[#bfbfbf] text-black">RATIOS:</td>
              </tr>
              {ratiosData.map((row: any, rIdx: number) => (
                <tr key={`r-${rIdx}`}>
                  <td className="sticky left-0 z-20 bg-white px-2 py-[2px] text-[11px] border border-[#bfbfbf] text-black w-[180px]">
                    {row.label}
                  </td>
                  {headers.map((_, cIdx) => (
                    <td key={cIdx} className="px-2 py-[2px] text-[11px] border border-[#bfbfbf] text-right text-black">
                      {formatValue(row.base, Math.pow(row.step, cIdx), row.isPercent, 2)}
                    </td>
                  ))}
                  {extraHeaders.length > 0 && (
                    <>
                      <td className="px-2 py-[2px] text-[11px] border border-[#bfbfbf] text-right text-black">{row.trailing || ""}</td>
                      <td colSpan={2} className="border border-[#bfbfbf]"></td>
                    </>
                  )}
                </tr>
              ))}
            </>
          )}

          {/* Trends Logic */}
          {trendsData && (
             <>
               <tr><td colSpan={allHeaders.length + 1} className="h-4 border border-[#bfbfbf]"></td></tr>
               <tr className="bg-[#0070C0] text-white font-bold text-[11px]">
                  {/* For trends, we right-align everything except the TRENDS text, mapping to right-most cols */}
                  <td colSpan={1 + headers.length + extraHeaders.length - trendsData.headers.length + 1} className="bg-[#0070C0]"></td>
                  {trendsData.headers.slice(1).map((h: string, i: number) => (
                    <td key={i} className="px-2 py-1 border border-[#bfbfbf] text-center w-[80px] min-w-[80px]">{h}</td>
                  ))}
               </tr>
               {/* Add TRENDS: label row overlay but since flex is hard in tables, we'll just insert TRENDS: cell in the correct spot */}
               {(() => {
                 // The starting col index for the right-aligned trend matrix
                 const blankColsSpan = 1 + headers.length + extraHeaders.length - trendsData.headers.length + 1;
                 return trendsData.rows.map((row: any, rIdx: number) => (
                   <tr key={`t-${rIdx}`}>
                     {/* blank cols */}
                     <td colSpan={blankColsSpan - 1} className="border border-[#bfbfbf]"></td>
                     {/* Label (merged to fit under TRENDS Header maybe? we just put it here) */}
                     <td className="px-2 py-[2px] text-[11px] font-bold text-right border border-[#bfbfbf] text-black">{row.label}</td>
                     {/* Vals */}
                     {row.vals.map((v: string, vIdx: number) => {
                        const isLastTwo = vIdx >= row.vals.length - 2;
                        return (
                          <td key={vIdx} className={`px-2 py-[2px] text-[11px] text-right border border-[#bfbfbf] text-black ${isLastTwo ? 'font-bold' : ''}`}>{v}</td>
                        );
                     })}
                   </tr>
                 ));
               })()}
             </>
          )}
        </tbody>
      </table>
    </div>
  );
};

// ----------------------------------------------------
// Quick Analysis / 2-Minute Test Tab  (Table Layout)
// ----------------------------------------------------
const QuickAnalysisTab = () => {
  const years = ["Mar-16","Mar-17","Mar-18","Mar-19","Mar-20","Mar-21","Mar-22","Mar-23","Mar-24","Mar-25"];
  
  const thStyle: React.CSSProperties = { padding: '4px 6px', fontSize: '11px', border: '1px solid black', whiteSpace: 'nowrap', lineHeight: '1.3' };
  const tdStyle: React.CSSProperties = { padding: '4px 6px', fontSize: '11px', border: '1px solid black', backgroundColor: 'white', lineHeight: '1.3', whiteSpace: 'nowrap' };
  const numColStyle: React.CSSProperties = { ...thStyle, width: '24px', minWidth: '24px', backgroundColor: 'white', textAlign: 'center' };
  const qColStyle: React.CSSProperties = { ...thStyle, width: '166px', minWidth: '166px', backgroundColor: 'white', color: '#1e3a8a', whiteSpace: 'normal', wordWrap: 'break-word' };
  const badgeColStyle: React.CSSProperties = { ...thStyle, width: '70px', minWidth: '70px', textAlign: 'center' };

  return (
    <div className="w-full bg-white p-2 pb-12 text-xs font-sans">
      {/* Visual Scrolling Hint */}
      <div className="absolute right-2 top-32 z-40 animate-pulse bg-black/80 text-white px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg backdrop-blur-sm pointer-events-none">
        <span>⟷</span> Scroll Data
      </div>

      {/* Header Area has been completely removed as requested */}

      {/* Spreadsheet Main Container */}
      <div className="w-full overflow-x-auto overflow-y-visible border-black">
        <table className="min-w-max text-left border-collapse">
          <thead className="z-40">
            {/* ROW 1: Market Capitalization */}
            <tr>
              <th style={numColStyle}>1</th>
              <th style={qColStyle}>Does the firm pass minimum quality hurdle?</th>
              <th style={{ ...badgeColStyle, backgroundColor: '#92D050' }}>YES</th>
              <th style={{ border: 'none', minWidth: '6px' }}></th>
              <th colSpan={4} style={{ ...thStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}>Market Capitalization (Rs Crore)</th>
              <th colSpan={3} style={{ ...thStyle, backgroundColor: 'white', color: 'black', textAlign: 'center', fontWeight: 'bold' }}>230242</th>
              <th colSpan={3} style={{ border: 'none' }}></th>
            </tr>
            {/* ROW 2: Years Timeline */}
            <tr>
              <th style={numColStyle}></th>
              <th style={{ ...qColStyle, borderTop: 'none', borderBottom: 'none' }}></th>
              <th style={{ ...badgeColStyle, borderTop: 'none', borderBottom: 'none', backgroundColor: 'transparent' }}></th>
              <th style={{ border: 'none' }}></th>
              {years.map(y => (
                <th key={y} style={{ ...thStyle, backgroundColor: 'black', color: 'white', textAlign: 'center', width: '70px', minWidth: '70px' }}>{y}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* ROW 3: Q2 */}
            <tr>
              <td style={numColStyle}>2</td>
              <td style={qColStyle}>Has the firm ever made any Net Profit?</td>
              <td style={{ ...badgeColStyle, backgroundColor: '#92D050' }}>YES</td>
              <td style={{ border: 'none' }}></td>
              {["1745", "1,939", "2,039", "2,156", "2,705", "3,139", "3,031", "4,106", "5,460", "3,667"].map((v, i) => (
                <td key={i} style={{ ...tdStyle, backgroundColor: [1,2,3,4,5,7,8].includes(i) ? '#c6efce' : [6,9].includes(i) ? '#f8cbad' : 'white', textAlign: 'center' }}>{v}</td>
              ))}
            </tr>
            {/* ROW 4: Q3 */}
            <tr>
              <td style={numColStyle}>3</td>
              <td style={qColStyle}>Does the company generate consistent cash flow from operations?</td>
              <td style={{ ...badgeColStyle, backgroundColor: '#92D050' }}>YES</td>
              <td style={{ border: 'none' }}></td>
              {["2243", "1527", "2113", "2470", "2632", "3683", "986", "4193", "6104", "4424"].map((v, i) => (
                <td key={i} style={{ ...tdStyle, textAlign: 'center' }}>{v}</td>
              ))}
            </tr>
            {/* ROW 5: Q4 */}
            <tr>
              <td style={numColStyle}>4</td>
              <td style={qColStyle}>Are returns on equity consistently above 15% with reasonable leverage?</td>
              <td style={{ ...badgeColStyle, backgroundColor: '#92D050' }}>YES</td>
              <td style={{ border: 'none' }}></td>
              {["27%", "26%", "24%", "23%", "27%", "25%", "22%", "26%", "29%", "19%"].map((v, i) => (
                <td key={i} style={{ ...tdStyle, textAlign: 'center' }}>{v}</td>
              ))}
            </tr>
            {/* ROW 6: Q5 */}
            <tr>
              <td style={numColStyle}>5</td>
              <td style={qColStyle}>Is earnings growth consistent or erratic?</td>
              <td style={{ ...badgeColStyle, backgroundColor: '#FFFF00' }}>CONSISTENT</td>
              <td style={{ border: 'none' }}></td>
              {["", "11%", "5%", "6%", "25%", "16%", "-3%", "36%", "33%", "-33%"].map((v, i) => (
                <td key={i} style={{ ...tdStyle, backgroundColor: i===0 ? 'black' : [6,9].includes(i) ? '#f8cbad' : 'white', textAlign: 'center' }}>{v}</td>
              ))}
            </tr>
            {/* ROW 7: Q5 Sub */}
            <tr>
              <td style={{ ...numColStyle, borderTop: 'none', borderBottom: 'none' }}></td>
              <td style={{ ...qColStyle, borderTop: 'none', borderBottom: 'none' }}></td>
              <td style={{ ...badgeColStyle, borderTop: 'none', borderBottom: 'none', backgroundColor: 'transparent' }}></td>
              <td style={{ border: 'none' }}></td>
              <td colSpan={2} style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}>NET PROFITS CAGR</td>
              <td style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>3-YR</td>
              <td style={{ ...tdStyle, backgroundColor: '#f8cbad', textAlign: 'center' }}>7%</td>
              <td style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>5-YR</td>
              <td style={{ ...tdStyle, backgroundColor: '#f8cbad', textAlign: 'center' }}>6%</td>
              <td style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>7-YR</td>
              <td style={{ ...tdStyle, backgroundColor: '#f8cbad', textAlign: 'center' }}>9%</td>
              <td style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>10-YR</td>
              <td style={{ ...tdStyle, backgroundColor: '#f8cbad', textAlign: 'center' }}>9%</td>
            </tr>
            {/* ROW 8: Q6 */}
            <tr>
              <td style={numColStyle}>6</td>
              <td style={qColStyle}>How clean is the balance sheet?</td>
              <td style={{ ...badgeColStyle, backgroundColor: '#FFFF00' }}>LOW-DEBT</td>
              <td style={{ border: 'none' }}></td>
              <td colSpan={2} style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}>FINANCIAL LEVERAGE=</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>1.56</td>
              <td colSpan={3} style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}>DEBT TO EQUITY RATIO=</td>
              <td colSpan={2} style={{ ...tdStyle, textAlign: 'center' }}>0.118057</td>
              <td style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>ICR</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>29.62</td>
            </tr>
            {/* ROW 9: Qc */}
            <tr>
              <td style={numColStyle}>c</td>
              <td style={qColStyle}>Do you understand the debt?</td>
              <td style={{ ...badgeColStyle, backgroundColor: '#FFFF00' }}>YES</td>
              <td style={{ border: 'none' }}></td>
              <td colSpan={6} style={{ border: 'none' }}></td>
              <td colSpan={3} style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>FREE CASH FLOW TO SALES</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>7.50%</td>
            </tr>
            {/* ROW 10: Q7 */}
            <tr>
              <td style={numColStyle}>7</td>
              <td style={qColStyle}>Does the firm generate free cash flow?</td>
              <td style={{ ...badgeColStyle, backgroundColor: '#92D050' }}>YES</td>
              <td style={{ border: 'none' }}></td>
              {["", "1154.2", "176.9", "278.52", "2145.07", "3263.13", "266.14", "2490.85", "2195.66", "2768.02"].map((v, i) => (
                <td key={i} style={{ ...tdStyle, backgroundColor: i===0 ? 'black' : 'white', textAlign: 'center' }}>{v}</td>
              ))}
            </tr>
            {/* ROW 11: Q8 */}
            <tr>
              <td style={numColStyle}>8</td>
              <td style={qColStyle}>Price To Earnings Ratio</td>
              <td style={{ ...badgeColStyle, backgroundColor: '#c6efce' }}>FAVORABLE</td>
              <td style={{ border: 'none' }}></td>
              {["47.73", "53.09", "52.71", "66.41", "59.09", "77.53", "97.48", "64.51", "50.01", "61.22"].map((v, i) => (
                <td key={i} style={{ ...tdStyle, textAlign: 'center' }}>{v}</td>
              ))}
            </tr>
            {/* ROW 12: Q8 Sub */}
            <tr>
              <td style={{ ...numColStyle, borderTop: 'none', borderBottom: 'none' }}></td>
              <td style={{ ...qColStyle, borderTop: 'none', borderBottom: 'none' }}></td>
              <td style={{ ...badgeColStyle, borderTop: 'none', borderBottom: 'none', backgroundColor: 'transparent' }}></td>
              <td style={{ border: 'none' }}></td>
              <td colSpan={2} style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}>CURRENT P/E RATIO</td>
              <td style={{ ...tdStyle, backgroundColor: '#c6efce', textAlign: 'center' }}>59.88</td>
              <td style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>3-YR</td>
              <td style={{ ...tdStyle, backgroundColor: '#c6efce', textAlign: 'center' }}>58.58</td>
              <td style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>5-YR</td>
              <td style={{ ...tdStyle, backgroundColor: '#c6efce', textAlign: 'center' }}>70.15</td>
              <td style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>10-YR</td>
              <td style={{ ...tdStyle, backgroundColor: '#c6efce', textAlign: 'center' }}>62.98</td>
              <td style={{ ...tdStyle, backgroundColor: 'white', borderRight: '1px solid black', textAlign: 'center' }}>Current</td>
            </tr>
            {/* ROW 13: Q9 */}
            <tr>
              <td style={numColStyle}>9</td>
              <td style={qColStyle}>Share Price</td>
              <td style={{ ...badgeColStyle, backgroundColor: 'white' }}></td>
              <td style={{ border: 'none' }}></td>
              {["868", "1,074", "1,120", "1,493", "1,667", "2,537", "3,080", "2,762", "2,847", "2,341"].map((v, i) => (
                <td key={i} style={{ ...tdStyle, backgroundColor: i===0?'white' : [7,9].includes(i)?'#f8cbad' : '#c6efce', textAlign: 'center' }}>{v}</td>
              ))}
              <td style={{ ...tdStyle, backgroundColor: '#c6efce', textAlign: 'center' }}>2,401</td>
            </tr>
            {/* ROW 14: Q10 */}
            <tr>
              <td style={numColStyle}>10</td>
              <td style={qColStyle}>How much other is there?(One-time charges, etc)</td>
              <td style={{ ...badgeColStyle, backgroundColor: '#FFFF00' }}>NONE</td>
              <td style={{ border: 'none' }}></td>
              <td colSpan={10} style={{ border: 'none' }}></td>
            </tr>
            {/* ROW 15: Q10 Sub (NSI) */}
            <tr>
              <td style={{ ...numColStyle, borderTop: 'none', borderBottom: 'none' }}></td>
              <td style={{ ...qColStyle, borderTop: 'none', borderBottom: 'none' }}></td>
              <td style={{ ...badgeColStyle, borderTop: 'none', borderBottom: 'none', backgroundColor: 'transparent' }}></td>
              <td style={{ border: 'none' }}></td>
              <td style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>NSI</td>
              <td style={{ ...tdStyle, backgroundColor: '#c6efce', textAlign: 'center' }}>0</td>
              {years.slice(0, 8).map(y => <td key={y} style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>{y}</td>)}
            </tr>
            {/* ROW 16: Q11 */}
            <tr>
              <td style={numColStyle}>11</td>
              <td style={qColStyle}>Has the number of shares outstanding increased markedly over the past several years?</td>
              <td style={{ ...badgeColStyle, backgroundColor: '#92D050' }}>NO</td>
              <td style={{ border: 'none' }}></td>
              <td colSpan={2} style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}>%change</td>
              {Array(8).fill("0.00%").map((v, i) => <td key={i} style={{ ...tdStyle, textAlign: 'center' }}>{v}</td>)}
            </tr>
            {/* ROW 17: Q11 Sub 1 */}
            <tr>
              <td colSpan={3} style={{ ...qColStyle, color: '#dc2626', fontWeight: 'bold', left: 0, width: '260px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                Assuming no big acquisitions, if shares outstanding are consistently increasing around by more than 2% per year, think long and hard before investing the firm
              </td>
              <td style={{ border: 'none' }}></td>
              <td colSpan={2} style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}>No. of Equity Shares</td>
              {Array(8).fill("95.92").map((v, i) => <td key={i} style={{ ...tdStyle, textAlign: 'center' }}>{v}</td>)}
            </tr>
            {/* ROW 18: Q11 Sub 2 */}
            <tr>
              <td colSpan={3} style={{ ...qColStyle, borderTop: 'none', left: 0, width: '260px', whiteSpace: 'normal' }}></td>
              <td style={{ border: 'none' }}></td>
              <td colSpan={2} style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}>New Bonus Shares</td>
              {Array(8).fill("0").map((v, i) => <td key={i} style={{ ...tdStyle, textAlign: 'center' }}>{v}</td>)}
            </tr>
            {/* ROW 19: Q11 Sub 3 */}
            <tr>
              <td colSpan={3} style={{ ...qColStyle, borderTop: 'none', left: 0, width: '260px', whiteSpace: 'normal' }}></td>
              <td style={{ border: 'none' }}></td>
              <td colSpan={2} style={{ ...tdStyle, backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}>Face value</td>
              {Array(8).fill("1").map((v, i) => <td key={i} style={{ ...tdStyle, textAlign: 'center' }}>{v}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

