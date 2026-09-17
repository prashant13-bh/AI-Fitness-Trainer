import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, userContext } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_GATEWAY_API_KEY;

    // Build context-rich prompt
    const identity = userContext?.identityStatement || 'I am forging an elite, disciplined version of myself.';
    const currentDay = userContext?.currentDay || 17;
    const consistency = userContext?.consistency || 82;
    const streak = userContext?.streak || 8;

    const systemInstruction = `You are the Winter Arc AI Transformation Coach.
Your philosophy:
1. 90 days. One promise. Become who you said you'd become.
2. Consistency over streaks: never shame the user for missing a day; instead remind them of their identity and minimum day protocol.
3. Keep answers concise, high-impact, direct, stoic, and relentlessly actionable (under 3-4 paragraphs).
4. User identity statement: "${identity}".
5. Current progress: Day ${currentDay} of 90, ${consistency}% consistency, ${streak} day streak.

Always speak as a world-class mentor who expects greatness but understands human friction.`;

    if (apiKey && apiKey !== 'your-gemini-api-key-here') {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemInstruction}\n\nUser Question/Reflection:\n${messages[messages.length - 1]?.content}` }],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (err) {
        console.warn('Gemini API fetch failed, falling back to heuristic coaching engine', err);
      }
    }

    // Heuristic Coach Engine (contextual responses based on user query)
    const lastMsg = (messages[messages.length - 1]?.content || '').toLowerCase();
    let reply = '';

    if (lastMsg.includes('review') || lastMsg.includes('week')) {
      reply = `**Week ${Math.ceil(currentDay / 7)} Debrief:**\n\nYou're holding an **${consistency}% consistency rate** through Day ${currentDay}. That puts you ahead of 80% of people who set intentions and abandon them by Day 14.\n\nYour strongest pillar has been your physical discipline. Where you have friction is during evening transitions—protecting that final habit is where real identity change happens.\n\n**Order of operation for tomorrow:** Execute your hardest habit before 10:00 AM. Remove negotiation from the morning.`;
    } else if (lastMsg.includes('plan') || lastMsg.includes('tomorrow')) {
      reply = `**Tactical Protocol for Day ${currentDay + 1}:**\n\n1. **Morning Trigger:** Hydrate and hit your non-negotiable habit immediately. Do not touch social feeds until habit #1 is done.\n2. **The Battleground:** Your mid-day energy dip. When resistance appears, drop to your **Minimum Requirement** (e.g. 15 min instead of 45 min) rather than taking a zero.\n3. **Evening Lock-In:** Journal your day score before 10:00 PM.\n\nWin the morning, seal the day. What habit are you tackling first?`;
    } else if (lastMsg.includes('recover') || lastMsg.includes('miss') || lastMsg.includes('fail')) {
      reply = `Listen closely: **One missed day is an anomaly. Two missed days is the start of a new, negative habit.**\n\nYou do not need to "make up" lost reps with punishing volume tomorrow. That leads to burnout.\n\nActivate the **Minimum Day Protocol** today. Do 10 pushups, read 5 pages, drink your water. Keep the wire connected. Your identity is: *"${identity}"*. Act like it right now.`;
    } else if (lastMsg.includes('motivate') || lastMsg.includes('truth') || lastMsg.includes('hard')) {
      reply = `Here is the reality: Nobody is coming to save you. The cold, dark winter does not care how tired you feel after work.\n\nIn 73 days, you will either stand on the other side of this 90-day Arc with proof that your word is ironclad, or with another excuse to explain away in the mirror.\n\nYou made a commitment to yourself. Honor it today. Step up.`;
    } else {
      reply = `I hear you. Remember the core promise of your Arc: **"${identity}"**.\n\nDay ${currentDay} is not about waiting for motivation—motivation is an unreliable visitor. Discipline is the resident.\n\nFocus on what you can execute in the next 60 minutes. Keep the promise. How can I help you sharpen today's execution?`;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process coaching request' },
      { status: 500 }
    );
  }
}
