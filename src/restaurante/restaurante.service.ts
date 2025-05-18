import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RestauranteEntity, TipoCocina } from './restaurante.entity';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';

@Injectable()
export class RestauranteService {
  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,
  ) {}

  async findAll(): Promise<RestauranteEntity[]> {
    return this.restauranteRepository.find({ relations: ['platos'] });
  }

  async findOne(id: string): Promise<RestauranteEntity> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id },
      relations: ['platos'],
    });
    if (!restaurante) {
      throw new BusinessLogicException(
        `Restaurante with id ${id} not found`,
        BusinessError.NOT_FOUND,
      );
    }
    return restaurante;
  }

  async create(data: Partial<RestauranteEntity>): Promise<RestauranteEntity> {
    this.validateTipoCocina(data.tipoCocina);
    const restaurante = this.restauranteRepository.create(data);
    return this.restauranteRepository.save(restaurante);
  }

  async update(
    id: string,
    data: Partial<RestauranteEntity>,
  ): Promise<RestauranteEntity> {
    const restaurante = await this.findOne(id);
    data.id = restaurante.id;
    Object.assign(restaurante, data);
    this.validateTipoCocina(restaurante.tipoCocina);
    return this.restauranteRepository.save(restaurante);
  }

  async delete(id: string): Promise<void> {
    const restaurante = await this.findOne(id);
    await this.restauranteRepository.remove(restaurante);
  }

  validateTipoCocina(tipoCocina?: TipoCocina) {
    if (!tipoCocina || !Object.values(TipoCocina).includes(tipoCocina)) {
      throw new BusinessLogicException(
        `tipoCocina ${tipoCocina} is not valid, it must be one of ${Object.values(
          TipoCocina,
        ).join(', ')}`,
        BusinessError.BAD_REQUEST,
      );
    }
  }
}
