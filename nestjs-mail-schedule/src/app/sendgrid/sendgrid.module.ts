import { SendgridService } from './service/sendgrid.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SendgridController } from './sendgrid.controller';

@Module({
  imports: [HttpModule],
  providers: [SendgridService],
  controllers: [SendgridController],
  exports: [SendgridService],
})
export class SendgridModule {}
