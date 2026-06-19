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

    // Handle BOTH "tool-call" (Live) and "end-of-call" (Final)
    const isToolCall = message?.type === 'tool-call';
    const isEndCall = message?.type === 'end-of-call-report';

    if (isToolCall) {
      const toolCall = message.toolCalls[0];
      if (toolCall.function.name === 'update_clinical_dashboard') {
        const args = JSON.parse(toolCall.function.arguments);
        const callId = data.message.call?.id || 'live-demo';

        await supabase.from('appointments').upsert({
          id: callId,
          patient_name: args.patient_name || "Capturing...",
          dob: args.dob || "",
          symptoms: args.symptoms || "Listening...",
          urgency: args.urgency || "Amber",
          status: "LIVE"
        }, { onConflict: 'id' });

        return NextResponse.json({
          results: [{ toolCallId: toolCall.id, result: "Dashboard Updated" }]
        });
      }
    }

    if (isEndCall) {
      const callId = message.call?.id || 'live-demo';
      await supabase.from('appointments').update({ status: "BOOKED" }).eq('id', callId);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
