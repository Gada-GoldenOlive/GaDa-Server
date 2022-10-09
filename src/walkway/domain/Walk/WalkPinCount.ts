import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

interface WalkPinCountProps {
    value: number;
}

export const WALK_PINCOUNT_CANNOT_BE_NEGATIVE = 'walk pinCount cannot be negative.';

export class WalkPinCount extends ValueObject<WalkPinCountProps> {
    private constructor(props: WalkPinCountProps) {
        super(props);
    }

    static create(pinCount: number): Result<WalkPinCount> {
        if (pinCount < 0) {
            return Result.fail(WALK_PINCOUNT_CANNOT_BE_NEGATIVE);
        }

        return Result.ok(new WalkPinCount({ value: pinCount }));
    }

    get value(): number {
        return this.props.value;
    }
}
