import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/UserController';
import { UserEntity } from './entity/User.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        UserEntity,
    ])
  ],
  controllers: [ UserController ],
  providers: [],
})

export class UserModule {}
