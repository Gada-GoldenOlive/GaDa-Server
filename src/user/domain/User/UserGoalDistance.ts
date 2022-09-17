import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

interface UserGoalDistanceProps {
    value: number;
}

export const USER_GOAL_DISTANCE_CANNOT_BE_NEGATIVE = 'User goal distance cannot be negative.';

export class UserGoalDistance extends ValueObject<UserGoalDistanceProps> {
    private constructor(props: UserGoalDistanceProps) {
        super(props);
    }

    static create(goalDistance: number): Result<UserGoalDistance> {
        if (goalDistance < 0) {
            return Result.fail(USER_GOAL_DISTANCE_CANNOT_BE_NEGATIVE);
        }

        return Result.ok(new UserGoalDistance({ value: goalDistance }));
    }

    get value(): number {
        return this.props.value;
    }
}
