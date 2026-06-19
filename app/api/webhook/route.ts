import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const message = data.message;
    const callId = message.call?.id || 'demo-call-' + Date.now();

    if (message?.type === 'tool-call') {
      const toolCall = message.toolCalls[0];
      if (toolCall.function.name === 'update_clinical_dashboard') {
        const args = JSON.parse(toolCall.function.arguments);
        
        await supabase.from('appointments').upsert({
          id: callId,
          patient_name: args.patient_name || "Capturing...",
          dob: args.dob || "...",
          symptoms: args.symptoms || "Listening...",
          urgency: args.urgency || "Amber",
          status: "LIVE"
        });

        return NextResponse.json({
          results: [{ toolCallId: toolCall.id, result: "Dashboard updated." }]
        });
      }
    }

    if (message?.type === 'end-of-call-report') {
      await supabase.from('appointments').update({ status: "BOOKED" }).eq('id', callId);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('WEBHOOK ERROR:', err);
    return NextResponse.json({ success: true }); // Always return 200 to Vapi
  }
}
