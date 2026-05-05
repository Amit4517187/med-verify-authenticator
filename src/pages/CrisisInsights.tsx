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
  Info,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from "recharts";

const fakedCategories = [
  { name: "Antibiotics", value: 85, color: "#41eec2" },
  { name: "Analgesics", value: 45, color: "#2d3133" },
  { name: "Anti-virals", value: 65, color: "#2d3133" },
  { name: "Lifestyle", value: 35, color: "#e9c400" },
  { name: "Other", value: 25, color: "#2d3133" },
];

const supplyData = [
  { name: "Domestic", value: 72 },
  { name: "Cross-Border", value: 28 },
];

const timeline = [
  { year: "2020", title: "Pandemic Surge", desc: "300% increase in fake antiviral circulation during global supply chain disruption.", active: false },
  { year: "2022", title: "Digital Enforcement", desc: "Initial QR integration mandates by CDSCO reduce retail fraud by 18%.", active: false },
  { year: "2024", title: "AI Integration", desc: "MedVerify prototype blocks 400k units from entering tier-1 hospital inventory.", active: false },
  { year: "2026", title: "Global Precision", desc: "Real-time molecular tracing achieves 99.9% verification accuracy across major hubs.", active: true },
];

const CrisisInsights = () => {
  const [riskValue, setRiskValue] = useState("--");

  return (
    <div className="min-h-screen bg-[#0A0F10] text-[#e0e3e5] font-sans selection:bg-[#41eec2] selection:text-[#00382b]">
      {/* Premium Navbar - Matching the screenshot */}
      <nav className="h-16 border-b border-[#2d3133] bg-[#0A0F10]/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="px-3 py-1.5 border border-dashed border-[#41eec2] rounded text-[#41eec2] font-display font-bold text-sm tracking-tight flex items-center gap-2">
            <Shield className="w-4 h-4" />
            MedVerify 2026
          </div>
          <div className="hidden md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-[#8e9198]">
            <span className="hover:text-white cursor-pointer transition-colors">Verify</span>
            <span className="hover:text-white cursor-pointer transition-colors">Dashboard</span>
            <span className="text-[#41eec2] border-b-2 border-[#41eec2] pb-5 mt-5">History</span>
            <span className="hover:text-white cursor-pointer transition-colors">Inventory</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e9198]" />
            <input 
              type="text" 
              placeholder="Scan Serial..." 
              className="bg-[#1d2022] border border-[#2d3133] rounded-full py-1.5 pl-10 pr-4 text-xs outline-none focus:border-[#41eec2] transition-all w-64"
            />
          </div>
          <Bell className="w-5 h-5 text-[#8e9198] cursor-pointer hover:text-white transition-colors" />
          <User className="w-5 h-5 text-[#8e9198] cursor-pointer hover:text-white transition-colors" />
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto p-8 space-y-8">
        {/* Global Impact Report Header */}
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e9c400]">Global Impact Report</p>
            <h1 className="text-5xl font-display font-bold tracking-tight">Counterfeit Prevalence<span className="text-[#41eec2]">.</span></h1>
          </div>
          <div className="bg-[#0a2540] border border-[#2d3133] p-4 rounded-xl flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#41eec2]/5 rounded-full blur-2xl group-hover:bg-[#41eec2]/10 transition-all"></div>
            <div className="relative z-10">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#41eec2]">2026 Live Detections</p>
              <div className="text-2xl font-display font-bold">1.2M Units</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#41eec2]/10 flex items-center justify-center text-[#41eec2] border border-[#41eec2]/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Regional Heatmap Section */}
          <div className="lg:col-span-8 bg-[#101415] border border-[#2d3133] rounded-2xl overflow-hidden relative group">
             <div className="p-6 border-b border-[#2d3133] flex justify-between items-center bg-gradient-to-r from-[#1d2022] to-transparent">
               <h2 className="text-xl font-display font-bold">Regional Heatmap: India</h2>
               <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6]/10 border border-[#93000a]/30 text-[10px] font-bold text-[#ffb4ab]">
                   <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                   High Risk Zones
                 </div>
               </div>
             </div>
             
             <div className="aspect-[16/9] relative bg-[#0B0F10] flex items-center justify-center p-12">
                {/* SVG India Map Simulation - High density medical data feel */}
                <div className="relative w-full h-full opacity-60">
                   <img 
                    src="https://lh3.googleusercontent.com/aida/ADBb0uhakNobOx_GcT6yRlWXB2Vq3818BgO-oFq1HjWxIy6QjN_RO_OCF-cz-4eNdBefwI4nbn-gh0w7ZgBZmobzLgdfqPo-H-Dc-o4Jf2dVEJHfu_dWUABQFt4JpcP5sKtrRXhEQ8VBTZajWmrkU5IKcx-JaugsaTAUxs-RFHtRY4uc7agU9ZebZR1_zHqA5Uc5oP3ND1XZmmMMcfxpjyLMoOW6uQjfrSZFdmwCNWVDyCJAjiTg2oXNK_z2al0" 
                    className="w-full h-full object-contain filter brightness-50"
                    alt="Map"
                   />
                </div>

                {/* Specific Callouts from the screenshot */}
                <div className="absolute top-[40%] left-[45%]">
                  <div className="flex flex-col items-center">
                    <div className="bg-[#0A0F10]/90 border border-[#2d3133] px-3 py-1 rounded-lg backdrop-blur-md shadow-2xl">
                       <p className="text-[8px] text-[#8e9198] uppercase font-bold tracking-tighter">NCR Region</p>
                       <p className="text-xs font-bold text-[#41eec2]">14.2% Risk</p>
                    </div>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-[#41eec2] to-transparent"></div>
                  </div>
                </div>

                <div className="absolute bottom-[20%] left-[55%]">
                   <div className="flex flex-col items-center">
                    <div className="w-[1px] h-12 bg-gradient-to-t from-[#e9c400] to-transparent"></div>
                    <div className="bg-[#0A0F10]/90 border border-[#2d3133] px-3 py-1 rounded-lg backdrop-blur-md shadow-2xl">
                       <p className="text-[8px] text-[#8e9198] uppercase font-bold tracking-tighter">Telangana Hub</p>
                       <p className="text-xs font-bold text-[#e9c400]">8.7% Risk</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 flex items-center gap-6 text-[9px] font-bold text-[#8e9198] uppercase tracking-widest">
                  <span>Data Source: CDSCO 2026 Surveillance</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#41eec2]"></span> Verified</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#93000a]"></span> Alerted</div>
                  </div>
                </div>
             </div>
          </div>

          {/* Risk Calculator Section */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-[#101415] border border-[#2d3133] rounded-2xl p-8 relative overflow-hidden group h-full">
                <div className="absolute top-0 right-0 p-8 text-[#e9c400] opacity-10 group-hover:opacity-20 transition-all">
                  <Activity className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-display font-bold text-[#e9c400] mb-2">Risk Calculator</h2>
                <p className="text-xs text-[#8e9198] leading-relaxed mb-8">Calculate the probability of counterfeit exposure based on local supply chain integrity.</p>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#8e9198]">Current City</label>
                    <div className="relative">
                      <select className="w-full bg-[#1d2022] border border-[#2d3133] rounded-xl py-4 px-5 text-sm outline-none appearance-none cursor-pointer focus:border-[#e9c400] transition-all">
                        <option>Mumbai</option>
                        <option>Delhi</option>
                        <option>Baddi</option>
                        <option>Hyderabad</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e9198] pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#8e9198]">Pharmacy Type</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button className="py-3 px-4 rounded-xl border border-[#41eec2] bg-[#41eec2]/10 text-[#41eec2] text-xs font-bold transition-all">Hospital</button>
                       <button className="py-3 px-4 rounded-xl border border-[#2d3133] bg-transparent text-[#8e9198] text-xs font-bold hover:border-white transition-all">Retailer</button>
                    </div>
                  </div>

                  <button 
                    onClick={() => setRiskValue("14.2%")}
                    className="w-full py-4 bg-[#e9c400] text-[#0A0F10] font-display font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(233,196,0,0.2)]"
                  >
                    Run Risk Diagnostic
                  </button>

                  <div className="pt-8 text-center border-t border-[#2d3133] mt-8">
                     <div className="text-5xl font-display font-black text-white">{riskValue}</div>
                     <p className="text-[10px] font-bold text-[#8e9198] uppercase tracking-widest mt-2">Waiting for input</p>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Section: Charts and Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#101415] border border-[#2d3133] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-bold text-[#8e9198] uppercase tracking-widest">Faked Categories</h3>
              <Activity className="w-4 h-4 text-[#41eec2]" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fakedCategories} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {fakedCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#8e9198' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#101415] border border-[#2d3133] rounded-2xl p-6">
             <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-bold text-[#8e9198] uppercase tracking-widest">Supply Origin</h3>
              <div className="w-2 h-2 rounded-full bg-[#e9c400]"></div>
            </div>
            <div className="flex items-center justify-center h-48 relative">
               <div className="absolute text-center">
                  <div className="text-3xl font-display font-black">72%</div>
                  <div className="text-[8px] text-[#8e9198] uppercase font-bold tracking-widest">Domestic</div>
               </div>
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={supplyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#e9c400" />
                    <Cell fill="#2d3133" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8 mt-4 text-[9px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded bg-[#e9c400]"></span> Domestic Hubs <span className="text-[#8e9198] ml-2">72%</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded bg-[#2d3133]"></span> Cross-Border <span className="text-[#8e9198] ml-2">28%</span></div>
            </div>
          </div>

          <div className="bg-[#101415] border border-[#2d3133] rounded-2xl p-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4">
                <div className="bg-[#93000a]/20 text-[#ffb4ab] text-[8px] font-bold px-2 py-1 rounded uppercase tracking-widest">Latest Raid</div>
             </div>
             <div className="mt-8 space-y-4">
                <h3 className="text-4xl font-display font-black leading-[0.9]">Baddi Hub Operation</h3>
                <div className="aspect-video bg-[#0A0F10] rounded-xl relative overflow-hidden border border-[#2d3133]">
                   <img src="https://images.unsplash.com/photo-1587854230147-81f7d6139f06?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-all duration-700" alt="raid" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F10] to-transparent"></div>
                   <div className="absolute bottom-4 left-4">
                      <p className="text-xl font-bold font-display text-white">4.5M INR Seized</p>
                      <p className="text-[9px] text-[#8e9198] max-w-[200px]">Unauthorized labeling facility neutralized by CDSCO Special Task Force.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Seizure Timeline - Interactive Horizontal */}
        <div className="bg-[#101415] border border-[#2d3133] rounded-2xl p-8">
           <h3 className="text-4xl font-display font-black text-center mb-16">Seizure Timeline <span className="text-[#41eec2]">2020-2026</span></h3>
           
           <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#2d3133]"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {timeline.map((item, i) => (
                    <div key={i} className="relative pt-8 group">
                       {/* Node */}
                       <div className={`absolute top-[-5px] left-0 w-2.5 h-2.5 rounded-full border-2 border-[#0A0F10] ${item.active ? 'bg-[#41eec2] shadow-[0_0_15px_#41eec2]' : 'bg-[#2d3133]'}`}></div>
                       
                       <div className={`p-6 rounded-2xl border transition-all duration-500 ${item.active ? 'bg-[#41eec2]/5 border-[#41eec2]/30' : 'bg-[#1d2022] border-[#2d3133] group-hover:border-[#8e9198]'}`}>
                          <p className={`text-xs font-bold mb-2 ${item.active ? 'text-[#41eec2]' : 'text-[#8e9198]'}`}>{item.year}</p>
                          <h4 className="text-lg font-bold mb-3">{item.title}</h4>
                          <p className="text-[10px] text-[#8e9198] leading-relaxed">{item.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Documentation Sources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
           <div className="flex items-start gap-4 p-6 bg-[#1d2022]/30 rounded-2xl border border-[#2d3133] group hover:bg-[#1d2022]/50 transition-all">
              <div className="p-3 bg-[#41eec2]/10 rounded-xl text-[#41eec2]">
                 <Database className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-sm font-bold uppercase tracking-widest">CDSCO Enforcement Records</h4>
                 <p className="text-[10px] text-[#8e9198]">Central Drugs Standard Control Organization, Ministry of Health & Family Welfare. Annual Vigilance Report 2025.</p>
                 <button className="text-[9px] font-bold text-[#41eec2] flex items-center gap-1 group-hover:translate-x-1 transition-transform">VIEW CITATION <ArrowRight className="w-3 h-3" /></button>
              </div>
           </div>
           <div className="flex items-start gap-4 p-6 bg-[#1d2022]/30 rounded-2xl border border-[#2d3133] group hover:bg-[#1d2022]/50 transition-all">
              <div className="p-3 bg-[#e9c400]/10 rounded-xl text-[#e9c400]">
                 <Globe className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-sm font-bold uppercase tracking-widest">WHO Global Surveillance</h4>
                 <p className="text-[10px] text-[#8e9198]">World Health Organization Substandard and Falsified Medical Products Tracking System. Impact Report 2026.</p>
                 <button className="text-[9px] font-bold text-[#e9c400] flex items-center gap-1 group-hover:translate-x-1 transition-transform">VIEW CITATION <ArrowRight className="w-3 h-3" /></button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default CrisisInsights;
