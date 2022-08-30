import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

interface UserIdProps {
  value: string;
}

export const USER_ID_SHOULD_NOT_BE_EMPTY = 'User id should not be empty.';
export const MIN_LENGTH = 6;
export const USER_ID_SHOULD_BE_LONGER_THAN_MINI_LENGTH = `User id should be longer than ${MIN_LENGTH}`;

export class UserId extends ValueObject<UserIdProps> {
	private constructor(props: UserIdProps) {
	  super(props);
	}

	static create(userIdString: string): Result<UserId> {
		if (_.isEmpty(userIdString)) {
			return Result.fail(USER_ID_SHOULD_NOT_BE_EMPTY);
		}

		if (userIdString.length < MIN_LENGTH) {
			return Result.fail(USER_ID_SHOULD_BE_LONGER_THAN_MINI_LENGTH);
		}

		return Result.ok(new UserId({ value: userIdString }));
	}

	get value(): string {
		return this.props.value;
	}
}
