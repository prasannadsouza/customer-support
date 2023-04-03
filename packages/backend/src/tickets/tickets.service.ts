import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AllTicketsResult, CreateTicket } from 'shared';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(ticket: CreateTicket): Promise<Ticket> {
    const user = await this.userRepository.createQueryBuilder('u')
      .leftJoin((qb) => qb
        .distinctOn(['assignedToId'])
        .from(Ticket, 'ticket')
        .where('ticket.resolved != :resolved', {
          resolved: true
        }), 'unresolved_tickets', 'u.id = unresolved_tickets.assignedToId')
      .where('unresolved_tickets.assignedToId IS NULL')
      .limit(1).getOne();

    const created = await this.ticketRepository.save({
      ...ticket,
      resolved: false,
      assignedToId: user?.id ?? null,
      resolution: ""
    });

    return created;
  }

  async findAll(pageNo: number = 0, sortBy: string = ''): Promise<AllTicketsResult> {
    const tickets = await this.ticketRepository.find({
      relations: {
        assignedTo: true
      },
      take: 5,
      skip: pageNo * 5,
    });
    const count = await this.ticketRepository.count();

    return { tickets, count };
  }

  async findOne(id: number): Promise<Ticket> {
    return await this.ticketRepository.findOne({
      relations: {
        assignedTo: true
      },
      where: {
        id: id,
      }
    });
  }

  async resolveTicket(ticketId: number, userId: number, resolution: string) {
    var alreadyAssigned = await this.ticketRepository
      .exist({
        where: {
          id: ticketId,
          assignedToId: userId,
          resolved: false
        }
      });
    if (!alreadyAssigned) {
      throw new TicketsServiceError("ticket not assigned to user");
    }

    if (resolution == "") {
      throw new TicketsServiceError("resolution needed");
    }

    const result = await this.ticketRepository.update(ticketId, { resolved: true, resolution });
    if (result.affected < 1) {
      throw new TicketsServiceError("ticket not found");
    }
  }

  async assignTicket(userId: number, ticketId: number) {
    var alreadyAssigned = await this.ticketRepository
      .exist({ where: { assignedToId: userId, resolved: false } });
      console.log("userid", userId, "ticketid", ticketId)
    if (alreadyAssigned) {
      throw new TicketsServiceError("user already has ticket");
    }

    const result = await this.ticketRepository.update(ticketId, { assignedToId: userId });
    if (result.affected < 1) {
      throw new TicketsServiceError("ticket not found");
    }
  }
}

export class TicketsServiceError extends Error {}
