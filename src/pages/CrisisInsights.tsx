import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  ChevronDown, 
  Activity, 
  Database,
  ArrowRight,
  CheckCircle2,
  Globe
} from "lucide-react";

const CrisisInsights = () => {
  const [riskValue, setRiskValue] = useState("--");

  return (
    <div className="min-h-screen bg-[#060809] text-[#e0e3e5] pt-20 selection:bg-[#41eec2] selection:text-[#00382b] font-sans">
      {/* 2026 Header Accent */}
      <div className="h-14 border-b border-white/5 bg-[#060809]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-16 z-40">
          <div className="flex items-center gap-10">
            <div className="px-3 py-1 border border-[#41eec2]/40 rounded bg-[#41eec2]/5 text-[#41eec2] font-bold text-[10px] tracking-[0.1em] flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" />
              MEDVERIFY 2026
            </div>
            <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.25em] text-[#8e9198]">
              <span className="hover:text-white cursor-pointer transition-colors">Verify</span>
              <span className="hover:text-white cursor-pointer transition-colors">Dashboard</span>
              <span className="text-[#41eec2] border-b-2 border-[#41eec2] pb-4 mt-4">History</span>
              <span className="hover:text-white cursor-pointer transition-colors">Inventory</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-teal-400/60 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            System Live
          </div>
      </div>

      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#e9c400] opacity-80">Global Impact Report</p>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-none">Counterfeit <br/>Prevalence<span className="text-[#41eec2]">.</span></h1>
          </div>
          <div className="bg-gradient-to-br from-[#0a2540] to-[#060809] border border-white/10 p-6 rounded-2xl flex items-center gap-6 relative overflow-hidden group shadow-2xl">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#41eec2]/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#41eec2] mb-1">2026 Live Detections</p>
              <div className="text-4xl font-bold tracking-tight">1.2M Units</div>
            </div>
            <div className="w-14 h-14 rounded-xl bg-[#41eec2]/10 flex items-center justify-center text-[#41eec2] border border-[#41eec2]/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Visual: India Map */}
          <div className="lg:col-span-8 bg-[#0C1012] border border-white/5 rounded-3xl overflow-hidden relative shadow-2xl group">
             <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#111618]">
               <div>
                <h2 className="text-2xl font-bold tracking-tight">Regional Heatmap: India</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Satellite Intelligence Layer v4.2</p>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400">
                 <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                 HIGH RISK ZONES ACTIVE
               </div>
             </div>
             
             <div className="aspect-square md:aspect-video relative bg-[#060809] flex items-center justify-center overflow-hidden">
                {/* Generated High-Fidelity Map Asset */}
                <div className="absolute inset-0 p-4">
                   <img 
                    src="/pharma_map.png" 
                    className="w-full h-full object-contain opacity-80 group-hover:scale-105 transition-transform duration-[10s] ease-out"
                    alt="Pharma Intelligence Map"
                   />
                </div>

                {/* Data Overlays - NCR */}
                <div className="absolute top-[32%] left-[45%]">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="bg-[#060809]/90 border border-[#41eec2]/30 px-4 py-2 rounded-xl backdrop-blur-xl shadow-2xl">
                       <p className="text-[8px] text-[#8e9198] uppercase font-bold tracking-[0.2em]">NCR Hub</p>
                       <p className="text-lg font-bold text-[#41eec2] tracking-tighter">14.2% Risk</p>
                    </div>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-[#41eec2] to-transparent shadow-[0_0_15px_#41eec2]"></div>
                  </motion.div>
                </div>

                {/* Data Overlays - Telangana */}
                <div className="absolute bottom-[28%] left-[52%]">
                   <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center"
                   >
                    <div className="w-[1px] h-12 bg-gradient-to-t from-[#e9c400] to-transparent shadow-[0_0_15px_#e9c400]"></div>
                    <div className="bg-[#060809]/90 border border-[#e9c400]/30 px-4 py-2 rounded-xl backdrop-blur-xl shadow-2xl">
                       <p className="text-[8px] text-[#8e9198] uppercase font-bold tracking-[0.2em]">Telangana Hub</p>
                       <p className="text-lg font-bold text-[#e9c400] tracking-tighter">8.7% Risk</p>
                    </div>
                  </motion.div>
                </div>

                {/* Footer Legend */}
                <div className="absolute bottom-8 left-8 flex items-center gap-10 text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                  <span className="flex items-center gap-2">Source: <span className="text-slate-300">CDSCO 2026 SURVEILLANCE</span></span>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-[#41eec2]"></span> Verified</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-red-600"></span> Alerted</div>
                  </div>
                </div>
             </div>
          </div>

          {/* Risk Calculator Section */}
          <div className="lg:col-span-4 flex flex-col gap-8">
             <div className="bg-gradient-to-b from-[#111618] to-[#0C1012] border border-white/5 rounded-3xl p-10 relative overflow-hidden group flex-1 shadow-2xl">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-[#e9c400] tracking-tight">Risk Calculator</h2>
                    <Activity className="w-8 h-8 text-[#e9c400] animate-pulse opacity-50" />
                  </div>
                  <p className="text-xs text-[#8e9198] leading-relaxed">Probability assessment engine powered by neural risk models. Select region and provider type to generate exposure diagnostic.</p>
                  
                  <div className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8e9198]">Target Region</label>
                      <div className="relative">
                        <select className="w-full bg-[#1d2022] border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none appearance-none cursor-pointer focus:border-[#e9c400] transition-all">
                          <option>Mumbai Metropolitan</option>
                          <option>Delhi NCR</option>
                          <option>Hyderabad Hub</option>
                          <option>Bengaluru Tech Hub</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8e9198]" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8e9198]">Pharmacy Protocol</label>
                      <div className="grid grid-cols-2 gap-3">
                         <button className="py-4 rounded-2xl border border-[#41eec2] bg-[#41eec2]/10 text-[#41eec2] text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-[#41eec2]/20">Hospital</button>
                         <button className="py-4 rounded-2xl border border-white/5 bg-transparent text-[#8e9198] text-[10px] font-bold uppercase tracking-widest transition-all hover:border-white/20">Retailer</button>
                      </div>
                    </div>

                    <button 
                      onClick={() => setRiskValue("14.2%")}
                      className="w-full py-5 bg-[#e9c400] text-[#060809] font-bold text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-[#ffe16d] transition-all shadow-[0_0_40px_rgba(233,196,0,0.2)] active:scale-[0.98]"
                    >
                      Run Risk Diagnostic
                    </button>
                  </div>
                </div>

                <div className="pt-12 text-center border-t border-white/5 mt-10">
                   <div className="text-7xl font-bold text-white tracking-tighter leading-none">{riskValue}</div>
                   <p className="text-[10px] font-bold text-[#8e9198] uppercase tracking-[0.25em] mt-4 opacity-60">Probability Diagnostic Output</p>
                </div>
             </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-[#0C1012] border border-white/5 rounded-3xl p-10 lg:p-16 shadow-2xl">
           <div className="max-w-4xl mx-auto space-y-16">
              <h3 className="text-5xl font-bold text-center tracking-tight">Seizure Timeline <span className="text-[#41eec2] block mt-2">2020 — 2026</span></h3>
              
              <div className="relative">
                {/* Vertical Line for Mobile, Horizontal for Desktop */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white/5 hidden lg:block"></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32">
                  {[
                    { year: "2020", title: "Pandemic Surge", desc: "300% increase in fake antiviral circulation during global supply chain disruption.", align: "lg:text-right" },
                    { year: "2022", title: "Digital Enforcement", desc: "Initial QR integration mandates by CDSCO reduce retail fraud by 18%.", align: "lg:text-left lg:mt-24" },
                    { year: "2024", title: "AI Integration", desc: "MedVerify prototype blocks 400k units from entering tier-1 hospital inventory.", align: "lg:text-right lg:mt-24" },
                    { year: "2026", title: "Global Precision", desc: "Real-time molecular tracing achieves 99.9% verification accuracy across major hubs.", align: "lg:text-left lg:mt-24", highlight: true }
                  ].map((item, i) => (
                    <div key={i} className={`relative p-8 rounded-3xl border transition-all duration-500 ${item.highlight ? 'border-[#41eec2]/30 bg-[#41eec2]/5 shadow-[0_0_40px_rgba(65,238,194,0.05)]' : 'border-white/5 bg-[#111618] hover:border-white/20'} ${item.align}`}>
                      <div className={`text-[11px] font-bold mb-3 ${item.highlight ? 'text-[#41eec2]' : 'text-slate-500'} tracking-widest uppercase`}>{item.year}</div>
                      <h4 className="text-2xl font-bold mb-4 tracking-tight text-white">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-xs inline-block">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>

        {/* Global Action Footer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
           <div className="flex items-start gap-6 p-8 bg-[#111618] rounded-3xl border border-white/5 group hover:border-[#41eec2]/30 transition-all">
              <div className="p-4 bg-[#41eec2]/10 rounded-2xl text-[#41eec2] border border-[#41eec2]/20">
                 <Database className="w-7 h-7" />
              </div>
              <div className="space-y-3">
                 <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white">CDSCO Enforcement Intelligence</h4>
                 <p className="text-xs text-slate-500 leading-relaxed">Central Drugs Standard Control Organization. Real-time data sync with national pharmaceutical crime database.</p>
                 <button className="text-[10px] font-bold text-[#41eec2] mt-2 flex items-center gap-2 group-hover:translate-x-2 transition-transform uppercase tracking-widest">Protocol Citation <ArrowRight className="w-3.5 h-3.5" /></button>
              </div>
           </div>
           <div className="flex items-start gap-6 p-8 bg-[#111618] rounded-3xl border border-white/5 group hover:border-[#e9c400]/30 transition-all">
              <div className="p-4 bg-[#e9c400]/10 rounded-2xl text-[#e9c400] border border-[#e9c400]/20">
                 <Globe className="w-7 h-7" />
              </div>
              <div className="space-y-3">
                 <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white">WHO International Surveillance</h4>
                 <p className="text-xs text-slate-500 leading-relaxed">Global monitoring of falsified medical products. Cross-border intelligence feed for MedVerify 2026 nodes.</p>
                 <button className="text-[10px] font-bold text-[#e9c400] mt-2 flex items-center gap-2 group-hover:translate-x-2 transition-transform uppercase tracking-widest">Global Citation <ArrowRight className="w-3.5 h-3.5" /></button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default CrisisInsights;
