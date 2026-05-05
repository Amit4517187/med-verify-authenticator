import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  TrendingUp, 
  AlertCircle, 
  Map as MapIcon, 
  ShieldAlert, 
  Activity,
  Globe,
  ArrowUpRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "2020", value: 400 },
  { name: "2021", value: 300 },
  { name: "2022", value: 600 },
  { name: "2023", value: 800 },
  { name: "2024", value: 500 },
  { name: "2025", value: 900 },
  { name: "2026", value: 1200 },
];

const CrisisInsights = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0A2540] text-white pt-24 pb-12 px-6 overflow-hidden relative">
      {/* Background Atmospheric Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold tracking-wider uppercase mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            Live Regional Monitoring
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold font-display mb-4 tracking-tight"
          >
            Crisis <span className="text-teal-400">Insights</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl leading-relaxed"
          >
            Real-time data visualization of the counterfeit medicine crisis across the Indian subcontinent. 
            Powered by MedVerify's global verification network.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual: India Interactive Map (Conceptual) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 relative group"
          >
            <Card className="h-full bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden group-hover:border-teal-500/30 transition-all duration-500">
              <CardHeader className="border-b border-white/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-display flex items-center gap-2 text-white">
                    <MapIcon className="w-5 h-5 text-teal-400" />
                    Regional Risk Heatmap
                  </CardTitle>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span> High
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-teal-400"></span> Verified
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 relative flex items-center justify-center min-h-[500px]">
                {/* Simplified Vector Map Animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                   {/* Placeholder for Interactive Map - In a real app, this would be a GeoJSON/D3 component */}
                   <motion.div 
                    animate={{ 
                      filter: ["drop-shadow(0 0 10px rgba(45, 212, 191, 0.2))", "drop-shadow(0 0 30px rgba(45, 212, 191, 0.4))", "drop-shadow(0 0 10px rgba(45, 212, 191, 0.2))"] 
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-4/5 h-4/5 flex items-center justify-center opacity-40"
                   >
                     <Globe className="w-64 h-64 text-teal-500/20" strokeWidth={0.5} />
                   </motion.div>
                   
                   {/* Callout Points */}
                   {[
                     { top: '30%', left: '45%', label: 'NCR - Critical', color: 'bg-red-500' },
                     { top: '60%', left: '35%', label: 'Mumbai - High', color: 'bg-orange-500' },
                     { top: '75%', left: '55%', label: 'Bangalore - Low', color: 'bg-teal-400' },
                   ].map((point, i) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ delay: 1 + (i * 0.2) }}
                       className="absolute flex items-center gap-2 group/point"
                       style={{ top: point.top, left: point.left }}
                     >
                       <span className={`relative flex h-3 w-3`}>
                         <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${point.color} opacity-75`}></span>
                         <span className={`relative inline-flex rounded-full h-3 w-3 ${point.color}`}></span>
                       </span>
                       <div className="hidden group-hover/point:block bg-navy-light/90 border border-white/10 backdrop-blur-md px-2 py-1 rounded text-[10px] whitespace-nowrap shadow-xl">
                         {point.label}
                       </div>
                     </motion.div>
                   ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Key Stats & Calculator */}
          <div className="space-y-6">
            {/* Stat Card 1 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/5 border-white/10 hover:border-teal-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-teal-500/10 rounded-lg">
                      <ShieldAlert className="w-5 h-5 text-teal-400" />
                    </div>
                    <span className="text-[10px] font-bold text-teal-400 flex items-center gap-1 uppercase tracking-widest">
                      <TrendingUp className="w-3 h-3" /> +12.4% vs LY
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Counterfeit Incidence</h3>
                  <div className="text-3xl font-bold font-display text-white">42M+ <span className="text-sm font-normal text-slate-400 italic">Units/Year</span></div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stat Card 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/5 border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1 uppercase tracking-widest">
                      Live Stream
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Verifications</h3>
                  <div className="text-3xl font-bold font-display text-white">1.2s <span className="text-sm font-normal text-slate-400 italic">Avg. Latency</span></div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Risk Projection Chart Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="h-full"
            >
              <Card className="h-full bg-white/5 border-white/10 border-dashed hover:border-solid hover:border-teal-500/30 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold uppercase tracking-widest text-slate-400 flex items-center justify-between">
                    Market Toxicity Projection
                    <ArrowUpRight className="w-4 h-4 text-teal-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] p-0 pb-4 pr-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#2dd4bf', color: '#fff', fontSize: '10px' }}
                        itemStyle={{ color: '#2dd4bf' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#2dd4bf" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Global Action Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-teal-600/20 to-blue-600/20 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-teal-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-bold font-display">Join the Global Network</h4>
              <p className="text-slate-400 text-sm">Contribute anonymous data to strengthen our AI detection models.</p>
            </div>
          </div>
          <button className="px-8 py-4 rounded-xl bg-teal-400 text-navy font-bold hover:bg-teal-300 transition-all shadow-[0_0_30px_rgba(45,212,191,0.2)]">
            Register for Enterprise
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CrisisInsights;
