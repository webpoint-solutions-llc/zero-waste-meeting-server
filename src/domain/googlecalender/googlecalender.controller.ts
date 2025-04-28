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
  // @UseGuards(JwtAuthGuard)
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
    let accessToken = await this.authService.getgoogleAccessToken(userData);
    // //if accesstoken not found 
    // // if (!accessToken) {
    // let  accessToken = process.env.GOOGLE_AUTH_TOKEN
    
    return await this.googlecalenderService.generateMonthlyReport(accessToken);
  }
  @Get('/dailyreport')
  @UniversalDecorator({
    summary: 'Get Google Calendar Events',
    responseType: CalendarEventDto,
  })

  @UseGuards(JwtAuthGuard)
  async getDailyEventList(@Req() req: any): Promise<any> {
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

  @Get('/weeklyreport')
  @UniversalDecorator({
    summary: 'Get Google Calendar Events',
    responseType: CalendarEventDto,
  })
  @UseGuards(JwtAuthGuard)
  async getWeeklyEventList(@Req() req: any): Promise<any> {
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
    return await this.googlecalenderService.generateWeeklyReport(accessToken);
  }

  @Get("/productivehourmetting")
  @UniversalDecorator({
    summary: 'Get Google Calendar Events',
    responseType: CalendarEventDto,
  })
  @UseGuards(JwtAuthGuard)
  async getProductiveHourMetting(@Req() req: any): Promise<any> {
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
    return await this.googlecalenderService.getMeetingsInProductiveHoursToday(accessToken);
  }
  //get teem meeting wise data
}
