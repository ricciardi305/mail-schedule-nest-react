import { SendgridService } from './service/sendgrid.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('api/v1/sendgrid')
export class SendgridController {
  constructor(private readonly sendgridService: SendgridService) {}

  @Post()
  sendEmail(@Body() body) {
    return this.sendgridService.sendEmail(body);
  }
}
