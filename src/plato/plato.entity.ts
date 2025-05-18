import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RestauranteEntity } from 'src/restaurante/restaurante.entity';

export enum CategoriaPlato {
  ENTRADA = 'entrada',
  PLATO_FUERTE = 'plato fuerte',
  POSTRE = 'postre',
  BEBIDA = 'bebida',
}
@Entity()
export class PlatoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  precio: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  categoria: CategoriaPlato;

  @ManyToMany(() => RestauranteEntity, (restaurante) => restaurante.platos)
  restaurantes: RestauranteEntity[];

  @CreateDateColumn() public createdAt?: Date;

  @UpdateDateColumn() public updatedAt?: Date;
}
