"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Phone, Calendar, ClipboardList, CheckCircle, BarChart, Clock, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

// Safe placeholder so Vercel builds cleanly even without variables set yet
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EightAMApp() {
  const [view, setView] = useState('landing');
  const [appointments, setAppointments] = useState([
    { id: 1, patient_name: "James Wilson", created_at: new Date().toISOString(), urgency: "Amber", symptoms: "Persistent cough (3 days)", status: "Booked" },
    { id: 2, patient_name: "Mary Thompson", created_at: new Date().toISOString(), urgency: "Red", symptoms: "Acute chest discomfort", status: "Triage Required" },
  ]);

  useEffect(() => {
    // Only fetch if real keys are provided in Vercel settings
    if (view === 'dashboard' && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const fetchApps = async () => {
        try {
          const { data } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
          if (data && data.length > 0) setAppointments(data);
        } catch (error) {
          console.log("Using mock data instead");
        }
      };
      fetchApps();
    }
  }, [view]);

  const LandingPage = () => (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setView('landing')}>
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-200">
            <Phone className="text-white w-6 h-6" />
          </div>
          <span className="text-3xl font-black tracking-tighter">8am</span>
        </div>
        <div className="hidden md:flex gap-8 font-bold text-slate-400 uppercase text-xs tracking-widest">
          <a href="#" className="hover:text-blue-600 transition">Product</a>
          <a href="#" className="hover:text-blue-600 transition">Compliance</a>
          <a href="#" className="hover:text-blue-600 transition">Pricing</a>
        </div>
        <button 
          onClick={() => setView('dashboard')}
          className="bg-white border-2 border-slate-100 px-6 py-2.5 rounded-2xl font-bold shadow-sm hover:shadow-md hover:border-blue-100 transition active:scale-95"
        >
          GP Dashboard
        </button>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid md:grid-cols-2 gap-16 items-center">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider mb-8">
            <Zap className="w-4 h-4 fill-current" /> NHS-Ready Autonomous Voice AI
          </div>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8">
            End the <span className="text-blue-600">8am Scramble</span>.
          </h1>
          <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-lg">
            Stop losing patients to busy signals. Our AI answers instantly, triages symptoms, and books slots directly into your GP system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-blue-600 text-white px-10 py-6 rounded-[24px] text-xl font-black shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition active:translate-y-0 flex items-center justify-center gap-3">
              Request Demo <ArrowRight className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 px-6 text-slate-400 py-4">
              <ShieldCheck className="w-8 h-8 text-blue-600/30" />
              <span className="text-xs font-bold uppercase tracking-widest leading-tight">CQC & GDPR<br/>Compliant</span>
            </div>
          </div>
        </div>
        
        {/* Visual Call Interface Mockup */}
        <div className="relative">
           <div className="absolute -inset-10 bg-gradient-to-tr from-blue-400 to-purple-400 opacity-20 blur-[100px] rounded-full"></div>
           <div className="relative bg-white p-10 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="font-black text-slate-300 text-sm tracking-widest uppercase">Live Voice Session</span>
                </div>
                <div className="text-slate-300 font-mono text-sm">00:42</div>
              </div>
              <div className="space-y-8">
                 <div className="bg-slate-50 p-6 rounded-[32px] rounded-bl-none border-l-4 border-blue-500">
                    <p className="text-[10px] font-black text-blue-600 mb-2 uppercase tracking-widest">Patient (Mr. Khan)</p>
                    <p className="font-bold text-slate-700 text-lg leading-tight">"My daughter has a high fever and a rash. We need to see someone now."</p>
                 </div>
                 <div className="bg-blue-600 p-8 rounded-[32px] rounded-br-none text-white ml-12 shadow-xl shadow-blue-200">
                    <p className="text-[10px] font-black text-blue-200 mb-2 uppercase tracking-widest">8am AI Agent</p>
                    <p className="font-bold text-lg leading-tight">"I understand. Based on those symptoms, I've flagged this as Urgent. I have a 9:15 AM slot available. Shall I book that?"</p>
                 </div>
              </div>
           </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Answer Time", val: "0.2s" },
            { label: "Call Capacity", val: "∞" },
            { label: "Triage Accuracy", val: "99.4%" },
            { label: "Cost Saving", val: "65%" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 text-center">
              <p className="text-4xl font-black text-blue-600 mb-1">{stat.val}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const GPDashboard = () => (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col">
        <div className="flex items-center gap-2 mb-12 cursor-pointer" onClick={() => setView('landing')}>
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-100">
            <Phone className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tighter">8am</span>
        </div>
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-2xl font-bold transition">
            <Clock className="w-5 h-5" /> Live Queue
          </button>
          <button className="w-full flex items-center gap-3 p-4 text-slate-400 hover:bg-slate-50 rounded-2xl font-bold transition">
            <Calendar className="w-5 h-5" /> Bookings
          </button>
          <button className="w-full flex items-center gap-3 p-4 text-slate-400 hover:bg-slate-50 rounded-2xl font-bold transition">
            <BarChart className="w-5 h-5" /> Efficiency
          </button>
        </nav>
        <div className="pt-8 border-t border-slate-100">
          <div className="bg-blue-600 p-6 rounded-[24px] text-white">
            <p className="text-xs font-black text-blue-200 uppercase tracking-widest mb-2">Pro Tip</p>
            <p className="text-sm font-bold leading-snug">AI handled 94% of your calls this morning.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Surgery Overview</h2>
            <p className="text-slate-500 font-medium">St. Mary's Medical Center • Central London</p>
          </div>
          <div className="flex gap-4">
             <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 border border-green-200">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               Agent Active
             </span>
          </div>
        </header>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-8 font-black text-xs uppercase tracking-widest text-slate-400">Patient</th>
                <th className="p-8 font-black text-xs uppercase tracking-widest text-slate-400">Time</th>
                <th className="p-8 font-black text-xs uppercase tracking-widest text-slate-400">Urgency</th>
                <th className="p-8 font-black text-xs uppercase tracking-widest text-slate-400">AI Triage Summary</th>
                <th className="p-8 font-black text-xs uppercase tracking-widest text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition cursor-pointer">
                  <td className="p-8">
                    <p className="font-black text-slate-800">{app.patient_name}</p>
                    <p className="text-xs font-bold text-slate-400">DOB: 12/04/1985</p>
                  </td>
                  <td className="p-8 text-slate-600 font-bold">{new Date(app.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="p-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      app.urgency === 'Red' ? 'bg-red-50 text-red-600 border-red-100' : 
                      app.urgency === 'Amber' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {app.urgency}
                    </span>
                  </td>
                  <td className="p-8 text-slate-500 text-sm font-medium italic">"{app.symptoms}"</td>
                  <td className="p-8">
                    <button className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                      {app.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && (
            <div className="p-20 text-center">
              <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold">No calls in the queue yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );

  return view === 'landing' ? <LandingPage /> : <GPDashboard />;
}
