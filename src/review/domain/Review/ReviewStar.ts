import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

export interface ReviewStarProps {
    value: number;
}

export const MIN_STAR = 0;
export const MAX_STAR = 5;
export const REVIEW_STAR_SHOULD_BE_WITHIN_RANGE = `Review star should be between ${MIN_STAR} and ${MAX_STAR}.`;

export class ReviewStar extends ValueObject<ReviewStarProps> {
    private constructor(props: ReviewStarProps) {
        super(props);
    }

    static create(reviewStarNumber: number): Result<ReviewStar> {
        if (reviewStarNumber < MIN_STAR || reviewStarNumber > MAX_STAR) {
            return Result.fail(REVIEW_STAR_SHOULD_BE_WITHIN_RANGE);
        }

        return Result.ok(new ReviewStar({ value: reviewStarNumber }));
    }

    get value(): number {
        return this.props.value;
    }
}
