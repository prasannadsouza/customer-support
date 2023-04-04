import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmSQLITETestingModule } from 'src/test-utils/typeorm-sqlite-testingmodule';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Ticket } from './ticket.entity';
import { TicketsService } from './tickets.service';

describe('TicketsService', () => {
  let service: TicketsService;
  let usersService: UsersService;
  let user: User;
  let firstTicket: Ticket;
  let secondTicket: Ticket;
  let thirdTicket: Ticket;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketsService, UsersService],
      imports: [...TypeOrmSQLITETestingModule(User, Ticket)]
    }).compile();
    service = module.get<TicketsService>(TicketsService);
    usersService = module.get<UsersService>(UsersService);
    await usersService.addUser({ email: "test@test.com", password: "test", role: "admin" });
    const allUsers = await usersService.findAll();
    user = allUsers[0];
  });

  afterAll(async () => {
    await service.removeAll();
    await usersService.removeAll();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create ticket and auto assign', async () => {
    const testTicket = {
      subject: 'testticket',
      description: 'testdescription',
      createdByEmail: 'testemail@test.com'
    };

    firstTicket = await service.create(testTicket);
    expect(firstTicket).toBeDefined()

    const { count, tickets } = await service.findAll(user.id)
    expect(count).toBe(1);
    expect(firstTicket.assignedToId).toBe(user.id);
    verifyResolveTicket(firstTicket);
    
  })

  it('should create another ticket and not assign', async () => {
    const testTicket = {
      subject: 'testticket1',
      description: 'testdescription2',
      createdByEmail: 'testemail@test.com'
    };

    secondTicket = await service.create(testTicket);
    expect(secondTicket).toBeDefined()
    let count  = await (await service.findAll(user.id)).count
    expect(count).toBe(2);

     thirdTicket = await service.create(testTicket);
    expect(thirdTicket).toBeDefined()
    count  = await (await service.findAll(user.id)).count
    expect(count).toBe(3);

    thirdTicket = await service.findOne(thirdTicket.id);
    expect(thirdTicket.assignedTo).toBe(null);

    
    /* console.log("thirdTicket",thirdTicket.id,"userid", user.id)
    await service.assignTicket(user.id,thirdTicket.id);
    thirdTicket = await service.findOne(thirdTicket.id);

    expect(thirdTicket.assignedTo.id).toBe(user.id)
    verifyResolveTicket(thirdTicket); 
 */
  });

  const verifyResolveTicket = async (ticket: Ticket) => {
    await service.resolveTicket(ticket.id, ticket.assignedToId, "resolved");
    ticket = await service.findOne(ticket.id);
    expect(ticket.resolved).toBeTruthy()
    expect(ticket.resolution).toBe("resolved");
  }
});
