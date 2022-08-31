import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BadgeController } from './controller/BadgeController';
import { AchieveEntity } from './entity/AchieveEntity';
import { BadgeEntity } from './entity/Badge.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([ 
			BadgeEntity,
			AchieveEntity,
		]),
	],
	controllers: [ BadgeController ],
	providers: [],
})

export class BadgeModule {}
