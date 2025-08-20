import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { HabitCompletion } from '../habits/entities/habit-completion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HabitCompletion])],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
