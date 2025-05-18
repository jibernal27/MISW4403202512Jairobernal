import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';

import { PlatoEntity } from '../plato/plato.entity';

export enum TipoCocina {
  ITALIANA = 'Italiana',
  JAPONESA = 'Japonesa',
  MEXICANA = 'Mexicana',
  COLOMBIANA = 'Colombiana',
  INDIA = 'India',
  INTERNACIONAL = 'Internacional',
}

@Entity()
export class RestauranteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  tipoCocina: string;

  @Column()
  paginaWeb: string;

  @ManyToMany(() => PlatoEntity, (plato) => plato.restaurantes)
  @JoinTable()
  platos: PlatoEntity[];

  @CreateDateColumn() public createdAt?: Date;

  @UpdateDateColumn() public updatedAt?: Date;
}
