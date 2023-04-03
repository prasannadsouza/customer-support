import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmSQLITETestingModule } from 'src/test-utils/typeorm-sqlite-testingmodule';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [...TypeOrmSQLITETestingModule(User)]
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
