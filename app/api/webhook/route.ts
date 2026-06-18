import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Connects to your Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // We listen for the "End of Call Report" from Vapi
    if (data.message?.type === 'end-of-call-report') {
      const { customer, summary, analysis } = data.message;
      
      // Save the patient data to your Supabase table
      const { error } = await supabase.from('appointments').insert({
        patient_name: customer?.number || "Anonymous Patient",
        symptoms: summary || "General medical inquiry",
        urgency: analysis?.structuredData?.urgency || "Amber",
        status: "Booked"
      });

      if (error) {
        console.error('Supabase Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
