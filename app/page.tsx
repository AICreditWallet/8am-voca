"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Vapi from '@vapi-ai/web';
import { Phone, Clock, ArrowRight, CheckCircle, Mail, X, ShieldCheck, Activity } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
);

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');

export default function EightAMApp() {
  const [view, setView] = useState('landing'); 
  const [isCalling, setIsCalling] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [email, setEmail] = useState('');
  
  // Real-time states for the demo
  const [liveName, setLiveName] = useState("Waiting for name...");
  const [liveSymptoms, setLiveSymptoms] = useState("Listening for symptoms...");
  const [livePriority, setLivePriority] = useState("TBD");

  const startWebCall = async () => {
    setIsCalling(true);
    setLiveName("Identifying patient...");
    setLiveSymptoms("Analyzing conversation...");
    try {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
    } catch (e) {
      console.error(e);
      setIsCalling(false);
    }
  };

  // The "Magic" listener: Direct browser-to-table updates
  useEffect(() => {
    vapi.on('message', (message: any) => {
      if (message.type === 'transcript' && message.role === 'user') {
        const text = message.transcript.toLowerCase();
        
        // Instant pattern matching for the demo
        if (text.includes("name is") || text.includes("i'm")) {
          const parts = text.split(/is |i'm /);
          if (parts[1]) {
            const name = parts[1].split(/[ ,.!]/)[0];
            setLiveName(name.charAt(0).toUpperCase() + name.slice(1));
          }
        }
        
        if (text.length > 20) {
          setLiveSymptoms(message.transcript);
        }

        if (text.includes("pain") || text.includes("fever") || text.includes("emergency") || text.includes("hurt")) {
          setLivePriority("RED");
        } else if (text.length > 10) {
          setLivePriority("AMBER");
        }
      }
    });

    vapi.on('call-end', () => {
      setIsCalling(false);
      setShowExitPopup(true);
      // Optional: Save final result to Supabase for the clinic
      if (process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
         supabase.from('appointments').insert({
            id: 'demo-' + Date.now(),
            patient_name: liveName,
            symptoms: liveSymptoms,
            urgency: livePriority,
            status: "BOOKED"
          }).then(() => console.log("Saved"));
      }
    });

    return () => {
      vapi.removeAllListeners();
    };
  }, [liveName, liveSymptoms, livePriority]);

  const LandingPage = () => (
    <div className="min-h-screen bg-white text-[#1A1C1E] font-sans">
      <nav className="max-w-7xl mx-auto px-8 py-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#0052FF] p-2.5 rounded-[14px] shadow-lg shadow-blue-100">
            <Phone className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">8am Call</span>
        </div>
        <button onClick={() => setView('dashboard')} className="bg-[#F1F4F9] px-7 py-3 rounded-full font-bold text-sm hover:bg-slate-200 transition">Clinic Login</button>
      </nav>
      <header className="max-w-7xl mx-auto px-8 pt-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0052FF] px-4 py-2 rounded-full text-xs font-black uppercase mb-8">
          <Activity className="w-4 h-4" /> NHS-Ready Voice AI
        </div>
        <h1 className="text-7xl md:text-[100px] font-black tracking-tight leading-[0.85] mb-10 max-w-5xl mx-auto">
          End the <span className="text-[#0052FF]">8am Scramble</span>.
        </h1>
        <p className="text-2xl text-slate-500 mb-14 max-w-2xl mx-auto font-medium">Autonomous Voice AI for UK GP surgeries. Handle every call instantly.</p>
        <button 
          onClick={() => setView('dashboard')}
          className="bg-[#0052FF] text-white px-12 py-6 rounded-[32px] text-2xl font-black shadow-2xl shadow-blue-200 hover:-translate-y-1 transition-all flex items-center justify-center mx-auto gap-3"
        >
          Live Demo Call <ArrowRight className="w-8 h-8" />
        </button>
      </header>
    </div>
  );

  const Dashboard = () => (
    <div className="min-h-screen bg-[#F1F5F9] flex relative font-sans">
      <aside className="w-80 bg-white border-r border-slate-200 p-10 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-[#0052FF] p-2 rounded-xl shadow-lg"><Phone className="text-white w-5 h-5" /></div>
          <span className="text-2xl font-black tracking-tighter uppercase">8am Call</span>
        </div>
        <div className="p-5 bg-blue-50 text-[#0052FF] rounded-[24px] font-bold flex items-center gap-4 border border-blue-100">
          <Clock className="w-6 h-6" /> Live Patient Queue
        </div>
        <div className="mt-auto pt-10">
          <div className="bg-slate-900 p-8 rounded-[32px] text-white">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 text-center">System Status</p>
            <p className="text-sm font-bold text-slate-300 text-center leading-snug">AI Agent Ready for Incoming Calls</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-16">
        <div className="bg-white p-12 rounded-[56px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100 mb-12 text-center relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-4xl font-black mb-4">Speak to Sarah Now</h3>
              <p className="text-slate-500 font-medium mb-12 text-lg">Watch your clinical notes fill in automatically as you talk.</p>
              <button 
                onClick={isCalling ? () => vapi.stop() : startWebCall}
                className={`${isCalling ? 'bg-red-500' : 'bg-[#0052FF]'} text-white px-14 py-7 rounded-[32px] text-3xl font-black shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 mx-auto`}
              >
                {isCalling ? <><X className="w-10 h-10" /> End Call</> : <><Phone className="w-10 h-10" /> Call My Surgery</>}
              </button>
           </div>
           {isCalling && <div className="absolute inset-0 bg-blue-50/30 animate-pulse"></div>}
        </div>

        <div className="bg-white rounded-[48px] shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] font-black tracking-[0.2em] text-slate-400">
              <tr><th className="p-10">Patient Details</th><th className="p-10">Priority</th><th className="p-10">Live Clinical Notes (AI)</th><th className="p-10">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className={isCalling ? "bg-blue-50/20" : ""}>
                <td className="p-10">
                  <p className="font-black text-2xl text-slate-900 tracking-tight">{isCalling || liveName !== "Waiting for name..." ? liveName : "No Active Call"}</p>
                  <p className="text-sm font-bold text-slate-400 mt-1">Live Voice Capture</p>
                </td>
                <td className="p-10">
                   <span className={`px-6 py-2 rounded-full text-[11px] font-black border tracking-widest ${livePriority === 'RED' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{livePriority}</span>
                </td>
                <td className="p-10 text-slate-600 font-medium italic text-lg leading-relaxed max-w-lg">{liveSymptoms}</td>
                <td className="p-10">
                   <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${isCalling ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                     <span className="font-black text-xs text-slate-400 uppercase tracking-widest">{isCalling ? "LIVE" : "IDLE"}</span>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      {showExitPopup && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6 z-50">
          <div className="bg-white max-w-xl w-full p-14 rounded-[64px] shadow-2xl text-center border border-white/20">
            <div className="bg-green-100 text-green-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10"><CheckCircle className="w-12 h-12" /></div>
            <h2 className="text-4xl font-black mb-4 tracking-tight">Pretty impressive?</h2>
            <p className="mb-12 text-slate-500 text-xl font-medium leading-relaxed">Your clinic can be live in under 2 minutes. Just divert your busy lines to our secure UK number.</p>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your work email" className="w-full px-8 py-6 bg-slate-50 rounded-[24px] font-bold mb-5 text-center border-2 border-slate-100 focus:border-blue-500 outline-none text-xl transition-all" />
            <button onClick={() => setShowExitPopup(false)} className="w-full bg-[#0052FF] text-white py-6 rounded-[24px] font-black text-2xl shadow-xl shadow-blue-100 hover:scale-[1.02] transition-transform">Send Dashboard Link</button>
            <button onClick={() => setShowExitPopup(false)} className="mt-8 text-slate-400 font-bold text-sm hover:text-slate-600 uppercase tracking-widest">Close Demo</button>
          </div>
        </div>
      )}
    </div>
  );

  return view === 'landing' ? <LandingPage /> : <Dashboard />;
}
