import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import {
  restauranteFactory,
  platoFactory,
} from '../shared/testing-utils/factories';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PlatoEntity } from '../plato/plato.entity';
import { Repository } from 'typeorm';

describe('RestaurantePlatoService', () => {
  let service: RestaurantePlatoService;
  let restauranteRepository: Repository<RestauranteEntity>;
  let platoRepository: Repository<PlatoEntity>;
  let restaurante: RestauranteEntity;
  let platosLists: PlatoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestaurantePlatoService],
    }).compile();

    service = module.get<RestaurantePlatoService>(RestaurantePlatoService);
    restauranteRepository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );
    platoRepository = module.get<Repository<PlatoEntity>>(
      getRepositoryToken(PlatoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await restauranteRepository.clear();
    await platoRepository.clear();
    platosLists = [];
    for (let i = 0; i < 5; i++) {
      const plato = await platoRepository.save(platoFactory());
      platosLists.push(plato);
    }

    restaurante = await restauranteRepository.save({
      ...restauranteFactory(),
      platos: platosLists,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addDishToRestaurant should associate a plato to a restaurante', async () => {
    const plato = await platoRepository.save(platoFactory());
    const result = await service.addDishToRestaurant(restaurante.id, plato.id);
    expect(result.platos.some((p) => p.id === plato.id)).toBe(true);
  });

  it('should throw error if restaurante does not exist on addDishToRestaurant', async () => {
    await expect(
      service.addDishToRestaurant('0', platosLists[0].id),
    ).rejects.toHaveProperty('message', `Restaurante with id 0 not found`);
  });

  it('should throw error if plato does not exist on addDishToRestaurant', async () => {
    await expect(
      service.addDishToRestaurant(restaurante.id, '0'),
    ).rejects.toHaveProperty('message', `Plato with id 0 not found`);
  });

  it('findDishesFromRestaurant should return platos for a restaurante', async () => {
    const platos = await service.findDishesFromRestaurant(restaurante.id);
    expect(platos).toHaveLength(platosLists.length);
    const platosIds = platos.map((p) => p.id);
    const platosListsIds = platosLists.map((p) => p.id);
    expect(platosIds.every((p) => platosListsIds.includes(p))).toBe(true);
  });

  it('should throw error if restaurante does not exist on findDishesFromRestaurant', async () => {
    await expect(service.findDishesFromRestaurant('0')).rejects.toHaveProperty(
      'message',
      `Restaurante with id 0 not found`,
    );
  });

  it('findDishFromRestaurant should return a specific plato for a restaurante', async () => {
    const found = await service.findDishFromRestaurant(
      restaurante.id,
      platosLists[0].id,
    );
    expect(found).not.toBeNull();
    expect(found.id).toBe(platosLists[0].id);
  });

  it('should throw error if restaurante does not exist on findDishFromRestaurant', async () => {
    await expect(
      service.findDishFromRestaurant('0', platosLists[0].id),
    ).rejects.toHaveProperty('message', `Restaurante with id 0 not found`);
  });

  it('should throw error if plato does not exist on findDishFromRestaurant', async () => {
    await expect(
      service.findDishFromRestaurant(restaurante.id, '0'),
    ).rejects.toHaveProperty('message', `Plato with id 0 not found`);
  });

  it('updateDishesFromRestaurant should update platos for a restaurante', async () => {
    const newPlato = await platoRepository.save(platoFactory());
    const result = await service.updateDishesFromRestaurant(restaurante.id, [
      newPlato,
    ]);
    expect(result.platos).toHaveLength(1);
    expect(result.platos[0].id).toBe(newPlato.id);
  });

  it('should throw error if restaurante does not exist on updateDishesFromRestaurant', async () => {
    await expect(
      service.updateDishesFromRestaurant('0', [platosLists[0]]),
    ).rejects.toHaveProperty('message', `Restaurante with id 0 not found`);
  });

  it('should throw error if plato does not exist on updateDishesFromRestaurant', async () => {
    const newPlato = await platoRepository.save(platoFactory());
    const otherPlato = await platoRepository.save(platoFactory());
    newPlato.id = '0';
    otherPlato.id = '1';
    await expect(
      service.updateDishesFromRestaurant(restaurante.id, [
        newPlato,
        otherPlato,
      ]),
    ).rejects.toHaveProperty('message', `Platos with ids 0, 1 not found`);
  });

  it('deleteDishFromRestaurant should remove a plato from a restaurante', async () => {
    await service.deleteDishFromRestaurant(restaurante.id, platosLists[0].id);
    const platos = await service.findDishesFromRestaurant(restaurante.id);
    expect(platos.some((p) => p.id === platosLists[0].id)).toBe(false);
  });

  it('should throw error if restaurante does not exist on deleteDishFromRestaurant', async () => {
    await expect(
      service.deleteDishFromRestaurant('0', platosLists[0].id),
    ).rejects.toHaveProperty('message', `Restaurante with id 0 not found`);
  });

  it('should throw error if plato does not exist on deleteDishFromRestaurant', async () => {
    await expect(
      service.deleteDishFromRestaurant(restaurante.id, '0'),
    ).rejects.toHaveProperty('message', `Plato with id 0 not found`);
  });
  it('should throw error if plato is not associated with restaurante on deleteDishFromRestaurant', async () => {
    const newPlato = await platoRepository.save(platoFactory());
    await expect(
      service.deleteDishFromRestaurant(restaurante.id, newPlato.id),
    ).rejects.toHaveProperty(
      'message',
      `Plato with id ${newPlato.id} is not associated with Restaurante ${restaurante.id}`,
    );
  });
});
