import { Test, TestingModule } from '@nestjs/testing';
import { SendgridService } from '../../sendgrid/service/sendgrid.service';
import { MailEntity } from '../mail.entity';
import { MailService } from '../mail.service';
import { MailCron } from './mail.cron';

describe('MailCron', () => {
  let mailService: MailService;
  let mailCron: MailCron;
  let sendGridService: SendgridService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailCron,
        {
          provide: MailService,
          useValue: {
            findAll: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
        {
          provide: SendgridService,
          useValue: { sendEmail: jest.fn() },
        },
      ],
    }).compile();

    mailCron = module.get<MailCron>(MailCron);
    mailService = module.get<MailService>(MailService);
    sendGridService = module.get<SendgridService>(SendgridService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
    expect(mailCron).toBeDefined();
    expect(sendGridService).toBeDefined();
  });

  describe('handler', () => {
    it('should send an email every 10 seconds', async () => {
      // Arrange
      const mailEntityMockList = [
        { id: '1', dueDate: '2022-09-19T12:00:00Z' },
        { id: '2', dueDate: '2022-09-19T12:00:00Z' },
      ] as MailEntity[];

      jest
        .spyOn(mailService, 'findAll')
        .mockResolvedValueOnce(mailEntityMockList);
      jest.spyOn(sendGridService, 'sendEmail').mockResolvedValueOnce(true);
      jest.spyOn(mailService, 'updateStatus').mockResolvedValueOnce(undefined);
      // Act
      const result = await mailCron.handler();
      // Assert
      expect(result).toBeUndefined();
      expect(mailService.findAll).toBeCalledTimes(1);
      expect(mailService.updateStatus).toBeCalledTimes(2);
      expect(mailService.updateStatus).not.toBeCalledTimes(3);
      expect(sendGridService.sendEmail).toBeCalledTimes(2);
    });
  });
});
