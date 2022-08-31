import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

export interface UserNameProps {
    value: string;
}

export const USER_NAME_SHOULD_NOT_BE_EMPTY = 'User name should not be empty.';

export class UserName extends ValueObject<UserNameProps> {
    private constructor(props: UserNameProps) {
        super(props);
    }

    static create(userNameString: string): Result<UserName> {
        if (_.isEmpty(userNameString)) {
            return Result.fail(USER_NAME_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new UserName({ value: userNameString }));
    }

    get value(): string {
        return this.props.value;
    }
}
