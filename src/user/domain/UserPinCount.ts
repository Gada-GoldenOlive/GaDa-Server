import { ValueObject } from '../../common/domain/ValueObject';
import { Result } from '../../common/presentationals/Result';

export interface UserPinCountProps {
    value: number;
}

export const USER_PIN_COUNT_CANNOT_BE_NEGATIVE = 'User pin count cannot be negative.';

export class UserPinCount extends ValueObject<UserPinCountProps> {
    private constructor(props: UserPinCountProps) {
        super(props);
    }

    static create(pinCount: number): Result<UserPinCount> {
        if (pinCount < 0) {
            return Result.fail(USER_PIN_COUNT_CANNOT_BE_NEGATIVE);
        }
        
        return Result.ok(new UserPinCount({ value: pinCount }));
    }

    get value(): number {
        return this.props.value;
    }
}