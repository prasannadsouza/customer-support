import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UserSubscriber } from './users.subscriber';

@Module({
  providers: [UsersService, UserSubscriber],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController]
})
export class UsersModule {}
