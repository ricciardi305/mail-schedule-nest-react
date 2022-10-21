import { FindAllMailDto } from './dto/find-all-mail.dto';
import { SaveMailDto } from './dto/save-mail.dto';
import { MailEntity } from './mail.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailService } from './mail.service';
import { Repository } from 'typeorm';
import { MailStatusEnum } from './enum/mail-status.enum';

describe('MailService', () => {
  let mailService: MailService;
  let mailRepository: Repository<MailEntity>;

  const getMany = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: getRepositoryToken(MailEntity),
          // funções mock paro o jest
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnThis(),
            andWhere: jest.fn(),
            getMany,
            findOneByOrFail: jest.fn(),
            merge: jest.fn(),
          },
        },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
    // Recupera o repositório da entidade a ser testada
    mailRepository = module.get<Repository<MailEntity>>(
      getRepositoryToken(MailEntity),
    );
  });

  afterEach(() => {
    getMany.mockRestore();
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
    expect(mailRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return a mail list with sucess', async () => {
      // Arrange
      const mailEntityMockList = [
        { id: '1', dueDate: '2022-09-19T12:00:00Z' },
        { id: '2', dueDate: '2022-09-19T12:00:00Z' },
      ] as MailEntity[];
      getMany.mockResolvedValueOnce(mailEntityMockList);
      // Act
      const result = await mailService.findAll();
      // Assert
      expect(result).toHaveLength(2);
    });

    it('Should return a filtered mail list with dueDateLte', async () => {
      // Arrange
      const mailEntityMockList = [
        { id: '2', dueDate: '2022-09-19T12:00:00Z' },
      ] as MailEntity[];

      const params: Partial<FindAllMailDto> = {
        dueDateLte: '2022-09-19T12:00:00Z',
      };
      getMany.mockResolvedValueOnce(mailEntityMockList);
      // Act
      const result = await mailService.findAll(params);
      // Assert
      expect(result).toHaveLength(1);
    });

    it('Should return a filtered mail list with WAITING status', async () => {
      // Arrange
      const mailEntityMockList = [
        { id: '2', dueDate: '2022-09-19T12:00:00Z' },
      ] as MailEntity[];

      const params: Partial<FindAllMailDto> = {
        status: MailStatusEnum.WAITING,
      };
      getMany.mockResolvedValueOnce(mailEntityMockList);
      // Act
      const result = await mailService.findAll(params);
      // Assert
      expect(result).toHaveLength(1);
    });
  });

  describe('save', () => {
    it('Should save a new mail with success', async () => {
      // Arrange
      const data: SaveMailDto = {
        destinationName: 'User',
        destinationAddress: 'user@mail.com',
        dueDate: '2022-05-01-T12:00:00Z',
        subject: 'Email test',
        body: '<p>Hi</p>',
      };
      // Act
      const mailEntityMock = {
        ...data,
      } as MailEntity;

      // Retorna a entidade
      jest.spyOn(mailRepository, 'create').mockReturnValueOnce(mailEntityMock);
      // Retorna a promise resolvida da entidade
      jest.spyOn(mailRepository, 'save').mockResolvedValueOnce(mailEntityMock);

      const result = await mailService.save(data);
      // Assert
      expect(result).toBeDefined();
      expect(mailRepository.create).toBeCalledTimes(1);
      expect(mailRepository.save).toBeCalledTimes(1);
    });
  });

  describe('update status', () => {
    it('should update mail status with success', async () => {
      // Arrange
      const mailEntityMockList = [
        { id: '1', dueDate: '2022-09-19T12:00:00Z' },
        { id: '2', dueDate: '2022-09-19T12:00:00Z' },
      ] as MailEntity[];
      // Act
      const result = await mailService.updateStatus(
        mailEntityMockList[0].id,
        MailStatusEnum.SENT,
      );
      // Assert
      expect(result).toBeUndefined();
      expect(mailRepository.findOneByOrFail).toBeCalledTimes(1);
      expect(mailRepository.merge).toBeCalledTimes(1);
      expect(mailRepository.save).toBeCalledTimes(1);
    });
  });
});
