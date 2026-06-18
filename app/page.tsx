"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Phone, Calendar, ClipboardList, CheckCircle, BarChart, Clock, Zap, ShieldCheck, ArrowRight, Play, Star, Mail, Lock } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
);

export default function EightAMApp() {
  const [view, setView] = useState('landing'); // 'landing', 'login', 'dashboard'
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoPhone, setDemoPhone] = useState('');
  const [calling, setCalling] = useState(false);
  const [appointments, setAppointments] = useState([
    { id: 1, patient_name: "James Wilson", created_at: new Date().toISOString(), urgency: "Amber", symptoms: "Persistent cough (3 days)", status: "Booked" },
    { id: 2, patient_name: "Mary Thompson", created_at: new Date().toISOString(), urgency: "Red", symptoms: "Acute chest discomfort", status: "Triage Required" },
  ]);

  useEffect(() => {
    if (view === 'dashboard' && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const fetchApps = async () => {
        try {
          const { data } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
          if (data && data.length > 0) setAppointments(data);
        } catch (error) { console.log("Using mock data"); }
      };
      fetchApps();
    }
  }, [view]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the magic link!");
      setView('dashboard');
    }
    setLoading(false);
  };

  const handleCallMe = async () => {
    if (!demoPhone) return alert("Please enter a phone number");
    setCalling(true);
    try {
      const response = await fetch('/api/call-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: demoPhone }),
      });
      if (response.ok) {
        alert("Calling your phone now! Answer to speak with Sarah.");
      } else {
        alert("Error starting call. Check Vercel logs.");
      }
    } catch (error) { console.error(error); }
    setCalling(false);
  };

  const LandingPage = () => (
    <div className="min-h-screen bg-white text-[#1A1C1E] font-sans selection:bg-blue-100">
      <nav className="max-w-7xl mx-auto px-8 py-10 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
          <div className="bg-[#0052FF] p-2.5 rounded-[14px] shadow-lg shadow-blue-100">
            <Phone className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-[#1A1C1E]">8am Call</span>
        </div>
        <button onClick={() => setView('login')} className="bg-[#F1F4F9] px-7 py-3 rounded-full font-bold text-sm hover:bg-[#E2E8F0] transition">
          Clinic Login
        </button>
      </nav>

      <header className="max-w-7xl mx-auto px-8 pt-16 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0052FF] px-5 py-2 rounded-full text-[13px] font-bold mb-10 border border-blue-100 shadow-sm">
          <Star className="w-4 h-4 fill-current" /> NHS-Ready AI Technology
        </div>
        <h1 className="text-7xl md:text-[100px] font-black tracking-tight leading-[0.85] mb-10 max-w-5xl mx-auto">
          The <span className="text-[#0052FF]">8am Call</span> Solution.
        </h1>
        <p className="text-2xl text-slate-500 mb-14 leading-relaxed max-w-2xl mx-auto font-medium">
          Autonomous Voice AI that handles your surgery's busiest hour. No hold times, no busy signals.
        </p>
        <button onClick={() => setView('login')} className="bg-[#0052FF] text-white px-12 py-6 rounded-[24px] text-xl font-bold shadow-2xl shadow-blue-300 hover:bg-[#0041CC] hover:-translate-y-1 transition-all flex items-center justify-center mx-auto gap-3">
          Join the Pilot <ArrowRight className="w-6 h-6" />
        </button>

        {/* Cinematic Video Section */}
        <div className="mt-24 relative max-w-5xl mx-auto aspect-video bg-slate-900 rounded-[48px] overflow-hidden shadow-2xl border-[8px] border-white group cursor-pointer">
           <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Demo" />
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
               <Play className="text-white w-8 h-8 fill-current" />
             </div>
           </div>
        </div>
      </header>
    </div>
  );

  const LoginPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-[#0052FF] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-100">
            <Phone className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-2">Welcome to 8am Call</h2>
          <p className="text-slate-500 font-medium leading-snug">Enter your work email to access your surgery dashboard.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-300 w-5 h-5" />
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@surgery.nhs.uk"
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-medium"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#0052FF] text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-[#0041CC] transition active:scale-[0.98]">
            {loading ? "Sending Magic Link..." : "Sign In / Join Pilot"}
          </button>
        </form>
      </div>
    </div>
  );

  const GPDashboard = () => (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans">
      <aside className="w-80 bg-white border-r border-slate-200 p-10 flex flex-col">
        <div className="flex items-center gap-3 mb-16 cursor-pointer" onClick={() => setView('landing')}>
          <div className="bg-[#0052FF] p-2 rounded-xl"><Phone className="text-white w-5 h-5" /></div>
          <span className="text-2xl font-black tracking-tighter">8am Call</span>
        </div>
        <nav className="space-y-3 flex-1">
          <div className="p-4 bg-blue-50 text-[#0052FF] rounded-2xl font-bold flex items-center gap-4"><Clock className="w-5 h-5" /> Live Patient Queue</div>
        </nav>
        <button onClick={() => setView('landing')} className="text-slate-400 font-bold text-sm text-left">Logout</button>
      </aside>

      <main className="flex-1 p-16">
        <div className="bg-gradient-to-r from-[#0052FF] to-[#4080FF] p-10 rounded-[40px] shadow-2xl shadow-blue-200 mb-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h3 className="text-3xl font-black mb-3">Test the Voice AI Now</h3>
            <p className="text-blue-100 font-medium leading-snug">Enter your number and Sarah will call you instantly to demonstrate her capabilities.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <input 
              type="tel" placeholder="+44 7123 456789" value={demoPhone} onChange={(e) => setDemoPhone(e.target.value)}
              className="bg-white/10 border-2 border-white/20 px-6 py-4 rounded-2xl focus:bg-white/20 outline-none placeholder:text-blue-200 font-bold w-full md:w-64"
            />
            <button onClick={handleCallMe} disabled={calling} className="bg-white text-[#0052FF] px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition active:scale-95">
              {calling ? "Calling..." : "Call My Surgery"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-10 font-black text-xs uppercase text-slate-400">Patient</th>
                <th className="p-10 font-black text-xs uppercase text-slate-400">Priority</th>
                <th className="p-10 font-black text-xs uppercase text-slate-400">AI Summary</th>
                <th className="p-10 font-black text-xs uppercase text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map(app => (
                <tr key={app.id}>
                  <td className="p-10 font-bold text-slate-900">{app.patient_name}</td>
                  <td className="p-10">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${app.urgency === 'Red' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                      {app.urgency}
                    </span>
                  </td>
                  <td className="p-10 text-slate-500 italic">"{app.symptoms}"</td>
                  <td className="p-10 font-black text-xs text-[#0052FF] uppercase">{app.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );

  if (view === 'landing') return <LandingPage />;
  if (view === 'login') return <LoginPage />;
  return <GPDashboard />;
}
