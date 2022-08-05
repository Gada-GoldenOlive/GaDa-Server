import { ValueObject } from '../../common/domain/ValueObject';
import { Result } from '../../common/presentationals/Result';

interface UserTotalDistanceProps {
    value: number;
}

export const USER_TOTAL_DISTANCE_CANNOT_BE_NEGATIVE = 'User total distance cannot be negative.';

export class UserTotalDistance extends ValueObject<UserTotalDistanceProps> {
    private constructor(props: UserTotalDistanceProps) {
        super(props);
    }

    static create(totalDistance: number): Result<UserTotalDistance> {
        if (totalDistance < 0) {
            return Result.fail(USER_TOTAL_DISTANCE_CANNOT_BE_NEGATIVE);
        }

        return Result.ok(new UserTotalDistance({ value: totalDistance }));
    }

    get value(): number {
        return this.props.value;
    }
}