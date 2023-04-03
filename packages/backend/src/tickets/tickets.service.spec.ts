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
});
