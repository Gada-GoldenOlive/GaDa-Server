import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Comment } from "../../domain/Comment/Comment";
import { CommentEntity } from "../../entity/Comment.entity";
import { ICommentRepository } from "../ICommentRepository";
import { MysqlCommentRepositoryMapper } from "./mapper/MysqlCommentRepositoryMapper";

export class MysqlCommentRepository implements ICommentRepository {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
    ) {}

    async save(comment: Comment): Promise<boolean> {
        await this.commentRepository.save(
            MysqlCommentRepositoryMapper.toEntity(comment)
        );

        return true;
    }
}
