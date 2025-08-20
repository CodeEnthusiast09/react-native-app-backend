import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('habit-completions')
  async seedHabitCompletions() {
    return await this.seedService.seedCompletions();
  }
}
