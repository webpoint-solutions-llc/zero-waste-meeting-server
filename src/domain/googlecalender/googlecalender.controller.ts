import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GooglecalenderService } from './googlecalender.service';
import { UniversalDecorator } from 'src/common/decorators/universal.decorator';
import { JwtAuthGuard } from 'src/core/guards/auth.guard';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { CalendarEventDto } from './dto/calender';

@Controller('googlecalender')
export class GooglecalenderController {
  constructor(
    private readonly googlecalenderService: GooglecalenderService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UniversalDecorator({
    summary: 'Get Google Calendar Events',
    responseType: 'Google Calendar Events',
  })
  @UseGuards(JwtAuthGuard)
  async getEvents(@Req() req: any): Promise<any> {
    const user = req.user as any;
    const userData = await this.userService.findoneByid(user.id);
    if (!userData) {
      throw new Error('User not found.');
    }
    if (
      !userData ||
      !userData.googleAccessToken
    ) {
      throw new Error('No Google access token found for the user.');
    }
    const accessToken = await this.authService.getgoogleAccessToken(userData);
    return await this.googlecalenderService.generateDailyReport(accessToken);
  }
  @Get('/monthreport')
  @UniversalDecorator({
    summary: 'Get Google Calendar Events',
    responseType: CalendarEventDto,
  })
  @UseGuards(JwtAuthGuard)
  async getMonthlyEventList(@Req() req: any): Promise<any> {
    const user = req.user as any;
    const userData = await this.userService.findoneByid(user.id);
    if (!userData) {
      throw new Error('User not found.');
    }
    if (
      !userData ||
      !userData.googleAccessToken
    ) {
      throw new Error('No Google access token found for the user.');
    }
    const accessToken = await this.authService.getgoogleAccessToken(userData);
    return await this.googlecalenderService.getTeamMeetingWiseData(accessToken);
  }
}
