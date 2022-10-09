import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Comment } from "../../domain/Comment/Comment";
import { PinStatus } from "../../domain/Pin/PinStatus";
import { CommentEntity } from "../../entity/Comment.entity";
import { ICommentRepository } from "../ICommentRepository";
import { MysqlCommentRepositoryMapper } from "./mapper/MysqlCommentRepositoryMapper";

export class MysqlCommentRepository implements ICommentRepository {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
    ) {}

    async findAll(pinId: string): Promise<Comment[]> {
        const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.pin', 'pin')
        .leftJoinAndSelect('comment.user', 'user')
        .where('pin.status = :normal', { normal: PinStatus.NORMAL })
        .where('pin.id = :pinId', { pinId, })
        .getMany();

        return MysqlCommentRepositoryMapper.toDomains(comments);
    }

    async save(comment: Comment): Promise<boolean> {
        await this.commentRepository.save(
            MysqlCommentRepositoryMapper.toEntity(comment)
        );

        return true;
    }
}
