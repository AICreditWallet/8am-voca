"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Vapi from '@vapi-ai/web';
import { Phone, Calendar, ClipboardList, CheckCircle, BarChart, Clock, Zap, ShieldCheck, ArrowRight, Play, Star, Mail, X, Loader2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Initialize Vapi Web Client
const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');

export default function EightAMApp() {
  const [view, setView] = useState('landing'); 
  const [isCalling, setIsCalling] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [activeCallId, setActiveCallId] = useState(null);

  // 1. Listen for Real-Time Updates from Supabase
  useEffect(() => {
    const channel = supabase
      .channel('realtime_appointments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'appointments' }, (payload) => {
        setAppointments(prev => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'appointments' }, (payload) => {
        setAppointments(prev => prev.map(a => a.id === payload.new.id ? payload.new : a));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // 2. Handle Web Call (Sarah starts talking in browser)
  const startWebCall = async () => {
    setIsCalling(true);
    setAppointments([]); // Clear table for fresh demo
    try {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
    } catch (e) {
      console.error(e);
      setIsCalling(false);
    }
  };

  vapi.on('call-start', () => {
    console.log('Call started');
  });

  vapi.on('call-end', () => {
    setIsCalling(false);
    setShowExitPopup(true);
  });

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

      <header className="max-w-7xl mx-auto px-8 pt-16 pb-32 text-center">
        <h1 className="text-7xl md:text-[100px] font-black tracking-tight leading-[0.85] mb-10">
          End the <span className="text-[#0052FF]">8am Scramble</span>.
        </h1>
        <p className="text-2xl text-slate-500 mb-14 leading-relaxed max-w-2xl mx-auto font-medium">
          The UK's first Autonomous Voice AI for GP surgeries. Handle every call instantly.
        </p>
        <button 
          onClick={() => setView('dashboard')}
          className="bg-[#0052FF] text-white px-12 py-6 rounded-[24px] text-xl font-bold shadow-2xl shadow-blue-300 hover:-translate-y-1 transition-all flex items-center justify-center mx-auto gap-3"
        >
          Live Demo Call <ArrowRight className="w-6 h-6" />
        </button>
      </header>
    </div>
  );

  const Dashboard = () => (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans relative">
      <aside className="w-80 bg-white border-r border-slate-200 p-10 flex flex-col">
        <div className="flex items-center gap-3 mb-16 cursor-pointer" onClick={() => setView('landing')}>
          <div className="bg-[#0052FF] p-2 rounded-xl"><Phone className="text-white w-5 h-5" /></div>
          <span className="text-2xl font-black tracking-tighter">8am Call</span>
        </div>
        <div className="p-4 bg-blue-50 text-[#0052FF] rounded-2xl font-bold flex items-center gap-4">
          <Clock className="w-5 h-5" /> Live Patient Queue
        </div>
      </aside>

      <main className="flex-1 p-16">
        {/* Instant Web-Call Trigger */}
        <div className="bg-white p-12 rounded-[48px] shadow-xl border-4 border-blue-500 mb-12 text-center relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-4xl font-black mb-4 tracking-tight">Speak to Sarah Now</h3>
              <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto leading-snug text-lg">
                Click below to start a live conversation. Watch the dashboard fill with clinical notes in real-time as you speak.
              </p>
              <button 
                onClick={isCalling ? () => vapi.stop() : startWebCall}
                className={`${isCalling ? 'bg-red-500 shadow-red-100' : 'bg-[#0052FF] shadow-blue-100'} text-white px-12 py-6 rounded-3xl text-2xl font-black shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 mx-auto`}
              >
                {isCalling ? <><X className="w-8 h-8" /> End Call</> : <><Phone className="w-8 h-8" /> Call My Surgery</>}
              </button>
           </div>
           {isCalling && <div className="absolute inset-0 bg-blue-50/50 animate-pulse"></div>}
        </div>

        {/* Real-Time Table */}
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-black tracking-widest text-slate-400">
              <tr>
                <th className="p-10">Patient Details</th>
                <th className="p-10">Priority</th>
                <th className="p-10">Live Clinical Notes (AI)</th>
                <th className="p-10">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.length === 0 && !isCalling ? (
                <tr><td colSpan={4} className="p-32 text-center text-slate-300 font-bold">Waiting for first call...</td></tr>
              ) : appointments.map((app) => (
                <tr key={app.id} className="animate-in fade-in slide-in-from-top-4 duration-500">
                  <td className="p-10">
                    <p className="font-black text-xl text-slate-900">{app.patient_name || "Capturing Name..."}</p>
                    <p className="text-sm font-bold text-slate-400 italic">{app.dob || "Waiting for DOB..."}</p>
                  </td>
                  <td className="p-10">
                    {app.urgency && (
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${
                        app.urgency === 'Red' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {app.urgency.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td className="p-10 text-slate-500 font-medium italic max-w-md">
                    {app.symptoms || "AI is listening and generating notes..."}
                  </td>
                  <td className="p-10 font-black text-xs text-[#0052FF]">{app.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Exit Popup */}
      {showExitPopup && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <div className="bg-white max-w-xl w-full p-12 rounded-[48px] shadow-2xl text-center">
            <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-black mb-4">Pretty impressive, right?</h2>
            <p className="text-slate-500 font-medium mb-10 text-lg leading-relaxed">
              We can set this up for your real clinic in under 2 minutes. Just divert your busy lines to our secure UK number.
            </p>
            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="Your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-blue-500 outline-none text-center text-xl"
              />
              <button className="w-full bg-[#0052FF] text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-blue-100 hover:bg-blue-700">
                Send My Clean Dashboard Link
              </button>
              <button onClick={() => setShowExitPopup(false)} className="text-slate-400 font-bold text-sm underline">Close and keep testing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return view === 'landing' ? <LandingPage /> : <Dashboard />;
}
