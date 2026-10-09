// Google Calendar & RFC 5545 iCalendar (.ics) Routine Exporter for Bruce
// Generates recurring daily calendar blocks for Bruce's 2027 Winter Arc

export interface CalendarEventDef {
  title: string;
  description: string;
  startHour: number;
  startMinute: number;
  durationMinutes: number;
  colorHex?: string;
  emoji: string;
}

export const BRUCE_DAILY_SCHEDULE: CalendarEventDef[] = [
  {
    title: '🌅 Rise & AM Skin Barrier Shield',
    description: 'Rise without snooze. Drink 500ml water. AM Protocol: Gentle cleanser, Ceramide cream, 5% Niacinamide, UV Doux SPF 50+ non-negotiable sunscreen.',
    startHour: 5,
    startMinute: 30,
    durationMinutes: 30,
    emoji: '🌅',
  },
  {
    title: '🏋️ Bruce Gym Hypertrophy (PPL)',
    description: 'Heavy progressive overload session. Push / Pull / Legs split. Rest timer 60-90s. Target Greek God 63kg physique.',
    startHour: 6,
    startMinute: 30,
    durationMinutes: 75,
    emoji: '🏋️',
  },
  {
    title: '🌾 North Karnataka High-Protein Lunch',
    description: '2 Jolada Rotti + Sprouted Hesaru Usli / Kadle Saaru + Shengdana Chutney + 1 glass cold Taak (Majjige). 35g+ pure veg protein.',
    startHour: 13,
    startMinute: 0,
    durationMinutes: 45,
    emoji: '🌾',
  },
  {
    title: '🧴 PM Skin Repair & Arc Reflection',
    description: 'Ice therapy, 10% Azelaic Acid on dark spots, Ceramide barrier seal, Rosehip seed oil. Log Day progress & photos in Bruce Arc App.',
    startHour: 21,
    startMinute: 0,
    durationMinutes: 30,
    emoji: '🧴',
  },
  {
    title: '🌙 Deep Sleep & Muscle Hypertrophy',
    description: 'Zero screens. Haldi doodh with walnuts/ashwagandha. 8 hours of restorative sleep. Muscle grows and skin heals tonight.',
    startHour: 21,
    startMinute: 30,
    durationMinutes: 480, // 8 hours
    emoji: '🌙',
  },
];

function formatIcsDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const mins = pad(date.getUTCMinutes());
  const secs = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${mins}${secs}Z`;
}

/**
 * Generates and triggers download of a standardized .ics calendar file
 * Compatible with Google Calendar, Apple Calendar, Outlook, Android
 */
export function downloadBruceCalendarIcs() {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bruce Glow-Up 2027//Winter Arc Protocol//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Bruce Arc 2027 Routine',
    'X-WR-TIMEZONE:Asia/Kolkata',
  ];

  BRUCE_DAILY_SCHEDULE.forEach((ev, idx) => {
    const evStart = new Date(startDate);
    evStart.setHours(ev.startHour, ev.startMinute, 0, 0);

    const evEnd = new Date(evStart.getTime() + ev.durationMinutes * 60 * 1000);

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:bruce-arc-2027-${idx}-${Date.now()}@bruce.glowup`,
      `DTSTAMP:${formatIcsDate(now)}`,
      `DTSTART:${formatIcsDate(evStart)}`,
      `DTEND:${formatIcsDate(evEnd)}`,
      'RRULE:FREQ=DAILY;UNTIL=20271231T235959Z',
      `SUMMARY:${ev.title}`,
      `DESCRIPTION:${ev.description.replace(/\n/g, '\\n')}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT10M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${ev.title}`,
      'END:VALARM',
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bruce_winter_arc_schedule.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Creates direct Google Calendar URL for an individual block
 */
export function getGoogleCalendarUrl(ev: CalendarEventDef): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  const startYear = now.getFullYear();
  const startMonth = pad(now.getMonth() + 1);
  const startDay = pad(now.getDate());

  const startH = pad(ev.startHour);
  const startM = pad(ev.startMinute);

  const endTotalMins = ev.startHour * 60 + ev.startMinute + ev.durationMinutes;
  const endH = pad(Math.floor(endTotalMins / 60) % 24);
  const endM = pad(endTotalMins % 60);

  const datesStr = `${startYear}${startMonth}${startDay}T${startH}${startM}00/${startYear}${startMonth}${startDay}T${endH}${endM}00`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.title,
    dates: datesStr,
    details: ev.description,
    recur: 'RRULE:FREQ=DAILY;UNTIL=20271231T235959Z',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
