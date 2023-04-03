import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmSQLITETestingModule } from 'src/test-utils/typeorm-sqlite-testingmodule';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

const testingSecret = "testingsecret"

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, AuthService],
      imports: [JwtModule.register({
        secret: testingSecret,
        signOptions: { expiresIn: '30m' },
      }), ...TypeOrmSQLITETestingModule(User)]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
