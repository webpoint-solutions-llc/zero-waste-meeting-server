import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import {
  calculateMinutes,
  formatDateTime,
  getAuth,
  getNepalDateRange,
  isInProductiveHours,
} from 'src/utils/google-calendar.utils';

@Injectable()
export class GooglecalenderService {
  private calendar = google.calendar('v3');

  async fetchEvents(accessToken: string, type: 'daily' | 'weekly' | 'monthly') {
    const auth = getAuth(accessToken);
    const calendar = google.calendar({ version: 'v3', auth });
    const { timeMin, timeMax } = getNepalDateRange(type);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 500,
    });
    //exclude meetingName = "office"
    const events = response.data.items || [];
    console.log(events);
    const filteredEvents = events.filter((event) => event.summary !== 'Office');
    return filteredEvents;

    // return response.data.items || [];
  }

  async getTotalMeetingsToday(accessToken: string) {
    const events = await this.fetchEvents(accessToken, 'daily');
    const totalMeetings = events.length;
    const totalMinutes = events.reduce((sum, event) => {
      const start = event.start.dateTime || event.start.date;
      const end = event.end.dateTime || event.end.date;
      return sum + calculateMinutes(start, end);
    }, 0);

    return {
      totalMeetings,
      totalMinutes,
      totalHours: (totalMinutes / 60).toFixed(2),
    };
  }

  async getMeetingsInProductiveHoursToday(accessToken: string) {
    const events = await this.fetchEvents(accessToken, 'daily');

    const productiveEvents = events.filter((event) => {
      const start = event.start.dateTime || event.start.date;
      const startDate = new Date(start);
      return isInProductiveHours(startDate);
    });

    return productiveEvents.map((event) => ({
      summary: event.summary,
      start: formatDateTime(event.start.dateTime || event.start.date),
      end: formatDateTime(event.end.dateTime || event.end.date),
      durationMinutes: calculateMinutes(
        event.start.dateTime || event.start.date,
        event.end.dateTime || event.end.date,
      ),
    }));
  }

  async getTeamMeetingWiseData(accessToken: string) {
    const events = await this.fetchEvents(accessToken, 'daily');

    return events.map((event) => {
      const attendees = event.attendees || [];
      const totalMinutes = calculateMinutes(
        event.start.dateTime || event.start.date,
        event.end.dateTime || event.end.date,
      );
      const totalAttendees = attendees.length;
      //total attendees with yes status
      const totalAttendeesWithStatus = attendees.filter(
        (attendee) => attendee.responseStatus === 'accepted',
      ).length;
      return {
        meetingName: event.summary,
        attendees: attendees.map((attendee) => attendee.email),
        totalMinutesSpent: totalMinutes,
        totalAttendees: totalAttendees,
        totalAttendeesWithStatus: totalAttendeesWithStatus,
      };
    });
  }

  async getLiveRecentMeetings(accessToken: string) {
    const events = await this.fetchEvents(accessToken, 'daily');

    const sortedEvents = events.sort((a, b) => {
      const aStart = new Date(a.start.dateTime || a.start.date).getTime();
      const bStart = new Date(b.start.dateTime || b.start.date).getTime();
      return bStart - aStart;
    });

    return sortedEvents.slice(0, 5).map((event) => ({
      summary: event.summary,
      start: formatDateTime(event.start.dateTime || event.start.date),
    }));
  }

  async generateDailyReport(accessToken: string) {
    const totalMeetingsToday = await this.getTotalMeetingsToday(accessToken);
    const productiveMeetings =
      await this.getMeetingsInProductiveHoursToday(accessToken);
    const teamMeetings = await this.getTeamMeetingWiseData(accessToken);

    return {
      date: new Date().toLocaleDateString('en-US', {
        timeZone: 'Asia/Kathmandu',
      }),
      totalMeetingsToday,
      productiveMeetings,
      teamMeetings,
    };
  }

  async generateWeeklyReport(accessToken: string) {
    const events = await this.fetchEvents(accessToken, 'weekly');
    const totalMeetings = events.length;
    const totalMinutes = events.reduce((sum, event) => {
      const start = event.start.dateTime || event.start.date;
      const end = event.end.dateTime || event.end.date;
      return sum + calculateMinutes(start, end);
    }, 0);

    return {
      weekStart: formatDateTime(new Date().toISOString()),
      totalMeetings,
      totalMinutes,
      totalHours: (totalMinutes / 60).toFixed(2),
    };
  }

  async generateMonthlyReport(accessToken: string) {
    const events = await this.fetchEvents(accessToken, 'monthly');
    const totalMeetings = events.length;
    const totalMinutes = events.reduce((sum, event) => {
      const start = event.start.dateTime || event.start.date;
      const end = event.end.dateTime || event.end.date;
      return sum + calculateMinutes(start, end);
    }, 0);

    return {
      month: new Date().toLocaleString('en-US', {
        month: 'long',
        timeZone: 'Asia/Kathmandu',
      }),
      totalMeetings,
      totalMinutes,
      totalHours: (totalMinutes / 60).toFixed(2),
    };
  }
}
