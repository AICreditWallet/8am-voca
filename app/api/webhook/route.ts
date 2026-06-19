import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('--- VAPI WEBHOOK CALLED ---');
    
    // We try to use the private keys first, then fall back to public
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const message = data.message;
    const callId = message?.call?.id || 'demo-' + Date.now();

    // IF SARAH IS TALKING (Live Tool Call)
    if (message?.type === 'tool-call') {
      const toolCall = message.toolCalls?.[0];
      if (toolCall?.function?.name === 'update_clinical_dashboard') {
        const args = JSON.parse(toolCall.function.arguments || '{}');
        
        console.log('Saving Live Data for:', args.patient_name);

        const { error } = await supabase.from('appointments').upsert({
          id: callId,
          patient_name: args.patient_name || "New Patient...",
          dob: args.dob || "...",
          symptoms: args.symptoms || "AI is listening...",
          urgency: args.urgency || "Amber",
          status: "LIVE"
        });

        if (error) console.error('Supabase Error:', error);

        return NextResponse.json({
          results: [{ toolCallId: toolCall.id, result: "Success" }]
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ success: true });
  }
}
