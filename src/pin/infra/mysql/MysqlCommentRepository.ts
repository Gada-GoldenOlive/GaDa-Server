import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from '../../../user/domain/User/User';
import { Comment } from "../../domain/Comment/Comment";
import { PinStatus } from "../../domain/Pin/PinStatus";
import { CommentEntity } from "../../entity/Comment.entity";
import { ICommentRepository } from "../ICommentRepository";
import { MysqlCommentRepositoryMapper } from "./mapper/MysqlCommentRepositoryMapper";

export interface GetAllCommentOptions {
    pinId?: string;
    user?: User;
}

export class MysqlCommentRepository implements ICommentRepository {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
    ) {}

    async findAll(options: GetAllCommentOptions): Promise<Comment[]> {
        const query = this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.pin', 'pin')
        .leftJoinAndSelect('comment.user', 'user')
        .where('pin.status = :normal', { normal: PinStatus.NORMAL });

        if (options.pinId) {
            query.andWhere('pin.id = :pinId', { pinId: options.pinId })
            .orderBy('comment.createdAt', 'ASC');
        }
        if (options.user) query.andWhere('user.id = :userId', { userId: options.user.id });
        
        const comments = await query.getMany();

        return MysqlCommentRepositoryMapper.toDomains(comments);
    }

    async save(comment: Comment): Promise<boolean> {
        await this.commentRepository.save(
            MysqlCommentRepositoryMapper.toEntity(comment)
        );

        return true;
    }
}
