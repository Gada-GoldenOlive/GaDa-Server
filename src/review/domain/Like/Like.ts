import _ from 'lodash';

import { AggregateRoot } from '../../../common/domain/AggregateRoot';
import { Result } from '../../../common/presentationals/Result';
import { Review } from '../Review/Review';
import { User } from '../../../user/domain/User/User';
import { LikeStatus, LIKE_STATUS } from './LikeStatus';

export interface LikeNewProps {
    status?: LIKE_STATUS;
    review: Review;
    user: User;
}

export interface LikeProps extends LikeNewProps {
    createdAt: Date;
    updatedAt: Date;
}

export const PROPS_VALUES_ARE_REQUIRED = 'Props values are required.';

export class Like extends AggregateRoot<LikeProps> {
    private constructor(props: LikeProps, id?: string) {
        super(props, id);
    }

    static createNew(props: LikeNewProps): Result<Like> {
        if (_.isNil(props.review) || _.isNil(props.user)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        return Result.ok(new Like({
            ...props,
            status: this.getLikeStatusAndSetIfStatusIsUndefined(props),
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
    }

    static create(props: LikeProps, id: string): Result<Like> {
        return Result.ok(new Like(props, id));
    }

    get status(): LIKE_STATUS {
        return this.props.status;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    get review(): Review {
        return this.props.review;
    }

    get user(): User {
        return this.props.user;
    }

    private static getLikeStatusAndSetIfStatusIsUndefined(props: LikeNewProps) {
        let { status } = props;
        if (_.isNil(props.status) || _.isEmpty(props.status)) {
            status = LikeStatus.NORMAL;
        }

        return status;
    }
}
