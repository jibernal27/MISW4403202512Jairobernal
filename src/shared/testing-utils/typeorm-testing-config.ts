import { TypeOrmModule } from '@nestjs/typeorm';

import { RestauranteEntity } from 'src/restaurante/restaurante.entity';
import { PlatoEntity } from 'src/plato/plato.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [RestauranteEntity, PlatoEntity],
    synchronize: true,
    /*keepConnectionAlive: true */
  }),
  TypeOrmModule.forFeature([RestauranteEntity, PlatoEntity]),
];
