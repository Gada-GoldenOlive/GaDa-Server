import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

interface UserLoginIdProps {
  value: string;
}

export const USER_LOGIN_ID_SHOULD_NOT_BE_EMPTY = 'User id should not be empty.';
export const MIN_LENGTH = 6;
export const USER_LOGIN_ID_SHOULD_BE_LONGER_THAN_MINI_LENGTH = `User id should be longer than ${MIN_LENGTH}`;

export class UserLoginId extends ValueObject<UserLoginIdProps> {
	private constructor(props: UserLoginIdProps) {
	  super(props);
	}

	static create(userLoginIdString: string): Result<UserLoginId> {
		if (_.isEmpty(userLoginIdString)) {
			return Result.fail(USER_LOGIN_ID_SHOULD_NOT_BE_EMPTY);
		}

		if (userLoginIdString.length < MIN_LENGTH) {
			return Result.fail(USER_LOGIN_ID_SHOULD_BE_LONGER_THAN_MINI_LENGTH);
		}

		return Result.ok(new UserLoginId({ value: userLoginIdString }));
	}

	get value(): string {
		return this.props.value;
	}
}
