import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicket } from 'shared';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';

export type ResolveTicket = {
  resolution: string
};

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

  async findAll(): Promise<Ticket[]> {
    return await this.ticketRepository.find();
  }

  async resolveTicket(ticketId: number, userId: number, resolution: string) {
    let user = await this.userRepository.findOneBy({ id: userId });
    if (user == null) {
      throw new TicketsServiceError("user not found");
    }

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

    const result = await this.ticketRepository.update(ticketId, { resolved: true, resolution });
    if (result.affected < 1) {
      throw new TicketsServiceError("ticket not found");
    }
  }

  async assignTicket(userId: number, ticketId: number) {
    let user = await this.userRepository.findOneBy({ id: userId });
    if (user == null) {
      throw new TicketsServiceError("user not found");
    }

    var alreadyAssigned = await this.ticketRepository
      .exist({ where: { assignedToId: userId, resolved: false } });
    if (alreadyAssigned) {
      throw new TicketsServiceError("user already has ticket");
    }

    const result = await this.ticketRepository.update(ticketId, { assignedTo: user });
    if (result.affected < 1) {
      throw new TicketsServiceError("ticket not found");
    }
  }
}

export class TicketsServiceError extends Error {}
