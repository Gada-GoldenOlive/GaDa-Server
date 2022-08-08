import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PinController } from './controller/PinController';
import { PinEntity } from './entity/Pin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        PinEntity,
    ])
  ],
  controllers: [ PinController ],
  providers: [],
})

export class PinModule {}
