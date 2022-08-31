import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

interface WalkTimeProps {
    value: number;
}

export const WALK_TIME_CANNOT_BE_NEGATIVE = 'walk time cannot be negative.';

export class WalkTime extends ValueObject<WalkTimeProps> {
    private constructor(props: WalkTimeProps) {
        super(props);
    }

    static create(totalTime: number): Result<WalkTime> {
        if (totalTime < 0) {
            return Result.fail(WALK_TIME_CANNOT_BE_NEGATIVE);
        }

        return Result.ok(new WalkTime({ value: totalTime }));
    }

    get value(): number {
        return this.props.value;
    }
}
