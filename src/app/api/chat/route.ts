import { NextResponse } from 'next/server';
import { processPoppyChat } from '../../../../server/poppyAgent';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    const result = await processPoppyChat(message, history || []);
    return NextResponse.json(result);
  } catch (err) {
    console.error('API Chat Error:', err);
    return NextResponse.json({ error: 'Server error processing chat' }, { status: 500 });
  }
}
