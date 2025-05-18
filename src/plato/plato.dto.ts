import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CategoriaPlato } from './plato.entity';

@ValidatorConstraint({ name: 'isPositive', async: false })
export class IsPositive implements ValidatorConstraintInterface {
  validate(value: number) {
    return typeof value === 'number' && value > 0;
  }
  defaultMessage() {
    return 'precio must be a positive number';
  }
}

export class PlatoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  @Validate(IsPositive)
  precio: number;

  @IsNotEmpty()
  @IsEnum(CategoriaPlato, {
    message: `categoria must be one of the following values: ${Object.values(CategoriaPlato).join(', ')}`,
  })
  categoria: string;
}
