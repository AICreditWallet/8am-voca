"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Phone, Calendar, ClipboardList, CheckCircle, BarChart, Clock, Zap, ShieldCheck, ArrowRight, Play, Star, Mail, Lock } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function EightAMApp() {
  const [view, setView] = useState('landing'); // 'landing', 'login', 'dashboard'
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([
    { id: 1, patient_name: "James Wilson", created_at: new Date().toISOString(), urgency: "Amber", symptoms: "Persistent cough (3 days)", status: "Booked" },
    { id: 2, patient_name: "Mary Thompson", created_at: new Date().toISOString(), urgency: "Red", symptoms: "Acute chest discomfort", status: "Triage Required" },
  ]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // For the 24h MVP, we'll simulate a login or use Supabase Magic Link
    // If you have Supabase Auth enabled, this will send a real email!
    const { error } = await supabase.auth.signInWithOtp({ email });
    
    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the login link!");
      setView('dashboard'); // Jump to dashboard for demo purposes
    }
    setLoading(false);
  };

  const LandingPage = () => (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1A1C1E] font-sans selection:bg-blue-100">
      <nav className="max-w-7xl mx-auto px-8 py-10 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
          <div className="bg-[#0052FF] p-2.5 rounded-[14px] shadow-lg shadow-blue-100">
            <Phone className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-[#1A1C1E]">8am Call</span>
        </div>
        <button 
          onClick={() => setView('login')}
          className="bg-[#F1F4F9] text-[#1A1C1E] px-7 py-3 rounded-full font-bold text-sm hover:bg-[#E2E8F0] transition"
        >
          Clinic Login
        </button>
      </nav>

      <header className="max-w-7xl mx-auto px-8 pt-16 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0052FF] px-5 py-2 rounded-full text-[13px] font-bold mb-10 border border-blue-100 shadow-sm">
          <Star className="w-4 h-4 fill-current" /> NHS-Ready AI Technology
        </div>
        <h1 className="text-7xl md:text-[100px] font-black tracking-[-0.05em] leading-[0.85] mb-10 max-w-5xl mx-auto">
          The <span className="text-[#0052FF]">8am Call</span> Solution.
        </h1>
        <p className="text-2xl text-slate-500 mb-14 leading-[1.4] max-w-2xl mx-auto font-medium">
          Zero wait times. Zero missed appointments. Autonomous AI built for the UK's busiest surgeries.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <button onClick={() => setView('login')} className="bg-[#0052FF] text-white px-12 py-6 rounded-[24px] text-xl font-bold shadow-2xl shadow-blue-300 hover:bg-[#0041CC] hover:-translate-y-1 transition-all">
            Join the 24h Pilot <ArrowRight className="ml-2 inline w-6 h-6" />
          </button>
        </div>
      </header>
    </div>
  );

  const LoginPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-100">
            <Phone className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-2">Welcome to 8am Call</h2>
          <p className="text-slate-500 font-medium">Enter your work email to access your surgery dashboard.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-slate-300 w-5 h-5" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@surgery-name.nhs.uk"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#0052FF] text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-[#0041CC] transition active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Sending Magic Link..." : "Sign In / Join Pilot"}
          </button>
          <p className="text-center text-xs text-slate-400 font-medium">
            By signing in, you agree to our Terms of Service.
          </p>
        </form>
      </div>
    </div>
  );

  // GPDashboard component logic remains the same...
  const GPDashboard = () => (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans">
       {/* ... (Previous Dashboard Code) ... */}
       <button onClick={() => setView('landing')} className="mt-auto text-slate-400 font-bold text-sm">Logout</button>
    </div>
  );

  if (view === 'landing') return <LandingPage />;
  if (view === 'login') return <LoginPage />;
  return <GPDashboard />;
}
