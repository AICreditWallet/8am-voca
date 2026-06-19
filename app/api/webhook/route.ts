import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Log the incoming request so we can see it in Vercel
    const data = await req.json();
    console.log('Vapi Payload:', JSON.stringify(data, null, 2));

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const message = data.message;
    // Get a unique ID for this call
    const callId = message?.call?.id || message?.callId || 'demo-' + Date.now();

    // 2. Handle LIVE Updates (Tool Calls)
    if (message?.type === 'tool-call') {
      const toolCall = message.toolCalls?.[0];
      if (toolCall?.function?.name === 'update_clinical_dashboard') {
        const args = JSON.parse(toolCall.function.arguments || '{}');
        
        const { error } = await supabase.from('appointments').upsert({
          id: callId,
          patient_name: args.patient_name || "New Patient...",
          dob: args.dob || "Gathering...",
          symptoms: args.symptoms || "Listening to patient...",
          urgency: args.urgency || "Amber",
          status: "LIVE"
        });

        if (error) console.error('Supabase Error:', error);

        return NextResponse.json({
          results: [{ toolCallId: toolCall.id, result: "Dashboard Updated" }]
        });
      }
    }

    // 3. Handle Final Report (End of Call)
    if (message?.type === 'end-of-call-report') {
       await supabase.from('appointments').update({ status: "BOOKED" }).eq('id', callId);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('CRITICAL WEBHOOK ERROR:', err);
    return NextResponse.json({ success: true }); // Always return 200 to keep Sarah talking
  }
}
