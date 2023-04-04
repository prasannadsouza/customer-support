import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewUser } from 'shared';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit(): Promise<void> {
    if (!await this.usersRepository.exist({
      where: {
        email: process.env.ADMINUSER,
      }
    })) {
      await this.addUser({
        email: process.env.ADMINUSER,
        password: process.env.ADMINPASSWORD,
        role: 'admin'
      });
    }
  }

  async addUser(user: NewUser) {
    await this.usersRepository.save(user);
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      select: {
        email: true, id: true, password: true, role: true
      },
      where: { email }
    });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
    console.log("removeing user", user);
    if (user.email === process.env.ADMINUSER) {
      throw new UserServiceError("not allowed to delete admin");
    }

    await this.usersRepository.delete(id);
  }
}

export class UserServiceError extends Error {}
