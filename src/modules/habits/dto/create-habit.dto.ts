import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNotFutureDate', async: false })
export class IsNotFutureDate implements ValidatorConstraintInterface {
  validate(date: string): boolean {
    if (!date) return true; // Allow empty dates
    return new Date(date) <= new Date();
  }

  defaultMessage(): string {
    return 'Date cannot be in the future';
  }
}

export class CreateHabitDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  streak: number;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format' })
  @Validate(IsNotFutureDate)
  last_completed?: Date;

  @IsString()
  @IsNotEmpty()
  frequency: string;
}
