import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GooglecalenderModule } from './googlecalender/googlecalender.module';

@Module({
  imports: [AuthModule,UserModule, GooglecalenderModule],
})
export class DomainModule {}
