import { Module } from '@nestjs/common';
import { PlatoService } from './plato.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatoEntity } from './plato.entity';
@Module({
  providers: [PlatoService],
  imports: [TypeOrmModule.forFeature([PlatoEntity])],
})
export class PlatoModule {}
