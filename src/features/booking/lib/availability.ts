import { WEEKLY_SCHEDULE } from "@/config/site";

import type { DaySchedule } from "@/types";

const DEFAULT_OPEN_TIME = "09:30";
const DEFAULT_CLOSE_TIME = "20:00";

function weekdayToScheduleIndex(weekday: number): number {
  // JS weekday: 0 = Sunday. WEEKLY_SCHEDULE starts on Monday.
  return weekday === 0 ? 6 : weekday - 1;
}

export function getScheduleForDate(date: Date): DaySchedule {
  return WEEKLY_SCHEDULE[weekdayToScheduleIndex(date.getDay())];
}

function formatISODay(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Returns the next opening days (starting tomorrow) as ISO dates (YYYY-MM-DD).
 */
export function getNextBookingDays(limit: number): string[] {
  const days: string[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (days.length < limit) {
    cursor.setDate(cursor.getDate() + 1);

    if (!getScheduleForDate(cursor).closed) {
      days.push(formatISODay(cursor));
    }
  }

  return days;
}

type TimeSlotsParams = {
  dayISO: string;
  durationMinutes: number;
  opensAt?: string;
  closesAt?: string;
};

/**
 * Generates ISO starting times for a given day and service duration.
 * Past slots for today are never returned.
 */
export function createTimeSlots({
  dayISO,
  durationMinutes,
  opensAt = DEFAULT_OPEN_TIME,
  closesAt = DEFAULT_CLOSE_TIME
}: TimeSlotsParams): string[] {
  const openTime = new Date(`${dayISO}T${opensAt}:00`);
  const closeTime = new Date(`${dayISO}T${closesAt}:00`);
  const slots: string[] = [];
  const cursor = new Date(openTime);

  while (cursor.getTime() + durationMinutes * 60_000 <= closeTime.getTime()) {
    if (cursor.getTime() > Date.now()) {
      slots.push(cursor.toISOString());
    }

    cursor.setMinutes(cursor.getMinutes() + durationMinutes);
  }

  return slots;
}

/**
 * Mock occupancy mark for the template. A deterministic hash of the ISO date
 * "occupies" a fraction of slots so the UI can show disabled options.
 */
export function isSlotTaken(slotISO: string): boolean {
  const seed = [...slotISO].reduce((total, char) => total + char.charCodeAt(0), 0);
  return seed % 7 === 0;
}