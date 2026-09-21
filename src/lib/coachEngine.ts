export interface CoachContext {
  identityStatement?: string;
  currentDay?: number;
  consistency?: number;
  streak?: number;
}

export async function getCoachResponse(message: string, context?: CoachContext): Promise<string> {
  const identity = context?.identityStatement || 'I am forging an elite, disciplined version of myself.';
  const currentDay = context?.currentDay || 1;
  const consistency = context?.consistency || 90;

  const lastMsg = message.toLowerCase();

  if (lastMsg.includes('review') || lastMsg.includes('week') || lastMsg.includes('consistency')) {
    return `**Week ${Math.ceil(currentDay / 7)} Debrief:**\n\nYou're holding an **${consistency}% consistency rate** through Day ${currentDay}. That puts you ahead of 80% of people who set intentions and abandon them by Day 14.\n\nYour strongest pillar has been your physical discipline. Where you have friction is during evening transitions—protecting that final habit is where real identity change happens.\n\n**Order of operation for tomorrow:** Execute your hardest habit before 10:00 AM. Remove negotiation from the morning.`;
  } else if (lastMsg.includes('plan') || lastMsg.includes('tomorrow')) {
    return `**Tactical Protocol for Day ${currentDay + 1}:**\n\n1. **Morning Trigger:** Hydrate and hit your non-negotiable habit immediately. Do not touch social feeds until habit #1 is done.\n2. **The Battleground:** Your mid-day energy dip. When resistance appears, drop to your **Minimum Requirement** (e.g. 15 min instead of 45 min) rather than taking a zero.\n3. **Evening Lock-In:** Journal your day score before 10:00 PM.\n\nWin the morning, seal the day. What habit are you tackling first?`;
  } else if (lastMsg.includes('recover') || lastMsg.includes('miss') || lastMsg.includes('fail')) {
    return `Listen closely: **One missed day is an anomaly. Two missed days is the start of a new, negative habit.**\n\nYou do not need to "make up" lost reps with punishing volume tomorrow. That leads to burnout.\n\nActivate the **Minimum Day Protocol** today. Do 10 pushups, read 5 pages, drink your water. Keep the wire connected. Your identity is: *"${identity}"*. Act like it right now.`;
  } else if (lastMsg.includes('motivate') || lastMsg.includes('truth') || lastMsg.includes('hard')) {
    return `Here is the reality: Nobody is coming to save you. The cold, dark winter does not care how tired you feel after work.\n\nIn ${Math.max(1, 90 - currentDay)} days, you will either stand on the other side of this Arc with proof that your word is ironclad, or with another excuse to explain away in the mirror.\n\nYou made a commitment to yourself. Honor it today. Step up.`;
  } else if (lastMsg.includes('afternoon') || lastMsg.includes('slump')) {
    return `For afternoon brain fog: 1) Drink 500ml cold water with a pinch of sea salt. 2) Take a brisk 7-minute walk outside in natural sunlight. 3) Keep lunch low-carb before deep work. You've got this!`;
  } else if (lastMsg.includes('deep work') || lastMsg.includes('focus')) {
    return `Put your phone in another room or switch to Do Not Disturb. Use our 'Lock In' timer for 45 or 90 minutes. Remember: single-tasking builds elite mental muscle.`;
  } else if (lastMsg.includes('cold shower')) {
    return `The cold shower isn't about the temperature — it's about the conscious decision to do the hard thing when your brain begs for comfort. Step in without hesitating for 3 seconds.`;
  } else {
    return `I hear you. Remember the core promise of your Arc: **"${identity}"**.\n\nDay ${currentDay} is not about waiting for motivation—motivation is an unreliable visitor. Discipline is the resident.\n\nFocus on what you can execute in the next 60 minutes. Keep the promise. How can I help you sharpen today's execution?`;
  }
}
