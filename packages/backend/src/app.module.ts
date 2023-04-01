import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from "./users/user.entity";
import { Ticket } from './tickets/ticket.entity';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: "./local.db",
      entities: [User, Ticket],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    UsersModule,
    TicketsModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
