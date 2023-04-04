import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'shared';
import { User } from 'src/users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthenticationProvider } from './auth.provider';

type UserRegistration = {
  email: string
  password: string
};

export type Login = UserRegistration;

export type LoginResponse = Omit<User, "password">;

export type TokenInfo = {
  email: string
  id: number
  role: string
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<LoginResponse> {
    const user = await this.usersService.findOne(email.toLowerCase());
    if (!user) {
      return null;
    }

    const valid = await AuthenticationProvider.confirmPassword(user.password, pass);
    if (!valid) {
      return null;
    }

    const { password, ...result } = user;
    return result;
  }

  async login(user: LoginResponse): Promise<Token> { // called after validate
    const payload: TokenInfo = { email: user.email, id: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload)
    return {
      access_token: token,
      role: user.role,
      id: user.id,
    };
  }
}
