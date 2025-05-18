import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {
  constructor(private readonly restauranteService: RestauranteService) {}

  @Get()
  async findAll(): Promise<RestauranteEntity[]> {
    return this.restauranteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RestauranteEntity> {
    return this.restauranteService.findOne(id);
  }

  @Post()
  async create(@Body() dto: any): Promise<RestauranteEntity> {
    const restauranteDto = plainToInstance(RestauranteDto, dto);
    const errors = await validate(restauranteDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.restauranteService.create(restauranteDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: any,
  ): Promise<RestauranteEntity> {
    const restauranteDto = plainToInstance(RestauranteDto, dto);
    const errors = await validate(restauranteDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.restauranteService.update(id, restauranteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.restauranteService.delete(id);
  }
}
