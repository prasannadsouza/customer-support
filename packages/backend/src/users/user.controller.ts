import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req, Request, UseGuards } from '@nestjs/common';
import { NewUser } from 'shared';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserServiceError, UsersService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private userService: UsersService) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createUsers(@Body() user: NewUser) {
    return await this.userService.addUser(user);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getUsers() {
    return await this.userService.findAll();
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  async deleteUser(@Param('id') id: number, @Request() req: any) {
    if (req.user.id == id) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'not allowed to delete self',
      }, HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.userService.remove(id);
    } catch (error: unknown) {
      if (error instanceof UserServiceError) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        }, HttpStatus.BAD_REQUEST);
      }

      throw error;
    }
  }
}
