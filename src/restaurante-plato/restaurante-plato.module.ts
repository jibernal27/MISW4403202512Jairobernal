import { Module } from '@nestjs/common';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity';
import { PlatoEntity } from 'src/plato/plato.entity';

@Module({
  providers: [RestaurantePlatoService],
  imports: [TypeOrmModule.forFeature([RestauranteEntity, PlatoEntity])],
})
export class RestaurantePlatoModule {}
