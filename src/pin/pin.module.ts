import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GetAchieveUseCase } from '../badge/application/GetAchieveUseCase/GetAchieveUseCase';
import { UpdateAchieveUseCase } from '../badge/application/UpdateAchieveUseCase/UpdateAchieveUseCase';
import { AchieveEntity } from '../badge/entity/Achieve.entity';
import { ACHIEVE_REPOSITORY } from '../badge/infra/IAchieveRepository';
import { MysqlAchieveRepository } from '../badge/infra/mysql/MysqlAchieveRepository';
import { GetUserUseCase } from '../user/application/GetUserUseCase/GetUserUseCase';
import { UserEntity } from '../user/entity/User.entity';
import { USER_REPOSITORY } from '../user/infra/IUserRepository';
import { MysqlUserRepository } from '../user/infra/mysql/MysqlUserRepository';
import { GetWalkwayUseCase } from '../walkway/application/GetWalkwayUseCase/GetWalkwayUseCase';
import { WalkwayEntity } from '../walkway/entity/Walkway.entity';
import { WALKWAY_REPOSITORY } from '../walkway/infra/IWalkwayRepository';
import { MysqlWalkwayRepository } from '../walkway/infra/mysql/MysqlWalkwayRepository';
import { CreateCommentUseCase } from './application/CreateCommentUseCase/CreateCommentUseCase';
import { CreatePinUseCase } from './application/CreatePinUseCase/CreatePinUseCase';
import { DeletePinUseCase } from './application/DeletePinUseCase/DeletePinUseCase';
import { DeleteCommentUseCase } from './application/DeleteCommentUseCase/DeleteCommentUseCase';
import { GetAllCommentUseCase } from './application/GetAllCommentUseCase/GetAllCommentUseCase';
import { GetAllPinUseCase } from './application/GetAllPinUseCase/GetAllPinUseCase';
import { GetPinUseCase } from './application/GetPinUseCase/GetPinUseCase';
import { UpdatePinUseCase } from './application/UpdatePinUseCase/UpdatePinUseCase';
import { PinController } from './controller/PinController';
import { CommentEntity } from './entity/Comment.entity';
import { PinEntity } from './entity/Pin.entity';
import { COMMENT_REPOSITORY } from './infra/ICommentRepository';
import { PIN_REPOSITORY } from './infra/IPinRepository';
import { MysqlCommentRepository } from './infra/mysql/MysqlCommentRepository';
import { MysqlPinRepository } from './infra/mysql/MysqlPinRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        PinEntity,
        UserEntity,
        WalkwayEntity,
        CommentEntity,
        AchieveEntity,
    ])
  ],
  controllers: [ PinController ],
  providers: [
    GetAllPinUseCase,
    CreatePinUseCase,
    GetPinUseCase,
    DeletePinUseCase,
    UpdatePinUseCase,
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
    CreateCommentUseCase,
    GetAllCommentUseCase,
    DeleteCommentUseCase,
    {
      provide: COMMENT_REPOSITORY,
      useClass: MysqlCommentRepository,
    },
    GetAchieveUseCase,
    UpdateAchieveUseCase,
    {
      provide: ACHIEVE_REPOSITORY,
      useClass: MysqlAchieveRepository,
    },
  ],
})

export class PinModule {}
