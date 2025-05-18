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
import { PlatoService } from './plato.service';
import { PlatoDto } from './plato.dto';
import { PlatoEntity } from './plato.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('dishes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PlatoController {
  constructor(private readonly platoService: PlatoService) {}

  @Get()
  async findAll(): Promise<PlatoEntity[]> {
    return this.platoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PlatoEntity> {
    return this.platoService.findOne(id);
  }

  @Post()
  async create(@Body() dto: any): Promise<PlatoEntity> {
    const platoDto = plainToInstance(PlatoDto, dto);
    const errors = await validate(platoDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.platoService.create(platoDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: any,
  ): Promise<PlatoEntity> {
    const platoDto = plainToInstance(PlatoDto, dto);
    const errors = await validate(platoDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.platoService.update(id, platoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.platoService.delete(id);
  }
}
