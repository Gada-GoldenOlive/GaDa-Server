import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

interface UserPasswordProps {
  value: string;
}

export const USER_PASSWORD_SHOULD_NOT_BE_EMPTY = 'User password should not be empty.';
export const MIN_LENGTH = 6;
export const USER_PASSWORD_SHOULD_BE_LONGER_THAN_MINI_LENGTH = `User password should be longer than ${MIN_LENGTH}`;

export class UserPassword extends ValueObject<UserPasswordProps> {
	private constructor(props: UserPasswordProps) {
	  super(props);
	}

	static create(userPasswordString: string): Result<UserPassword> {
		if (_.isEmpty(userPasswordString)) {
			return Result.fail(USER_PASSWORD_SHOULD_NOT_BE_EMPTY);
		}

		if (userPasswordString.length < MIN_LENGTH) {
			return Result.fail(USER_PASSWORD_SHOULD_BE_LONGER_THAN_MINI_LENGTH);
		}

		return Result.ok(new UserPassword({ value: userPasswordString }));
	}

	get value(): string {
		return this.props.value;
	}
}
