import { Module } from '@nestjs/common';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { PlatoService } from '../plato/plato.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PlatoEntity } from '../plato/plato.entity';
import { RestaurantePlatoController } from './restaurante-plato.controller';

@Module({
  providers: [RestaurantePlatoService, PlatoService],
  imports: [TypeOrmModule.forFeature([RestauranteEntity, PlatoEntity])],
  controllers: [RestaurantePlatoController],
})
export class RestaurantePlatoModule {}
