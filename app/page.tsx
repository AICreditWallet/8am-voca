// ... (Keep the imports from before)
// Add a new function inside the EightAMApp component:

  const [demoPhone, setDemoPhone] = useState('');
  const [calling, setCalling] = useState(false);

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
        alert("Calling your phone now! Please answer to speak with Sarah.");
      } else {
        alert("Error starting call. Make sure your Vapi credits are active.");
      }
    } catch (error) {
      console.error(error);
    }
    setCalling(false);
  };

// ... (In your GPDashboard component, add this block above the table) ...

<div className="bg-gradient-to-r from-[#0052FF] to-[#4080FF] p-10 rounded-[40px] shadow-2xl shadow-blue-200 mb-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
  <div className="max-w-md">
    <h3 className="text-3xl font-black mb-3 leading-tight">Test the Voice AI Now</h3>
    <p className="text-blue-100 font-medium">Enter your number and Sarah will call you instantly to demonstrate her triage capabilities.</p>
  </div>
  <div className="flex w-full md:w-auto gap-3">
    <input 
      type="tel" 
      placeholder="+44 7123 456789"
      value={demoPhone}
      onChange={(e) => setDemoPhone(e.target.value)}
      className="bg-white/10 border-2 border-white/20 px-6 py-4 rounded-2xl focus:bg-white/20 focus:outline-none transition-all placeholder:text-blue-200 font-bold w-full md:w-64"
    />
    <button 
      onClick={handleCallMe}
      disabled={calling}
      className="bg-white text-[#0052FF] px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition active:scale-95 disabled:opacity-50 whitespace-nowrap"
    >
      {calling ? "Connecting..." : "Call My Surgery"}
    </button>
  </div>
</div>
