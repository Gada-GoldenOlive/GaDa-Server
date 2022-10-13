import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

interface UserWeekTimeProps {
    value: number;
}

export const USER_WEEK_TIME_CANNOT_BE_NEGATIVE = 'User week time cannot be negative.';

export class UserWeekTime extends ValueObject<UserWeekTimeProps> {
    private constructor(props: UserWeekTimeProps) {
        super(props);
    }

    static create(weekTime: number): Result<UserWeekTime> {
        if (weekTime < 0) {
            return Result.fail(USER_WEEK_TIME_CANNOT_BE_NEGATIVE);
        }

        return Result.ok(new UserWeekTime({ value: weekTime }));
    }

    get value(): number {
        return this.props.value;
    }
}
