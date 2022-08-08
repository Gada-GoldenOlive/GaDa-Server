import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalkwayController } from './controller/WalkwayController';
import { WalkEntity } from './entity/Walk.entity';
import { WalkwayEntity } from './entity/Walkway.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        WalkwayEntity,
        WalkEntity,
    ])
  ],
  controllers: [WalkwayController],
  providers: [],
})

export class WalkwayModule {}
