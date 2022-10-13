import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";

import { User } from '../../../user/domain/User/User';
import { Comment } from "../../domain/Comment/Comment";
import { CommentStatus } from "../../domain/Comment/CommentStatus";
import { PinStatus } from "../../domain/Pin/PinStatus";
import { CommentEntity } from "../../entity/Comment.entity";
import { ICommentRepository } from "../ICommentRepository";
import { MysqlCommentRepositoryMapper } from "./mapper/MysqlCommentRepositoryMapper";
import { PaginationResult } from "../../../common/pagination/PaginationResponse";

export interface GetAllCommentOptions {
    pinId?: string;
    user?: User;
    paginationOptions?: IPaginationOptions;
}

export class MysqlCommentRepository implements ICommentRepository {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
    ) {}

    async paginate(options: IPaginationOptions): Promise<Pagination<CommentEntity>> {
        return paginate<CommentEntity>(this.commentRepository, options);
    }

    async findAll(options: GetAllCommentOptions): Promise<PaginationResult<Comment>> {
        const user = options.user;
        const pinId = options.pinId;
        const paginationOptions = options.paginationOptions;

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
        
        if (paginationOptions) {
            const comments = await paginate(query, paginationOptions);

            return {
                items: MysqlCommentRepositoryMapper.toDomains(comments.items),
                meta: comments.meta,
                links: comments.links,
            };
        }

        const comments = await query.getMany();

        return {
            items: MysqlCommentRepositoryMapper.toDomains(comments),
        }
    }

    async findOne(id: string): Promise<Comment> {
        const comment = await this.commentRepository.findOne({
            where: {
                id,
                status: CommentStatus.NORMAL,
                pin: {
                    status: PinStatus.NORMAL,
                },
            },
            relations: [
                'user',
                'pin',
            ],
        });

        return MysqlCommentRepositoryMapper.toDomain(comment);
    }

    async save(comment: Comment): Promise<boolean> {
        await this.commentRepository.save(
            MysqlCommentRepositoryMapper.toEntity(comment)
        );

        return true;
    }
}
