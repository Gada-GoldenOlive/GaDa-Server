import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PinEntity } from './entity/Pin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        PinEntity,
    ])
  ],
  controllers: [],
  providers: [],
})

export class PinModule {}
