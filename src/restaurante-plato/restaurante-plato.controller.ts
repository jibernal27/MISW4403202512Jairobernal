import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { PlatoService } from '../plato/plato.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { PlatoEntity } from '../plato/plato.entity';
import { PlatoDto } from 'src/plato/plato.dto';
import { plainToInstance } from 'class-transformer';

@Controller('restaurants/:restauranteId/dishes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantePlatoController {
  constructor(
    private readonly restaurantePlatoService: RestaurantePlatoService,
    private readonly platoService: PlatoService,
  ) {}

  @Post(':platoId')
  async addDishToRestaurant(
    @Param('restauranteId') restauranteId: string,
    @Param('platoId') platoId: string,
  ) {
    return this.restaurantePlatoService.addDishToRestaurant(
      restauranteId,
      platoId,
    );
  }

  @Get()
  async findDishesFromRestaurant(
    @Param('restauranteId') restauranteId: string,
  ): Promise<PlatoEntity[]> {
    return this.restaurantePlatoService.findDishesFromRestaurant(restauranteId);
  }

  @Get(':platoId')
  async findDishFromRestaurant(
    @Param('restauranteId') restauranteId: string,
    @Param('platoId') platoId: string,
  ): Promise<PlatoEntity> {
    return this.restaurantePlatoService.findDishFromRestaurant(
      restauranteId,
      platoId,
    );
  }

  @Put()
  async updateDishesFromRestaurant(
    @Param('restauranteId') restauranteId: string,
    @Body() platosDto: PlatoDto[],
  ) {
    const platos = plainToInstance(PlatoEntity, platosDto);
    return this.restaurantePlatoService.updateDishesFromRestaurant(
      restauranteId,
      platos,
    );
  }

  @Delete(':platoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDishFromRestaurant(
    @Param('restauranteId') restauranteId: string,
    @Param('platoId') platoId: string,
  ) {
    return this.restaurantePlatoService.deleteDishFromRestaurant(
      restauranteId,
      platoId,
    );
  }
}
