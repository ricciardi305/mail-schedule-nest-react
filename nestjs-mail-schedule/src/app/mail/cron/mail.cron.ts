import { SendgridService } from './../../sendgrid/service/sendgrid.service';
import { MailService } from './../mail.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailStatusEnum } from '../enum/mail-status.enum';
import { SendEmailInterface } from 'src/app/sendgrid/interface/send-email.interface';

@Injectable()
export class MailCron {
  private logger = new Logger(MailCron.name);
  constructor(
    private readonly mailService: MailService,
    private readonly sendGridService: SendgridService,
  ) {}
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handler() {
    const mailList = await this.mailService.findAll({
      dueDateLte: new Date().toISOString(),
      status: MailStatusEnum.WAITING,
    });

    for (const mail of mailList) {
      this.logger.log(mail.destinationAddress);

      const data: SendEmailInterface = {
        personalizations: [
          {
            to: [
              {
                name: mail.destinationName,
                email: mail.destinationAddress,
              },
            ],
          },
        ],
        from: {
          email: 'mrricciardi305@gmail.com',
          name: 'Rafael',
        },
        reply_to: {
          email: 'mrricciardi305@gmail.com',
          name: 'Suporte',
        },
        subject: mail.subject,
        content: [
          {
            type: 'text/html',
            value: mail.body,
          },
        ],
      };
      await this.sendGridService.sendEmail(data);
      await this.mailService.updateStatus(mail.id, MailStatusEnum.SENT);
      this.logger.log('Email enviado com sucesso');
    }
  }
}
