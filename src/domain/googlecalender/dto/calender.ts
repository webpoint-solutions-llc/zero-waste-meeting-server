import { ApiProperty } from '@nestjs/swagger';

export class CalendarEventDto {
  @ApiProperty({ example: 'Office', description: 'Name of the meeting' })
  meetingName: string;

  @ApiProperty({
    type: [String],
    description: 'List of attendee email addresses or names',
    example: [],
  })
  attendees: string[];

  @ApiProperty({ example: 1440, description: 'Total minutes spent in the meeting' })
  totalMinutesSpent: number;
}
