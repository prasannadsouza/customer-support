import { Body, Controller, Get, Param, Post, Query, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTicket, ResolveTicket, TicketsService, TicketsServiceError } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  async create(@Body() ticket: CreateTicket) {
    return this.ticketsService.create(ticket);
  }

  @Get()
  async findAll() {
    return this.ticketsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id/:userId') // from auth in future
  async assignTicket(@Param('id') id: number, @Param('userId') userId: number) {
    try {
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

  @Put(':id/:userId/resolve') // from auth in future
  async resolveTicket(@Param('id') id: number, @Param('userId') userId: number,
    @Body() { resolution }: ResolveTicket) {
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
