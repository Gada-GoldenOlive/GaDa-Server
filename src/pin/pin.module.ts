import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetAllPinUseCase } from './application/GetAllPinUseCase/GetAllPinUseCase';
import { PinController } from './controller/PinController';
import { PinEntity } from './entity/Pin.entity';
import { PIN_REPOSITORY } from './infra/IPinRepository';
import { MysqlPinRepository } from './infra/mysql/MysqlPinRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        PinEntity,
    ])
  ],
  controllers: [ PinController ],
  providers: [
    GetAllPinUseCase,
    {
      provide: PIN_REPOSITORY,
      useClass: MysqlPinRepository,
    }
  ],
})

export class PinModule {}
