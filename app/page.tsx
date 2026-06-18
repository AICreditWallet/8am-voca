"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Phone, Calendar, ClipboardList, CheckCircle, BarChart, Clock, Zap, ShieldCheck, ArrowRight, Play, Star } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EightAMApp() {
  const [view, setView] = useState('landing');
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

  const LandingPage = () => (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1A1C1E] font-sans selection:bg-blue-100">
      {/* Premium Nav */}
      <nav className="max-w-7xl mx-auto px-8 py-10 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
          <div className="bg-[#0052FF] p-2.5 rounded-[14px] shadow-lg shadow-blue-100">
            <Phone className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-[#1A1C1E]">8am Call</span>
        </div>
        <div className="hidden lg:flex gap-10 font-semibold text-slate-400 text-sm tracking-tight">
          <a href="#" className="hover:text-blue-600 transition-colors">Platform</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Case Studies</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Security</a>
        </div>
        <button 
          onClick={() => setView('dashboard')}
          className="bg-[#F1F4F9] text-[#1A1C1E] px-7 py-3 rounded-full font-bold text-sm hover:bg-[#E2E8F0] transition active:scale-95"
        >
          Clinic Login
        </button>
      </nav>

      {/* Hero: Ultra Premium */}
      <header className="max-w-7xl mx-auto px-8 pt-16 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0052FF] px-5 py-2 rounded-full text-[13px] font-bold mb-10 border border-blue-100 shadow-sm">
          <Star className="w-4 h-4 fill-current" /> Trusted by 50+ UK Private Clinics
        </div>
        <h1 className="text-7xl md:text-[100px] font-black tracking-[-0.05em] leading-[0.85] mb-10 max-w-5xl mx-auto">
          The <span className="text-[#0052FF]">8am Call</span> Solution.
        </h1>
        <p className="text-2xl text-slate-500 mb-14 leading-[1.4] max-w-2xl mx-auto font-medium">
          Autonomous Voice AI that handles your surgery's busiest hour. No hold times, no busy signals, just instant patient booking.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-24">
          <button className="bg-[#0052FF] text-white px-12 py-6 rounded-[24px] text-xl font-bold shadow-2xl shadow-blue-300 hover:bg-[#0041CC] hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
            Start Free Trial <ArrowRight className="w-6 h-6" />
          </button>
          <button className="bg-white border-2 border-slate-100 px-10 py-6 rounded-[24px] text-xl font-bold hover:border-blue-200 transition-all">
            Watch Technical Demo
          </button>
        </div>

        {/* Cinematic Video Section (Seedance Style) */}
        <div className="relative max-w-6xl mx-auto">
           <div className="absolute -inset-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-[120px] rounded-full"></div>
           <div className="relative aspect-video bg-slate-900 rounded-[48px] overflow-hidden shadow-[0_48px_100px_-24px_rgba(0,0,0,0.3)] group cursor-pointer border-[8px] border-white">
              {/* This is where you would put your Seedance video URL */}
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                alt="AI Explainer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                  <Play className="text-white w-10 h-10 fill-current" />
                </div>
              </div>
              <div className="absolute bottom-10 left-10 text-left">
                <p className="text-white text-2xl font-bold">See 8am Call in action</p>
                <p className="text-white/60 font-medium tracking-tight">How our AI handles a real medical triage</p>
              </div>
           </div>
        </div>
      </header>

      {/* Feature Section */}
      <section className="bg-[#F8FAFC] py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Voice Precision", desc: "Our AI understands regional UK accents and medical terminology with 99.4% accuracy.", icon: <Zap /> },
              { title: "Seamless EMIS", desc: "Direct integration with major GP clinical systems via the GP Connect API.", icon: <ShieldCheck /> },
              { title: "Smart Triage", desc: "Clinically-validated symptom checking to prioritize urgent cases automatically.", icon: <Clock /> }
            ].map((f, i) => (
              <div key={i} className="group">
                <div className="bg-[#0052FF] text-white p-4 rounded-2xl w-fit mb-8 shadow-lg shadow-blue-100 group-hover:rotate-6 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-lg text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const GPDashboard = () => (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200 p-10 flex flex-col">
        <div className="flex items-center gap-3 mb-16 cursor-pointer" onClick={() => setView('landing')}>
          <div className="bg-[#0052FF] p-2 rounded-xl">
            <Phone className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tighter">8am Call</span>
        </div>
        <nav className="space-y-3 flex-1">
          <button className="w-full flex items-center gap-4 p-4 bg-blue-50 text-[#0052FF] rounded-2xl font-bold">
            <Clock className="w-5 h-5" /> Live Patient Queue
          </button>
          <button className="w-full flex items-center gap-4 p-4 text-slate-400 hover:bg-slate-50 rounded-2xl font-bold transition">
            <Calendar className="w-5 h-5" /> Appointments
          </button>
        </nav>
        <div className="bg-slate-900 p-8 rounded-[32px] text-white">
          <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-3">System Health</p>
          <p className="text-sm font-bold leading-snug text-slate-300">AI handling 100% of current call volume.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-16">
        <header className="flex justify-between items-center mb-16">
          <h2 className="text-4xl font-black tracking-tight">Surgery Pulse</h2>
          <div className="flex gap-4 items-center">
             <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Active Station: London #01</span>
             <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </header>

        <div className="bg-white rounded-[40px] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-10 font-black text-xs uppercase tracking-widest text-slate-400">Patient Data</th>
                <th className="p-10 font-black text-xs uppercase tracking-widest text-slate-400">Call Time</th>
                <th className="p-10 font-black text-xs uppercase tracking-widest text-slate-400">Priority</th>
                <th className="p-10 font-black text-xs uppercase tracking-widest text-slate-400">AI Summary</th>
                <th className="p-10 font-black text-xs uppercase tracking-widest text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-10">
                    <p className="font-bold text-lg text-slate-900">{app.patient_name}</p>
                    <p className="text-sm font-medium text-slate-400">Ref: VOCA-{app.id}</p>
                  </td>
                  <td className="p-10 font-bold text-slate-600">{new Date(app.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="p-10">
                    <span className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest ${
                      app.urgency === 'Red' ? 'bg-red-50 text-red-600 border border-red-100' : 
                      app.urgency === 'Amber' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-green-50 text-green-600 border border-green-100'
                    }`}>
                      {app.urgency}
                    </span>
                  </td>
                  <td className="p-10 text-slate-500 text-sm font-medium italic max-w-xs truncate">"{app.symptoms}"</td>
                  <td className="p-10">
                    <button className="text-[#0052FF] font-black text-xs uppercase tracking-widest bg-blue-50 px-5 py-2 rounded-full border border-blue-100">
                      {app.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );

  return view === 'landing' ? <LandingPage /> : <GPDashboard />;
}
