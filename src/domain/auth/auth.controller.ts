import {
  Body,
  Get,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger';
import {
  ExchangeCode,
  forgetPasswordDTO,
  resetPasswordDTO,
} from './dto/auth';
import { UniversalDecorator } from '../../common/decorators/universal.decorator';
import { createResponse } from '../../helper/response.helper';
import { GoogleAuthGuard } from 'src/core/guards/googleauth.guard';
import { createResponseType } from 'src/core/interfaces/types';

// Controller For Authentication Module
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  //google login http method
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  //google callback http method
  @ApiExcludeEndpoint()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.login(req.user);
    await this.authService.saveGoogleToken(req);
    const generateCode = await this.authService.generateCode(response);
    res.redirect(`${process.env.FRONTEND_URL}?code=${generateCode.code}`);
  }
  

  //exhcange code with jwt token
  @Post('exchange-code')
  @UniversalDecorator({
    summary: 'Exchange code to Token',
    responseType: ExchangeCode,
  })
  async exchangeCode(@Body() code: ExchangeCode): Promise<createResponseType> {
    const token = await this.authService.exchangeCodeWithToken(code.code);
    return createResponse(HttpStatus.OK, 'User Fetched Successfully', token);
  }

  //forget password http method
  @Post('forget-password')
  @UniversalDecorator({
    summary: 'Forget Password',
    responseType: forgetPasswordDTO,
  })
  async forgetPassword(
    @Body() forgetPasswordDTO: forgetPasswordDTO,
  ): Promise<createResponseType> {
    const response = await this.authService.forgetPassword(
      forgetPasswordDTO.email,
    );
    return createResponse(HttpStatus.OK, response.message);
  }

  //reset password http method
  @Post('reset-password')
  @UniversalDecorator({
    summary: 'Reset Password',
    responseType: resetPasswordDTO,
  })
  async resetPassword(
    @Body() resetPasswordDTO: resetPasswordDTO,
  ): Promise<createResponseType> {
    const response = await this.authService.resetPassword(resetPasswordDTO);
    return createResponse(
      HttpStatus.OK,
      'Password reset successfully',
      response,
    );
  }
}
