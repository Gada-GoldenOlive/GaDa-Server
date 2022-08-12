import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GetUserUseCase } from '../user/application/GetUserUseCase/GetUserUseCase';
import { UserEntity } from '../user/entity/User.entity';
import { USER_REPOSITORY } from '../user/infra/IUserRepository';
import { MysqlUserRepository } from '../user/infra/mysql/MysqlUserRepository';
import { GetAllPinUseCase } from './application/GetAllPinUseCase/GetAllPinUseCase';
import { PinController } from './controller/PinController';
import { PinEntity } from './entity/Pin.entity';
import { PIN_REPOSITORY } from './infra/IPinRepository';
import { MysqlPinRepository } from './infra/mysql/MysqlPinRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        PinEntity,
        UserEntity,
    ])
  ],
  controllers: [ PinController ],
  providers: [
    GetAllPinUseCase,
    {
      provide: PIN_REPOSITORY,
      useClass: MysqlPinRepository,
    },
    GetUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: MysqlUserRepository,
    }
  ],
})

export class PinModule {}
