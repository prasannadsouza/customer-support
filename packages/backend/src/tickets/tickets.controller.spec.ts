import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmSQLITETestingModule } from 'src/test-utils/typeorm-sqlite-testingmodule';
import { User } from 'src/users/user.entity';
import { Ticket } from './ticket.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

describe('TicketsController', () => {
  let controller: TicketsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [TicketsService],
      imports: [...TypeOrmSQLITETestingModule(User, Ticket)]
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
