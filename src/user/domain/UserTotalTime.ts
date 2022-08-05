import { ValueObject } from '../../common/domain/ValueObject';
import { Result } from '../../common/presentationals/Result';

interface UserTotalTimeProps {
    value: number;
}

export const USER_TOTAL_TIME_CANNOT_BE_NEGATIVE = 'User total time cannot be negative.';

export class UserTotalTime extends ValueObject<UserTotalTimeProps> {
    private constructor(props: UserTotalTimeProps) {
        super(props);
    }

    static create(totalTime: number): Result<UserTotalTime> {
        if (totalTime < 0) {
            return Result.fail(USER_TOTAL_TIME_CANNOT_BE_NEGATIVE);
        }

        return Result.ok(new UserTotalTime({ value: totalTime }));
    }

    get value(): number {
        return this.props.value;
    }
}