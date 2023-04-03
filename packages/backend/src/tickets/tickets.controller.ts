import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { CreateTicket, ResolveTicket } from "shared";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { TicketsService, TicketsServiceError } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  async create(@Body() ticket: CreateTicket) {
    return this.ticketsService.create(ticket);
  }

  @Roles('admin', 'support')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query("pageNo") pageNo: number = 0, @Query("sortBy") sortBy: string = '',
    @Request() req: any) {
    return this.ticketsService.findAll(req.user.id, pageNo, sortBy)
  }

  @Roles('admin', 'support')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ticketsService.findOne(id);
  }

  @Roles('admin', 'support')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async assignTicket(@Param('id') id: number, @Request() req: any) {
    const userId = req.user.id;
    try {
      console.log("userid", userId, "ticketid", id);
      return await this.ticketsService.assignTicket(userId, id);
    } catch (error: unknown) {
      if (error instanceof TicketsServiceError) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        }, HttpStatus.BAD_REQUEST);
      }

      throw error;
    }
  }

  @Roles('admin', 'support')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/resolve')
  async resolveTicket(@Param('id') id: number, @Request() req: any,
    @Body() { resolution }: ResolveTicket) {
    const userId = req.user.id;
    try {
      return await this.ticketsService.resolveTicket(id, userId, resolution);
    } catch (error: unknown) {
      if (error instanceof TicketsServiceError) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        }, HttpStatus.BAD_REQUEST);
      }

      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
