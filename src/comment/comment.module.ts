import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommentEntity } from "./entity/Comment.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ CommentEntity ])
    ],
    controllers: [],
    providers: [],
})

export class CommentModule {}
