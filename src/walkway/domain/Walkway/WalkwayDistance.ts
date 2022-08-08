import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

interface WalkwayDistanceProps {
    value: number;
}

export const WALKWAY_DISTANCE_CANNOT_BE_NEGATIVE = 'Walkway distance cannot be negative.';

export class WalkwayDistance extends ValueObject<WalkwayDistanceProps> {
    private constructor(props: WalkwayDistanceProps) {
        super(props);
    }

    static create(distance: number): Result<WalkwayDistance> {
        if (distance < 0) {
            return Result.fail(WALKWAY_DISTANCE_CANNOT_BE_NEGATIVE);
        }

        return Result.ok(new WalkwayDistance({ value: distance }));
    }

    get value(): number {
        return this.props.value;
    }
}
