import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmSQLITETestingModule } from 'src/test-utils/typeorm-sqlite-testingmodule';
import { User } from 'src/users/user.entity';
import { Ticket } from './ticket.entity';
import { TicketsService } from './tickets.service';

describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketsService],
      imports: [...TypeOrmSQLITETestingModule(User, Ticket)]
    }).compile();
    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create ticket', async () => {
    const testTicket = {
      subject: 'testticket',
      description: 'testdescription',
      createdByEmail: 'testemail@test.com'
    };

    const ticket = await service.create(testTicket);
    expect(ticket).toBeDefined()

    const { count } = await service.findAll()
    expect(count).toBe(1);
  })
});
