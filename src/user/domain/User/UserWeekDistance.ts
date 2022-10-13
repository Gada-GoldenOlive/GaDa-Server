import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

interface UserWeekDistanceProps {
    value: number;
}

export const USER_WEEK_DISTANCE_CANNOT_BE_NEGATIVE = 'User week distance cannot be negative.';

export class UserWeekDistance extends ValueObject<UserWeekDistanceProps> {
    private constructor(props: UserWeekDistanceProps) {
        super(props);
    }

    static create(weekDistance: number): Result<UserWeekDistance> {
        if (weekDistance < 0) {
            return Result.fail(USER_WEEK_DISTANCE_CANNOT_BE_NEGATIVE);
        }

        return Result.ok(new UserWeekDistance({ value: weekDistance }));
    }

    get value(): number {
        return this.props.value;
    }
}
