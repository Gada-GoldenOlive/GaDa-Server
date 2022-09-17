import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

interface UserGoalTimeProps {
    value: number;
}

export const USER_GOAL_TIME_CANNOT_BE_NEGATIVE = 'User goal time cannot be negative.';

export class UserGoalTime extends ValueObject<UserGoalTimeProps> {
    private constructor(props: UserGoalTimeProps) {
        super(props);
    }

    static create(goalTime: number): Result<UserGoalTime> {
        if (goalTime < 0) {
            return Result.fail(USER_GOAL_TIME_CANNOT_BE_NEGATIVE);
        }

        return Result.ok(new UserGoalTime({ value: goalTime }));
    }

    get value(): number {
        return this.props.value;
    }
}
