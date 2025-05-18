import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PlatoEntity, CategoriaPlato } from './plato.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class PlatoService {
  constructor(
    @InjectRepository(PlatoEntity)
    private readonly platoRepository: Repository<PlatoEntity>,
  ) {}

  async findAll(): Promise<PlatoEntity[]> {
    return this.platoRepository.find({
      relations: ['restaurantes'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PlatoEntity> {
    const plato = await this.platoRepository.findOne({
      where: { id },
      relations: ['restaurantes'],
    });
    if (!plato) {
      throw new BusinessLogicException(
        `Plato with id ${id} not found`,
        BusinessError.NOT_FOUND,
      );
    }
    return plato;
  }

  async create(data: Partial<PlatoEntity>): Promise<PlatoEntity> {
    this.validateCategoria(data.categoria);
    this.validatePrecio(data.precio);
    const plato = this.platoRepository.create(data);
    return this.platoRepository.save(plato);
  }

  async update(id: string, data: Partial<PlatoEntity>): Promise<PlatoEntity> {
    const plato = await this.findOne(id);
    data.id = plato.id;
    Object.assign(plato, data);
    this.validateCategoria(plato.categoria);
    this.validatePrecio(plato.precio);
    return this.platoRepository.save(plato);
  }

  async delete(id: string): Promise<void> {
    const plato = await this.findOne(id);
    await this.platoRepository.remove(plato);
  }

  validateCategoria(categoria?: string) {
    if (
      !categoria ||
      !Object.values(CategoriaPlato).includes(categoria as CategoriaPlato)
    ) {
      throw new BusinessLogicException(
        `categoria ${categoria} is not valid, it must be one of ${Object.values(
          CategoriaPlato,
        ).join(', ')}`,
        BusinessError.BAD_REQUEST,
      );
    }
  }
  validatePrecio(precio?: number) {
    if (typeof precio !== 'number' || precio <= 0) {
      throw new BusinessLogicException(
        `precio must be a positive number`,
        BusinessError.BAD_REQUEST,
      );
    }
  }
}
