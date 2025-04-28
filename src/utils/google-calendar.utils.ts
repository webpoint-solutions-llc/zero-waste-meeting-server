// src/utils/google-calendar.utils.ts
import { google } from 'googleapis';

export function getAuth(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return auth;
}

export function formatDateTime(date: string | undefined) {
  if (!date) return null;
  return new Date(date).toLocaleString('en-US', {
    timeZone: 'Asia/Kathmandu',
    hour12: true,
  });
}

export function getNepalDateRange(range: 'daily' | 'weekly' | 'monthly') {
  const nepalOffset = 5 * 60 * 60 * 1000 + 45 * 60 * 1000;
  const now = new Date(Date.now() + nepalOffset);
  let start: Date, end: Date;

  if (range === 'daily') {
    start = new Date(now);
    start.setHours(0, 0, 0, 0);

    end = new Date(now);
    end.setHours(23, 59, 59, 999);
  } else if (range === 'weekly') {
    const day = now.getDay(); // Sunday = 0
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    start = new Date(now.setDate(diff));
    start.setHours(0, 0, 0, 0);

    end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  return {
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
  };
}

export function calculateMinutes(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.floor(diffMs / 60000); // convert milliseconds to minutes
}

export function isInProductiveHours(startTime: Date) {
    const kathmanduTime = new Date(startTime).toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });
    const localDate = new Date(kathmanduTime);
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();
  
    // Productive hours: 9:30–11:30 AM and 12:30–3:30 PM (3:30 PM excluded)
    const morningStart = 9 * 60 + 30;
    const morningEnd = 11 * 60 + 30;
    const afternoonStart = 12 * 60 + 30;
    const afternoonEnd = 15 * 60 + 30; // 3:30 PM is excluded, hence use 15:30
    
    const currentMinutes = hours * 60 + minutes;
  
    // Check if time falls within productive hours
    return (
      (currentMinutes >= morningStart && currentMinutes < morningEnd) || // 11:30 AM exclusive
      (currentMinutes >= afternoonStart && currentMinutes < afternoonEnd) // 3:30 PM exclusive
    );
  }
  
