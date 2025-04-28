import { Module } from '@nestjs/common';
import { GooglecalenderService } from './googlecalender.service';
import { GooglecalenderController } from './googlecalender.controller';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [GooglecalenderController],
  providers: [GooglecalenderService],
  exports: [],
})
export class GooglecalenderModule {}
