import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RestauranteEntity, TipoCocina } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { restauranteFactory } from '../shared/testing-utils/factories';
describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let restaurantesList: RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    restaurantesList = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity =
        await repository.save(restauranteFactory());
      restaurantesList.push(restaurante);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurantes', async () => {
    const restaurantes: RestauranteEntity[] = await service.findAll();
    expect(restaurantes).not.toBeNull();
    expect(restaurantes).toHaveLength(restaurantesList.length);
    // Are sorted by createdAt desc
    restaurantes.every((item, index, array) => {
      // Skip the last item, or compare against the next item's createdAt
      return (
        index === array.length - 1 ||
        item.createdAt! >= array[index + 1].createdAt!
      );
    });
  });

  it('findOne should return a restaurante by id', async () => {
    const storedRestaurante: RestauranteEntity = restaurantesList[0];
    const restaurante: RestauranteEntity = await service.findOne(
      storedRestaurante.id,
    );
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual(storedRestaurante.nombre);
    expect(restaurante.direccion).toEqual(storedRestaurante.direccion);
    expect(restaurante.tipoCocina).toEqual(storedRestaurante.tipoCocina);
    expect(restaurante.paginaWeb).toEqual(storedRestaurante.paginaWeb);
  });

  it('findOne should throw an exception for an invalid restaurante', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      `Restaurante with id 0 not found`,
    );
  });

  it('create should return a new restaurante', async () => {
    const restaurante: RestauranteEntity = {
      id: '',
      ...restauranteFactory(),
    };

    const newRestaurante: RestauranteEntity | null =
      await service.create(restaurante);
    expect(newRestaurante).not.toBeNull();

    const storedRestaurante: RestauranteEntity | null =
      await repository.findOne({
        where: { id: newRestaurante.id },
      });

    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante!.nombre).toEqual(newRestaurante.nombre);
    expect(storedRestaurante!.direccion).toEqual(newRestaurante.direccion);
    expect(storedRestaurante!.tipoCocina).toEqual(newRestaurante.tipoCocina);
    expect(storedRestaurante!.paginaWeb).toEqual(newRestaurante.paginaWeb);
  });

  it('create should throw an exception for invalid tipoCocina', async () => {
    const restaurante: RestauranteEntity = {
      ...restauranteFactory(),
      id: '',
      tipoCocina: 'INVALID' as TipoCocina,
    };
    await expect(() => service.create(restaurante)).rejects.toHaveProperty(
      'message',
      `tipoCocina INVALID is not valid, it must be one of Italiana, Japonesa, Mexicana, Colombiana, India, Internacional`,
    );
  });

  it('update should modify a restaurante', async () => {
    const newData = restauranteFactory();
    const restaurante: RestauranteEntity = restaurantesList[0];
    restaurante.nombre = newData.nombre;
    restaurante.direccion = newData.direccion;
    restaurante.tipoCocina = newData.tipoCocina;
    restaurante.paginaWeb = newData.paginaWeb;

    const updatedRestaurante: RestauranteEntity = await service.update(
      restaurante.id,
      restaurante,
    );
    expect(updatedRestaurante).not.toBeNull();

    const storedRestaurante: RestauranteEntity | null =
      await repository.findOne({
        where: { id: restaurante.id },
      });
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante!.nombre).toEqual(restaurante.nombre);
    expect(storedRestaurante!.direccion).toEqual(restaurante.direccion);
    expect(storedRestaurante!.tipoCocina).toEqual(restaurante.tipoCocina);
    expect(storedRestaurante!.paginaWeb).toEqual(restaurante.paginaWeb);
  });

  it('update should throw an exception for an invalid restaurante', async () => {
    let restaurante: RestauranteEntity = restaurantesList[0];
    restaurante = {
      ...restaurante,
      nombre: 'Nuevo nombre',
      direccion: 'Nueva direccion',
    };
    await expect(() => service.update('0', restaurante)).rejects.toHaveProperty(
      'message',
      `Restaurante with id 0 not found`,
    );
  });

  it('update should throw an exception for invalid tipoCocina', async () => {
    let restaurante: RestauranteEntity = restaurantesList[0];
    restaurante = {
      ...restaurante,
      tipoCocina: 'INVALID' as TipoCocina,
    };
    await expect(() =>
      service.update(restaurante.id, restaurante),
    ).rejects.toHaveProperty(
      'message',
      `tipoCocina INVALID is not valid, it must be one of Italiana, Japonesa, Mexicana, Colombiana, India, Internacional`,
    );
  });

  it('delete should remove a restaurante', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await service.delete(restaurante.id);

    const deletedRestaurante: RestauranteEntity | null =
      await repository.findOne({
        where: { id: restaurante.id },
      });
    expect(deletedRestaurante).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurante', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      `Restaurante with id 0 not found`,
    );
  });
});
