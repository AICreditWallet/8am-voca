import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { phoneNumber } = await req.json();

  const response = await fetch('https://api.vapi.ai/call/phone', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      assistantId: process.env.VAPI_ASSISTANT_ID,
      customer: { number: phoneNumber },
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID, // Optional: if you bought a number
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
