import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { Request } from 'express';
import { successResponse } from 'src/common/utils/response.helper';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { PayloadType } from '../auth/interface/payload-types';

@Controller('habits')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  async create(
    @Body() createHabitDto: CreateHabitDto,
    @GetUser() user: PayloadType,
  ) {
    const result = await this.habitsService.create(createHabitDto, user.userId);
    return successResponse('Habit created successfully!', result);
  }

  @Get()
  async findAll(@GetUser() user: PayloadType) {
    const result = await this.habitsService.findAllByUser(user.userId);
    return successResponse('Fetched habits successfully!', result);
  }

  @Post(':id/completions')
  async complete(@Param('id') id: string, @GetUser() user: PayloadType) {
    const result = await this.habitsService.completeHabit(id, user.userId);
    return successResponse('Habit completed successsfully!', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: PayloadType) {
    const result = await this.habitsService.findOneByUser(id, user.userId);
    return successResponse('Fetched habit successfully!', result);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
    @GetUser() user: PayloadType,
  ) {
    const result = await this.habitsService.updateByUser(
      id,
      user.userId,
      updateHabitDto,
    );
    return successResponse('Habit updated successfully!', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: PayloadType) {
    await this.habitsService.removeByUser(id, user.userId);
    return successResponse('Habit deleted successfully!', null);
  }
}
