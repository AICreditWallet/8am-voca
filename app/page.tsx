"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Vapi from '@vapi-ai/web';
import { Phone, Clock, ArrowRight, CheckCircle, Mail, X, ShieldCheck, Activity } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
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
      setIsCalling(false);
    }
  };

  // MAGIC PART: Direct browser-to-table updates
  useEffect(() => {
    vapi.on('message', (message) => {
      if (message.type === 'transcript' && message.role === 'user') {
        const text = message.transcript.toLowerCase();
        
        // Simulating the AI's note-taking in real-time
        if (text.includes("name is") || text.includes("i'm")) {
          const parts = text.split("is ");
          if (parts[1]) setLiveName(parts[1].split(" ")[0]);
        }
        
        if (text.length > 20) {
          setLiveSymptoms(message.transcript);
        }

        if (text.includes("pain") || text.includes("fever") || text.includes("bleeding")) {
          setLivePriority("RED");
        } else if (text.length > 10) {
          setLivePriority("AMBER");
        }
      }
    });

    vapi.on('call-end', () => {
      setIsCalling(false);
      setShowExitPopup(true);
      // Save final result to Supabase
      supabase.from('appointments').insert({
        patient_name: liveName,
        symptoms: liveSymptoms,
        urgency: livePriority,
        status: "BOOKED"
      }).then(() => console.log("Saved to DB"));
    });

    return () => vapi.removeAllListeners();
  }, [liveName, liveSymptoms, livePriority]);

  const LandingPage = () => (
    <div className="min-h-screen bg-white text-[#1A1C1E] font-sans">
      <nav className="max-w-7xl mx-auto px-8 py-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#0052FF] p-2.5 rounded-[14px] shadow-lg shadow-blue-100">
            <Phone className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter">8am Call</span>
        </div>
        <button onClick={() => setView('dashboard')} className="bg-[#F1F4F9] px-7 py-3 rounded-full font-bold text-sm">Clinic Login</button>
      </nav>
      <header className="max-w-7xl mx-auto px-8 pt-16 text-center">
        <h1 className="text-8xl font-black tracking-tight mb-10">End the <span className="text-[#0052FF]">8am Scramble</span>.</h1>
        <p className="text-2xl text-slate-500 mb-14 max-w-2xl mx-auto">Autonomous Voice AI for UK GP surgeries. Handle every call instantly.</p>
        <button onClick={() => setView('dashboard')} className="bg-[#0052FF] text-white px-12 py-6 rounded-[24px] text-xl font-bold shadow-2xl">Live Demo Call <ArrowRight className="ml-2 inline w-6 h-6" /></button>
      </header>
    </div>
  );

  const Dashboard = () => (
    <div className="min-h-screen bg-[#F1F5F9] flex relative">
      <aside className="w-80 bg-white border-r border-slate-200 p-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-[#0052FF] p-2 rounded-xl"><Phone className="text-white w-5 h-5" /></div>
          <span className="text-2xl font-black tracking-tighter">8am Call</span>
        </div>
        <div className="p-4 bg-blue-50 text-[#0052FF] rounded-2xl font-bold flex items-center gap-4"><Clock className="w-5 h-5" /> Live Patient Queue</div>
      </aside>

      <main className="flex-1 p-16">
        <div className="bg-white p-12 rounded-[48px] shadow-xl border-4 border-blue-500 mb-12 text-center relative overflow-hidden">
           <h3 className="text-4xl font-black mb-4">Talk to Sarah Live</h3>
           <p className="text-slate-500 mb-10">Click to start. Watch your clinical notes appear below as you speak.</p>
           <button 
             onClick={isCalling ? () => vapi.stop() : startWebCall}
             className={`${isCalling ? 'bg-red-500' : 'bg-[#0052FF]'} text-white px-12 py-6 rounded-3xl text-2xl font-black shadow-2xl flex items-center justify-center gap-4 mx-auto`}
           >
             {isCalling ? <><X className="w-8 h-8" /> End Call</> : <><Phone className="w-8 h-8" /> Call My Surgery</>}
           </button>
           {isCalling && <div className="mt-8 flex items-center justify-center gap-2 text-blue-600 font-bold"><Activity className="animate-pulse" /> AI is listening...</div>}
        </div>

        <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-black tracking-widest text-slate-400">
              <tr><th className="p-10">Patient Details</th><th className="p-10">Priority</th><th className="p-10">Live Clinical Notes (AI)</th><th className="p-10">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-10 font-black text-xl">{isCalling || liveName !== "Waiting for name..." ? liveName : "No Active Call"}</td>
                <td className="p-10">
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${livePriority === 'RED' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{livePriority}</span>
                </td>
                <td className="p-10 text-slate-500 font-medium italic max-w-md">{liveSymptoms}</td>
                <td className="p-10 font-black text-xs text-[#0052FF] uppercase">{isCalling ? "LIVE" : "WAITING"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      {showExitPopup && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <div className="bg-white max-w-xl w-full p-12 rounded-[48px] shadow-2xl text-center">
            <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"><CheckCircle className="w-10 h-10" /></div>
            <h2 className="text-4xl font-black mb-4">Impressive, right?</h2>
            <p className="mb-10 text-slate-500">We can set this up for your real surgery in under 2 minutes.</p>
            <input type="email" placeholder="Your work email" className="w-full px-8 py-5 bg-slate-50 rounded-3xl font-bold mb-4 text-center border-2 border-slate-100" />
            <button className="w-full bg-[#0052FF] text-white py-6 rounded-3xl font-black text-xl">Get Started</button>
            <button onClick={() => setShowExitPopup(false)} className="mt-4 text-slate-400 font-bold text-sm underline">Close</button>
          </div>
        </div>
      )}
    </div>
  );

  return view === 'landing' ? <LandingPage /> : <Dashboard />;
}
