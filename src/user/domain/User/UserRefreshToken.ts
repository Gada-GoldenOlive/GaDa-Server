import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

interface UserRefreshTokenProps {
    value: string;
}

export const USER_REFRESHTOKEN_SHOULD_NOT_BE_EMPTY = 'User refresh token should not be empty.';

export class UserRefreshToken extends ValueObject<UserRefreshTokenProps> {
    private constructor(props: UserRefreshTokenProps) {
      super(props);
    }

    static create(userRefreshTokenString: string): Result<UserRefreshToken> {
        if (_.isEmpty(userRefreshTokenString)) {
            return Result.fail(USER_REFRESHTOKEN_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new UserRefreshToken({ value: userRefreshTokenString }));
    }

    get value(): string {
        return this.props.value;
    }
}
