import { TipoCocina } from '../../restaurante/restaurante.entity';
import { CategoriaPlato } from '../../plato/plato.entity';

import { faker } from '@faker-js/faker';

export const restauranteFactory = () => {
  return {
    nombre: faker.company.name(),
    direccion: faker.location.streetAddress(),
    tipoCocina: faker.helpers.arrayElement(Object.values(TipoCocina)),
    paginaWeb: faker.internet.url(),
    platos: [],
  };
};

export const platoFactory = () => {
  return {
    nombre: faker.commerce.productName(),
    descripcion: faker.lorem.sentence(),
    precio: parseFloat(
      faker.finance.amount({
        min: 1,
        max: 100,
        dec: 2,
      }),
    ),
    categoria: faker.helpers.arrayElement(Object.values(CategoriaPlato)),
    restaurantes: [],
  };
};
