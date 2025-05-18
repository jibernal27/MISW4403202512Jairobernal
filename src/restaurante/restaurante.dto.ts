import { IsNotEmpty, IsString, IsUrl, IsEnum } from 'class-validator';
import { TipoCocina } from './restaurante.entity';

export class RestauranteDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsEnum(TipoCocina, { message: 'tipoCocina must be a valid enum value' })
  tipoCocina: string;

  @IsNotEmpty()
  @IsUrl()
  paginaWeb: string;
}
