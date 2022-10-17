import { Logger } from '@nestjs/common';
import _ from 'lodash';

import { MysqlUserRepositoryMapper } from '../../../../user/infra/mysql/mapper/MysqlUserRepositoryMapper';
import { Comment } from '../../../domain/Comment/Comment';
import { CommentContent } from '../../../domain/Comment/CommentContent';
import { CommentEntity } from '../../../entity/Comment.entity';
import { MysqlPinRepositoryMapper } from './MysqlPinRepositoryMapper';

export class MysqlCommentRepositoryMapper {
    static toDomain(entity: CommentEntity): Comment {
        if (_.isNil(entity)) {
            return null;
        }

        const comment = Comment.create({
            content: entity.content ? CommentContent.create(entity.content).value : null,
            user: MysqlUserRepositoryMapper.toDomain(entity.user),
            pin: MysqlPinRepositoryMapper.toDomain(entity.pin),
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        }, entity.id).value;

        return comment;
    }

    static toDomains(entities: CommentEntity[]): Comment[] {
        return _.map(entities, this.toDomain);
    }

    static toEntity(comment: Comment): CommentEntity {
        if (_.isNil(comment)) {
            return null;
        }

        const entity = new CommentEntity();
        entity.id = comment.id;
        entity.content = comment.content.value;
        entity.pin = MysqlPinRepositoryMapper.toEntity(comment.pin);
        entity.user = MysqlUserRepositoryMapper.toEntity(comment.user);
        entity.status = comment.status;
        entity.createdAt = comment.createdAt;
        entity.updatedAt = comment.updatedAt;

        return entity;
    }

    static toEntities(comments: Comment[]): CommentEntity[] {
        return _.map(comments, (comment) => this.toEntity(comment));
    }
}
