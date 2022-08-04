import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/User.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        UserEntity,
    ])
  ],
  controllers: [],
  providers: [],
})

export class UserModule {}
