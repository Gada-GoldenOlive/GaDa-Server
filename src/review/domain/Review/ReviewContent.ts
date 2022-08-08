import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

export interface ReviewContentProps {
    value: string;
}

export class ReviewContent extends ValueObject<ReviewContentProps> {
    private constructor(props: ReviewContentProps) {
        super(props);
    }

    static create(reviewContentString: string): Result<ReviewContent> {
        return Result.ok(new ReviewContent({ value: reviewContentString }));
    }

    get value(): string {
        return this.props.value;
    }
}
