'use client';

import React, { useState } from 'react';
import { Calendar, Download, ExternalLink, Clock, Check, Bell } from 'lucide-react';
import {
  BRUCE_DAILY_SCHEDULE,
  downloadBruceCalendarIcs,
  getGoogleCalendarUrl,
} from '@/lib/calendarExport';
import { soundEffects } from '@/lib/feedbackAudio';

export default function CalendarSyncCard() {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    soundEffects.playSuccessChime();
    downloadBruceCalendarIcs();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3500);
  };

  return (
    <div className="arc-card p-5 bg-white border border-[#E8EEF5] shadow-sm rounded-3xl space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0085FF] to-[#7B61FF] text-white flex items-center justify-center text-lg shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#0A192F] tracking-tight">Calendar Alarms & Routine Sync</h3>
            <p className="text-[10px] text-[#64748B] font-medium">
              Sync 5:30 AM wake-up, workouts & meals to your phone's native calendar
            </p>
          </div>
        </div>
        <span className="text-[9px] font-black text-[#0085FF] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 uppercase">
          Daily Recurring
        </span>
      </div>

      {/* Schedule Items Preview */}
      <div className="space-y-2 pt-1">
        {BRUCE_DAILY_SCHEDULE.map((item, idx) => {
          const hStr = item.startHour.toString().padStart(2, '0');
          const mStr = item.startMinute.toString().padStart(2, '0');
          const ampm = item.startHour >= 12 ? 'PM' : 'AM';
          const displayH = item.startHour % 12 || 12;

          return (
            <div
              key={idx}
              className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2 hover:bg-blue-50/50 hover:border-blue-200 transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base shrink-0">{item.emoji}</span>
                <div className="min-w-0">
                  <p className="text-xs font-black text-[#0A192F] truncate">{item.title}</p>
                  <p className="text-[10px] text-slate-500 truncate">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                  {displayH}:{mStr} {ampm}
                </span>
                <a
                  href={getGoogleCalendarUrl(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg text-slate-400 hover:text-[#0085FF] hover:bg-white"
                  title="Add this event to Google Calendar"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary 1-Click Sync Button */}
      <div className="pt-2">
        <button
          onClick={handleDownload}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#0085FF] to-[#7B61FF] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition active:scale-98"
        >
          {downloaded ? (
            <>
              <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
              <span>Routine Downloaded! Open file to add to Calendar</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export All 5 Daily Alarms (.ics for Phone & Google Calendar)</span>
            </>
          )}
        </button>
        <p className="text-center text-[10px] text-[#94A3B8] font-medium mt-2">
          Compatible with Android Google Calendar, Apple iCal, Samsung & Windows Calendar
        </p>
      </div>
    </div>
  );
}
