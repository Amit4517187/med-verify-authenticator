import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Activity, 
  Map as MapIcon, 
  Database,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Globe
} from "lucide-react";

// Rebuilt without Recharts to ensure stability, using CSS for visuals instead
const CrisisInsights = () => {
  const [riskValue, setRiskValue] = useState("--");

  return (
    <div className="min-h-screen bg-[#0A0F10] text-[#e0e3e5] pt-16 selection:bg-[#41eec2] selection:text-[#00382b]">
      {/* Premium Sub-Nav Simulation */}
      <div className="h-12 border-b border-[#2d3133] bg-[#0A0F10] px-6 hidden md:flex items-center gap-8">
          <div className="px-2 py-0.5 border border-dashed border-[#41eec2] rounded text-[#41eec2] font-bold text-[10px] tracking-tight flex items-center gap-2">
            <Shield className="w-3 h-3" />
            MedVerify 2026
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8e9198]">
            <span className="hover:text-white cursor-pointer transition-colors">Verify</span>
            <span className="hover:text-white cursor-pointer transition-colors">Dashboard</span>
            <span className="text-[#41eec2] border-b border-[#41eec2] pb-4 mt-4">History</span>
            <span className="hover:text-white cursor-pointer transition-colors">Inventory</span>
          </div>
      </div>

      <main className="max-w-[1440px] mx-auto p-8 space-y-8">
        {/* Global Impact Report Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e9c400]">Global Impact Report</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Counterfeit Prevalence<span className="text-[#41eec2]">.</span></h1>
          </div>
          <div className="bg-[#0a2540] border border-[#2d3133] p-4 rounded-xl flex items-center gap-4 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#41eec2]">2026 Live Detections</p>
              <div className="text-2xl font-bold">1.2M Units</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#41eec2]/10 flex items-center justify-center text-[#41eec2] border border-[#41eec2]/20 shadow-[0_0_15px_rgba(65,238,194,0.2)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Regional Heatmap Section */}
          <div className="lg:col-span-8 bg-[#101415] border border-[#2d3133] rounded-2xl overflow-hidden relative group shadow-2xl">
             <div className="p-6 border-b border-[#2d3133] flex justify-between items-center bg-gradient-to-r from-[#1d2022] to-transparent">
               <h2 className="text-xl font-bold">Regional Heatmap: India</h2>
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#93000a]/10 border border-[#93000a]/30 text-[10px] font-bold text-[#ffb4ab]">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                 High Risk Zones
               </div>
             </div>
             
             <div className="aspect-[16/9] relative bg-[#0B0F10] flex items-center justify-center p-12">
                <div className="relative w-full h-full opacity-40">
                   <img 
                    src="https://lh3.googleusercontent.com/aida/ADBb0uhakNobOx_GcT6yRlWXB2Vq3818BgO-oFq1HjWxIy6QjN_RO_OCF-cz-4eNdBefwI4nbn-gh0w7ZgBZmobzLgdfqPo-H-Dc-o4Jf2dVEJHfu_dWUABQFt4JpcP5sKtrRXhEQ8VBTZajWmrkU5IKcx-JaugsaTAUxs-RFHtRY4uc7agU9ZebZR1_zHqA5Uc5oP3ND1XZmmMMcfxpjyLMoOW6uQjfrSZFdmwCNWVDyCJAjiTg2oXNK_z2al0" 
                    className="w-full h-full object-contain filter grayscale invert brightness-200 contrast-150"
                    alt="Map"
                   />
                </div>

                {/* Callouts */}
                <div className="absolute top-[35%] left-[48%]">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="bg-[#0A0F10]/95 border border-[#2d3133] px-3 py-1.5 rounded-lg backdrop-blur-md shadow-2xl">
                       <p className="text-[7px] text-[#8e9198] uppercase font-bold tracking-widest">NCR Region</p>
                       <p className="text-xs font-bold text-[#41eec2]">14.2% Risk</p>
                    </div>
                    <div className="w-[1px] h-10 bg-gradient-to-b from-[#41eec2] to-transparent"></div>
                  </motion.div>
                </div>

                <div className="absolute bottom-[25%] left-[52%]">
                   <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center"
                   >
                    <div className="w-[1px] h-10 bg-gradient-to-t from-[#e9c400] to-transparent"></div>
                    <div className="bg-[#0A0F10]/95 border border-[#2d3133] px-3 py-1.5 rounded-lg backdrop-blur-md shadow-2xl">
                       <p className="text-[7px] text-[#8e9198] uppercase font-bold tracking-widest">Telangana Hub</p>
                       <p className="text-xs font-bold text-[#e9c400]">8.7% Risk</p>
                    </div>
                  </motion.div>
                </div>

                <div className="absolute bottom-6 left-6 flex items-center gap-6 text-[8px] font-bold text-[#8e9198] uppercase tracking-[0.2em]">
                  <span>Source: CDSCO 2026</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#41eec2]"></span> Verified</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#93000a]"></span> Alerted</div>
                  </div>
                </div>
             </div>
          </div>

          {/* Risk Calculator Section */}
          <div className="lg:col-span-4 h-full">
             <div className="bg-[#101415] border border-[#2d3133] rounded-2xl p-8 relative overflow-hidden group h-full flex flex-col justify-between shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#e9c400]">Risk Calculator</h2>
                    <Activity className="w-6 h-6 text-[#e9c400] opacity-50" />
                  </div>
                  <p className="text-[11px] text-[#8e9198] leading-relaxed">Calculate the probability of counterfeit exposure based on local supply chain integrity.</p>
                  
                  <div className="space-y-5 pt-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#8e9198]">Current City</label>
                      <div className="relative">
                        <select className="w-full bg-[#1d2022] border border-[#2d3133] rounded-xl py-3.5 px-5 text-sm outline-none appearance-none cursor-pointer focus:border-[#e9c400] transition-all">
                          <option>Mumbai</option>
                          <option>Delhi</option>
                          <option>Hyderabad</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e9198]" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#8e9198]">Pharmacy Type</label>
                      <div className="grid grid-cols-2 gap-2">
                         <button className="py-3 rounded-xl border border-[#41eec2] bg-[#41eec2]/10 text-[#41eec2] text-[10px] font-bold uppercase tracking-widest">Hospital</button>
                         <button className="py-3 rounded-xl border border-[#2d3133] bg-transparent text-[#8e9198] text-[10px] font-bold uppercase tracking-widest">Retailer</button>
                      </div>
                    </div>

                    <button 
                      onClick={() => setRiskValue("14.2%")}
                      className="w-full py-4 bg-[#e9c400] text-[#0A0F10] font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-[#ffe16d] transition-all shadow-[0_0_20px_rgba(233,196,0,0.1)]"
                    >
                      Run Risk Diagnostic
                    </button>
                  </div>
                </div>

                <div className="pt-8 text-center border-t border-[#2d3133] mt-8">
                   <div className="text-6xl font-bold text-white tracking-tighter">{riskValue}</div>
                   <p className="text-[9px] font-bold text-[#8e9198] uppercase tracking-[0.2em] mt-2">Probability Result</p>
                </div>
             </div>
          </div>
        </div>

        {/* Timeline Summary - Simpler visual to avoid chart crashes */}
        <div className="bg-[#101415] border border-[#2d3133] rounded-2xl p-8 shadow-xl">
           <h3 className="text-3xl font-bold text-center mb-12">Seizure Timeline <span className="text-[#41eec2]">2020-2026</span></h3>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { year: "2020", title: "Pandemic Surge", color: "bg-[#2d3133]" },
                { year: "2022", title: "Digital Enforcement", color: "bg-[#2d3133]" },
                { year: "2024", title: "AI Integration", color: "bg-[#2d3133]" },
                { year: "2026", title: "Global Precision", color: "bg-[#41eec2]" }
              ].map((item, i) => (
                <div key={i} className={`p-6 rounded-xl border ${item.year === '2026' ? 'border-[#41eec2]/30 bg-[#41eec2]/5' : 'border-[#2d3133] bg-[#1d2022]'}`}>
                  <div className={`w-2 h-2 rounded-full ${item.color} mb-4`}></div>
                  <p className="text-[10px] font-bold text-[#8e9198] mb-1">{item.year}</p>
                  <h4 className="text-sm font-bold">{item.title}</h4>
                </div>
              ))}
           </div>
        </div>

        {/* Documentation Sources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
           <div className="flex items-start gap-4 p-6 bg-[#1d2022]/40 rounded-2xl border border-[#2d3133] hover:border-[#41eec2]/30 transition-all">
              <div className="p-3 bg-[#41eec2]/10 rounded-xl text-[#41eec2]">
                 <Database className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-[11px] font-bold uppercase tracking-widest text-white">CDSCO Enforcement Records</h4>
                 <p className="text-[10px] text-[#8e9198]">Central Drugs Standard Control Organization. Vigilance Report 2025.</p>
                 <button className="text-[9px] font-bold text-[#41eec2] mt-2 flex items-center gap-1">VIEW CITATION <ArrowRight className="w-3 h-3" /></button>
              </div>
           </div>
           <div className="flex items-start gap-4 p-6 bg-[#1d2022]/40 rounded-2xl border border-[#2d3133] hover:border-[#e9c400]/30 transition-all">
              <div className="p-3 bg-[#e9c400]/10 rounded-xl text-[#e9c400]">
                 <Globe className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-[11px] font-bold uppercase tracking-widest text-white">WHO Global Surveillance</h4>
                 <p className="text-[10px] text-[#8e9198]">World Health Organization Falsified Products System. Report 2026.</p>
                 <button className="text-[9px] font-bold text-[#e9c400] mt-2 flex items-center gap-1">VIEW CITATION <ArrowRight className="w-3 h-3" /></button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default CrisisInsights;
