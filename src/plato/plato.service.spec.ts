import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PlatoEntity, CategoriaPlato } from './plato.entity';
import { PlatoService } from './plato.service';
import { platoFactory } from '../shared/testing-utils/factories';
describe('PlatoService', () => {
  let service: PlatoService;
  let repository: Repository<PlatoEntity>;
  let platosList: PlatoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PlatoService],
    }).compile();

    service = module.get<PlatoService>(PlatoService);
    repository = module.get<Repository<PlatoEntity>>(
      getRepositoryToken(PlatoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    platosList = [];
    for (let i = 0; i < 5; i++) {
      const plato: PlatoEntity = await repository.save(platoFactory());
      platosList.push(plato);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all platos', async () => {
    const platos: PlatoEntity[] = await service.findAll();
    expect(platos).not.toBeNull();
    expect(platos).toHaveLength(platosList.length);
    platos.every((item, index, array) => {
      // Skip the last item, or compare against the next item's createdAt
      return (
        index === array.length - 1 ||
        item.createdAt! >= array[index + 1].createdAt!
      );
    });
  });

  it('findOne should return a plato by id', async () => {
    const storedPlato: PlatoEntity = platosList[0];
    const plato: PlatoEntity = await service.findOne(storedPlato.id);
    expect(plato).not.toBeNull();
    expect(plato.nombre).toEqual(storedPlato.nombre);
    expect(plato.descripcion).toEqual(storedPlato.descripcion);
    expect(plato.precio).toEqual(storedPlato.precio);
    expect(plato.categoria).toEqual(storedPlato.categoria);
  });

  it('findOne should throw an exception for an invalid plato', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      `Plato with id 0 not found`,
    );
  });

  it('create should return a new plato', async () => {
    const plato: PlatoEntity = {
      id: '',
      ...platoFactory(),
    };

    const newPlato: PlatoEntity = await service.create(plato);
    expect(newPlato).not.toBeNull();

    const storedPlato: PlatoEntity | null = await repository.findOne({
      where: { id: newPlato.id },
    });

    expect(storedPlato).not.toBeNull();
    if (storedPlato) {
      expect(storedPlato.nombre).toEqual(newPlato.nombre);
      expect(storedPlato.descripcion).toEqual(newPlato.descripcion);
      expect(storedPlato.precio).toEqual(newPlato.precio);
      expect(storedPlato.categoria).toEqual(newPlato.categoria);
    }
  });

  it('create should throw an exception for invalid categoria', async () => {
    const plato: PlatoEntity = {
      ...platoFactory(),
      id: '',
      categoria: 'INVALID' as CategoriaPlato,
    };
    await expect(() => service.create(plato)).rejects.toHaveProperty(
      'message',
      `categoria INVALID is not valid, it must be one of entrada, plato fuerte, postre, bebida`,
    );
  });

  it('create should throw an exception for invalid precio', async () => {
    const plato: PlatoEntity = {
      ...platoFactory(),
      id: '',
      precio: -100,
    };
    await expect(() => service.create(plato)).rejects.toHaveProperty(
      'message',
      `precio must be a positive number`,
    );
  });

  it('update should modify a plato', async () => {
    const newData = platoFactory();
    const plato: PlatoEntity = platosList[0];
    plato.nombre = newData.nombre;
    plato.descripcion = newData.descripcion;
    plato.precio = newData.precio;
    plato.categoria = newData.categoria;
    const updatedPlato: PlatoEntity = await service.update(plato.id, plato);
    expect(updatedPlato).not.toBeNull();

    const storedPlato: PlatoEntity | null = await repository.findOne({
      where: { id: plato.id },
    });
    expect(storedPlato).not.toBeNull();
    if (storedPlato) {
      expect(storedPlato.nombre).toEqual(plato.nombre);
      expect(storedPlato.descripcion).toEqual(plato.descripcion);
      expect(storedPlato.precio).toEqual(plato.precio);
      expect(storedPlato.categoria).toEqual(plato.categoria);
    }
  });

  it('update should throw an exception for an invalid plato', async () => {
    let plato: PlatoEntity = platosList[0];
    plato = {
      ...plato,
      nombre: 'Nuevo nombre',
      descripcion: 'Nueva descripcion',
    };
    await expect(() => service.update('0', plato)).rejects.toHaveProperty(
      'message',
      `Plato with id 0 not found`,
    );
  });

  it('update should throw an exception for invalid categoria', async () => {
    let plato: PlatoEntity = platosList[0];
    plato = {
      ...plato,
      categoria: 'INVALID' as CategoriaPlato,
    };
    await expect(() => service.update(plato.id, plato)).rejects.toHaveProperty(
      'message',
      `categoria INVALID is not valid, it must be one of entrada, plato fuerte, postre, bebida`,
    );
  });

  it('update should throw an exception for invalid precio', async () => {
    let plato: PlatoEntity = platosList[0];
    plato = {
      ...plato,
      precio: -100,
    };
    await expect(() => service.update(plato.id, plato)).rejects.toHaveProperty(
      'message',
      `precio must be a positive number`,
    );
  });

  //   it('delete should remove a plato', async () => {
  //     const plato: PlatoEntity = platosList[0];
  //     await service.delete(plato.id);

  //     const deletedPlato: PlatoEntity | null = await repository.findOne({
  //       where: { id: plato.id },
  //     });
  //     expect(deletedPlato).toBeNull();
  //   });

  it('delete should throw an exception for an invalid plato', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      `Plato with id 0 not found`,
    );
  });
});
