import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PlatoEntity } from '../plato/plato.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class RestaurantePlatoService {
  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,
    @InjectRepository(PlatoEntity)
    private readonly platoRepository: Repository<PlatoEntity>,
  ) {}

  private async findRestauranteById(
    restauranteId: string,
  ): Promise<RestauranteEntity> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante) {
      throw new BusinessLogicException(
        `Restaurante with id ${restauranteId} not found`,
        BusinessError.NOT_FOUND,
      );
    }
    return restaurante;
  }

  private async findPlatoById(platoId: string): Promise<PlatoEntity> {
    const plato = await this.platoRepository.findOne({
      where: { id: platoId },
    });
    if (!plato) {
      throw new BusinessLogicException(
        `Plato with id ${platoId} not found`,
        BusinessError.NOT_FOUND,
      );
    }
    return plato;
  }

  async addDishToRestaurant(
    restauranteId: string,
    platoId: string,
  ): Promise<RestauranteEntity> {
    const restaurante = await this.findRestauranteById(restauranteId);
    const plato = await this.findPlatoById(platoId);
    if (!restaurante.platos.find((p) => p.id === plato.id)) {
      restaurante.platos.push(plato);
      await this.restauranteRepository.save(restaurante);
    }
    return restaurante;
  }

  async findDishesFromRestaurant(
    restauranteId: string,
  ): Promise<PlatoEntity[]> {
    const restaurante = await this.findRestauranteById(restauranteId);
    return restaurante.platos;
  }

  async findDishFromRestaurant(
    restauranteId: string,
    platoId: string,
  ): Promise<PlatoEntity> {
    const restaurante = await this.findRestauranteById(restauranteId);
    const plato = await this.findPlatoById(platoId);
    const found = restaurante.platos.find((p) => p.id === plato.id);
    if (!found) {
      throw new BusinessLogicException(
        `Plato with id ${platoId} is not associated with Restaurante ${restauranteId}`,
        BusinessError.NOT_FOUND,
      );
    }
    return found;
  }

  async updateDishesFromRestaurant(
    restauranteId: string,
    platos: PlatoEntity[],
  ): Promise<RestauranteEntity> {
    const restaurante = await this.findRestauranteById(restauranteId);

    const existingPlatos = await this.platoRepository.find({
      where: { id: In(platos.map((plato) => plato.id)) },
    });

    const missingplatos = platos.filter(
      (plato) =>
        !existingPlatos.some((existingPlato) => existingPlato.id === plato.id),
    );

    if (missingplatos.length > 0) {
      throw new BusinessLogicException(
        `Platos with ids ${missingplatos
          .map((plato) => plato.id)
          .join(', ')} not found`,
        BusinessError.NOT_FOUND,
      );
    }

    restaurante.platos = platos;
    return this.restauranteRepository.save(restaurante);
  }

  async deleteDishFromRestaurant(
    restauranteId: string,
    platoId: string,
  ): Promise<void> {
    const restaurante = await this.findRestauranteById(restauranteId);
    const plato = await this.findPlatoById(platoId);
    const index = restaurante.platos.findIndex((p) => p.id === plato.id);
    if (index === -1) {
      throw new BusinessLogicException(
        `Plato with id ${platoId} is not associated with Restaurante ${restauranteId}`,
        BusinessError.NOT_FOUND,
      );
    }
    restaurante.platos.splice(index, 1);
    await this.restauranteRepository.save(restaurante);
  }
}
