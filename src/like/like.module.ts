import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LikeEntity } from "./entity/Like.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ LikeEntity ])
    ],
    controllers: [],
    providers: [],
})

export class LikeModule {}
