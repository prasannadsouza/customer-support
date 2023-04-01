import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { User } from 'src/users/user.entity';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
  imports: [TypeOrmModule.forFeature([Ticket]), TypeOrmModule.forFeature([User])]
})

export class TicketsModule {}
