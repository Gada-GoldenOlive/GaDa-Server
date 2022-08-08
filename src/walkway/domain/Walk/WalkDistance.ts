import { ValueObject } from "../../../common/domain/ValueObject";
import { Result } from "../../../common/presentationals/Result";

interface WalkDistanceProps {
    value: number;
}

export const WALK_DISTANCE_CANNOT_BE_NEGATIVE = 'walk distance cannot be negative.';

export class WalkDistance extends ValueObject<WalkDistanceProps> {
    private constructor(props: WalkDistanceProps) {
        super(props);
    }

    static create(totalDistance: number): Result<WalkDistance> {
        if (totalDistance < 0) {
            return Result.fail(WALK_DISTANCE_CANNOT_BE_NEGATIVE);
        }

        return Result.ok(new WalkDistance({ value: totalDistance }));
    }

    get value(): number {
        return this.props.value;
    }
}
