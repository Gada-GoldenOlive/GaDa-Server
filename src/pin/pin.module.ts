import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GetUserUseCase } from '../user/application/GetUserUseCase/GetUserUseCase';
import { UserEntity } from '../user/entity/User.entity';
import { USER_REPOSITORY } from '../user/infra/IUserRepository';
import { MysqlUserRepository } from '../user/infra/mysql/MysqlUserRepository';
import { GetWalkwayUseCase } from '../walkway/application/GetWalkwayUseCase/GetWalkwayUseCase';
import { WalkwayEntity } from '../walkway/entity/Walkway.entity';
import { WALKWAY_REPOSITORY } from '../walkway/infra/IWalkwayRepository';
import { MysqlWalkwayRepository } from '../walkway/infra/mysql/MysqlWalkwayRepository';
import { CreatePinUseCase } from './application/CreatePinUseCase/CreatePinUseCase';
import { GetAllPinUseCase } from './application/GetAllPinUseCase/GetAllPinUseCase';
import { GetPinUseCase } from './application/GetPinUseCase/GetPinUseCase';
import { PinController } from './controller/PinController';
import { CommentEntity } from './entity/Comment.entity';
import { PinEntity } from './entity/Pin.entity';
import { PIN_REPOSITORY } from './infra/IPinRepository';
import { MysqlPinRepository } from './infra/mysql/MysqlPinRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        PinEntity,
        UserEntity,
        WalkwayEntity,
        CommentEntity,
    ])
  ],
  controllers: [ PinController ],
  providers: [
    GetAllPinUseCase,
    CreatePinUseCase,
    GetPinUseCase,
    {
      provide: PIN_REPOSITORY,
      useClass: MysqlPinRepository,
    },
    GetUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: MysqlUserRepository,
    },
    GetWalkwayUseCase,
    {
      provide: WALKWAY_REPOSITORY,
      useClass: MysqlWalkwayRepository,
    },
  ],
})

export class PinModule {}
