import { SendgridModule } from './../sendgrid/sendgrid.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailEntity } from './mail.entity';
import { MailController } from './mail.controller';
import { MailCron } from './cron/mail.cron';

@Module({
  imports: [TypeOrmModule.forFeature([MailEntity]), SendgridModule],
  providers: [MailService, MailCron],
  controllers: [MailController],
})
export class MailModule {}
