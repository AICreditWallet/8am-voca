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

    // 1. Handle LIVE updates during the call (The "Magic" part)
    if (message?.type === 'tool-call') {
      const toolCall = message.toolCalls[0];
      if (toolCall.function.name === 'update_clinical_dashboard') {
        const args = JSON.parse(toolCall.function.arguments);
        
        // Use the Call ID to keep updating the SAME row in the table
        const callId = message.call?.id || 'demo-call';

        const { error } = await supabase
          .from('appointments')
          .upsert({
            id: callId, // Using callId as the primary key for the demo
            patient_name: args.patient_name,
            dob: args.dob,
            symptoms: args.symptoms,
            urgency: args.urgency,
            status: "AI Listening..."
          }, { onConflict: 'id' });

        if (error) console.error('Supabase Live Error:', error);

        // Tell Vapi the tool was successful
        return NextResponse.json({
          results: [{
            toolCallId: toolCall.id,
            result: "Dashboard updated successfully."
          }]
        });
      }
    }

    // 2. Handle Final Report after the call ends
    if (message?.type === 'end-of-call-report') {
      const callId = message.call?.id || 'demo-call';
      await supabase
        .from('appointments')
        .update({ status: "BOOKED" })
        .eq('id', callId);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
