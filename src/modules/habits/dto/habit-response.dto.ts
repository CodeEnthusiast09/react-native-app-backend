import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/modules/auth/dto/user-response.dto';

export class HabitResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  streak: number;

  @Expose()
  last_completed: Date;

  @Expose()
  frequency: string;

  @Expose()
  created_at: Date;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
