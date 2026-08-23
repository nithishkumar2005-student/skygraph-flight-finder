"use client";
import { useState, useEffect } from 'react';
import { Plane, Search, Loader2, Database, Globe2, MapPin, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlightApp() {
  const [from, setFrom] = useState('THU');
  const [to, setTo] = useState('GKA');
  const [path, setPath] = useState<any[]>([]);
  const [allAirports, setAllAirports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/airports').then(res => res.json()).then(data => setAllAirports(data));
  }, []);

  const findRoute = async () => {
    setLoading(true);
    const res = await fetch(`/api/flight?from=${from}&to=${to}`);
    const data = await res.json();
    setPath(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col lg:flex-row h-screen overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <div className="w-80 bg-black border-r border-zinc-900 p-8 overflow-y-auto hidden lg:block flex-shrink-0">
        <div className="flex items-center gap-2 mb-10">
          <Globe2 className="text-blue-500" size={18} />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Discovery</h2>
        </div>
        <div className="space-y-3">
          {allAirports.map((ap) => (
            <button 
              key={ap.iata}
              onClick={() => { setFrom(to); setTo(ap.iata); }}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${from === ap.iata || to === ap.iata ? 'border-blue-500 bg-blue-500/10' : 'bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900'}`}
            >
              <div className="text-left">
                <div className="font-bold text-zinc-300 text-sm">{ap.city}</div>
                <div className="text-[10px] text-zinc-600">{ap.country}</div>
              </div>
              <div className="text-[10px] font-mono font-bold text-blue-500 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/20">{ap.iata}</div>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-12 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/30 via-black to-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] text-zinc-500 uppercase tracking-widest mb-8">
               <Database size={12} className="text-blue-500"/> CognoDB Instance: Active
             </div>
             <h1 className="text-7xl font-black tracking-tighter mb-4 italic">SkyGraph</h1>
             <p className="text-zinc-500">Intelligent pathfinding across remote global nodes.</p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[40px] p-10 backdrop-blur-3xl mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-black border border-zinc-800 p-8 rounded-3xl">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-4 italic">Origin</span>
                <div className="flex items-center gap-6">
                  <div className="p-3 bg-blue-500/10 rounded-xl"><MapPin className="text-blue-500" /></div>
                  <div className="text-5xl font-black">{from}</div>
                </div>
              </div>
              <div className="bg-black border border-zinc-800 p-8 rounded-3xl">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-4 italic">Destination</span>
                <div className="flex items-center gap-6">
                  <div className="p-3 bg-zinc-800 rounded-xl"><ArrowRight className="text-zinc-500" /></div>
                  <div className="text-5xl font-black text-zinc-300">{to}</div>
                </div>
              </div>
            </div>

            <button onClick={findRoute} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl shadow-blue-600/20 text-lg">
              {loading ? <Loader2 className="animate-spin" /> : <Search size={22} />}
              Analyze Traversal
            </button>
          </div>

          <AnimatePresence>
            {path.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/30 border border-zinc-800 rounded-[40px] p-12 overflow-x-auto">
                <div className="flex items-center gap-8 min-w-max px-4">
                  {path.map((airport, i) => (
                    <div key={i} className="flex items-center gap-8">
                      <div className="flex flex-col items-center">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-5 border ${i === 0 || i === path.length - 1 ? 'bg-blue-600 border-blue-400 shadow-xl' : 'bg-black border-zinc-800'}`}>
                          <Plane size={28} className={i === 0 || i === path.length - 1 ? "text-white" : "text-zinc-700"} />
                        </div>
                        <div className="text-3xl font-black">{airport.iata}</div>
                        <div className="text-[10px] text-zinc-600 font-bold uppercase">{airport.city}</div>
                      </div>
                      {i !== path.length - 1 && <div className="w-8 h-px bg-zinc-800 mb-12" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}