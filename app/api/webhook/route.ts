import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const message = data.message;
    const callId = message?.call?.id || 'live-demo';

    // Handle LIVE Tool Call
    if (message?.type === 'tool-call') {
      const toolCall = message.toolCalls?.[0];
      const args = JSON.parse(toolCall?.function?.arguments || '{}');
      
      await supabase.from('appointments').upsert({
        id: callId,
        patient_name: args.patient_name || "New Patient...",
        dob: args.dob || "",
        symptoms: args.symptoms || "Listening...",
        urgency: args.urgency || "Amber",
        status: "LIVE"
      });

      return NextResponse.json({
        results: [{ toolCallId: toolCall.id, result: "Dashboard Updated" }]
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: true });
  }
}
