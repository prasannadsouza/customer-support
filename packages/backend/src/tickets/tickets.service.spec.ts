import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmSQLITETestingModule } from 'src/test-utils/typeorm-sqlite-testingmodule';
import { User } from 'src/users/user.entity';
import { Ticket } from './ticket.entity';
import { TicketsService } from './tickets.service';
import { UsersService } from 'src/users/users.service';

describe('TicketsService', () => {
  let service: TicketsService;
  let usersService: UsersService; 
  let user: User;
  let firstTicket: Ticket;
  let secondTicket: Ticket;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketsService, UsersService],
      imports: [...TypeOrmSQLITETestingModule(User, Ticket)]
    }).compile();
    service = module.get<TicketsService>(TicketsService);
    usersService = module.get<UsersService>(UsersService);
    await clearAllTickets();
    await clearAllUsers();
    await usersService.addUser({ email: "test@test.com",password:"test", role:"admin" });
    user = await usersService.findAll()[0];
  });

 afterAll(async () => {
    await clearAllTickets();
    await clearAllUsers();
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

    const { count, tickets } = await service.findAll()
    expect(count).toBe(1);
    expect(firstTicket.assignedToId).toBe(user.id);
    console.log("firstticket", firstTicket);
  })

  it('should create another ticket and not assign', async () => {
    const testTicket = {
      subject: 'testticket1',
      description: 'testdescription2',
      createdByEmail: 'testemail@test.com'
    };

    secondTicket = await service.create(testTicket);
    expect(secondTicket).toBeDefined()
    const { count } = await service.findAll()
    expect(count).toBe(2);

    secondTicket = await service.findOne(secondTicket.id);
    expect(secondTicket.assignedTo).toBe(null);
    console.log("secondticket", secondTicket);
  });

  it('should resolve the ticket', async () => {
    verifyResolveTicket(firstTicket);
  });

  it('should assign and resolve the ticket', async () => {
    await service.assignTicket(secondTicket.id, firstTicket.assignedToId);
    secondTicket = await service.findOne(secondTicket.id);
    console.log("assign secondticket", secondTicket);
    expect(secondTicket.assignedTo.id).toBe(user.id)
    verifyResolveTicket(secondTicket);
  });

  const verifyResolveTicket = async (ticket: Ticket) => {
    
    await service.resolveTicket(ticket.id, ticket.assignedToId, "resolved");
    ticket = await service.findOne(ticket.id);
    expect(ticket.resolved).toBeTruthy()
    expect(ticket.resolution).toBe("resolved");
    console.log("resolvedticket", ticket);
  }

  const clearAllTickets = async() => {
    const { tickets } = await service.findAll();
    tickets.forEach(async (e)=> await service.remove(e.Id));
  }

  const clearAllUsers = async() => {
    const users = await usersService.findAll();
    users.forEach(async (e)=> await usersService.remove(e.id));
  }
});
