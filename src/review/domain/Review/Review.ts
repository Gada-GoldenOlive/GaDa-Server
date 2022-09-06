import _ from 'lodash';

import { AggregateRoot } from '../../../common/domain/AggregateRoot';
import { PROPS_VALUES_ARE_REQUIRED } from '../../../common/domain/Image/Image';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { Result } from '../../../common/presentationals/Result';
import { Walk } from '../../../walkway/domain/Walk/Walk';
import { ReviewContent } from './ReviewContent';
import { ReviewStar } from './ReviewStar';
import { ReviewStatus, REVIEW_STATUS } from './ReviewStatus';
import { ReviewTitle } from './ReviewTitle';
import { VEHCILE_STATUS } from './Vehicle';

export interface ReviewNewProps {
    title: ReviewTitle;
    vehicle: VEHCILE_STATUS;
    star: ReviewStar;
    content: ReviewContent;
    image?: ImageUrl;
    status?: REVIEW_STATUS;
    walk: Walk;
}

export interface ReviewProps extends ReviewNewProps {
    createdAt: Date;
    updatedAt: Date;
}

export class Review extends AggregateRoot<ReviewProps> {
    private constructor(props: ReviewProps, id?: string) {
        super(props, id);
    }

    static createNew(props: ReviewNewProps): Result<Review> {
        // NOTE: 이미지는 프론트로부터 전달 안 될 수 O, 나머지는 각각의 domain에서 empty 검사 해주니까 또 적어줄 필요 X
        if (_.isNil(props.title) || _.isNil(props.vehicle) || _.isNil(props.star) ||  _.isNil(props.content)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        return Result.ok(new Review({
            ...props,
            status: this.getReviewStatusAndSetIfStatusIsUndefined(props),
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
    }

    static create(props: ReviewProps, id: string): Result<Review> {
        return Result.ok(new Review(props, id));
    }

    get title(): ReviewTitle {
        return this.props.title;
    }

    get vehicle(): VEHCILE_STATUS {
        return this.props.vehicle;
    }

    get star(): ReviewStar {
        return this.props.star;
    }

    get content(): ReviewContent {
        return this.props.content;
    }

    get image(): ImageUrl {
        return this.props.image;
    }
    
    get status(): REVIEW_STATUS {
        return this.props.status;
    }

    get walk(): Walk {
        return this.props.walk;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }
    
    get updatedAt(): Date {
        return this.props.updatedAt;
    }
    
    private static getReviewStatusAndSetIfStatusIsUndefined(props: ReviewNewProps) {
        let { status } = props;
        if (_.isNil(props.status) || _.isEmpty(props.status)) {
            status = ReviewStatus.NORMAL;
        }
        
        return status;
    }
}
