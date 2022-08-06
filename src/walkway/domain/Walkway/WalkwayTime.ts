import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

interface WalkwayTimeProps {
    value: number;
}

export const WALKWAY_TIME_CANNOT_BE_NEGATIVE = 'Walkway time cannot be negative.';

export class WalkwayTime extends ValueObject<WalkwayTimeProps> {
    private constructor(props: WalkwayTimeProps) {
        super(props);
    }

    static create(time: number): Result<WalkwayTime> {
        if (time < 0) {
            return Result.fail(WALKWAY_TIME_CANNOT_BE_NEGATIVE);
        }

        return Result.ok(new WalkwayTime({ value: time }));
    }

    get value(): number {
        return this.props.value;
    }
}