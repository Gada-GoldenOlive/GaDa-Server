import { UserPassword, USER_PASSWORD_SHOULD_BE_LONGER_THAN_MINI_LENGTH, USER_PASSWORD_SHOULD_NOT_BE_EMPTY } from './UserPassword';

describe('UserPassword', () => {
    const userPasswordString = '12345678910';

    it('UserPassword create 성공', () => {
        const userPasswordOrError = UserPassword.create(userPasswordString);

        expect(userPasswordOrError.isSuccess).toBeTruthy();
        expect(userPasswordOrError.value.value).toBe(userPasswordString);
    });

    it('빈 값이 들어왔다면 create은 실패해야 한다.', () => {
        const userPasswordOrError = UserPassword.create('');

        expect(userPasswordOrError.isFailure).toBeTruthy();
        expect(userPasswordOrError.errorValue()).toBe(USER_PASSWORD_SHOULD_NOT_BE_EMPTY);
    });

	it('UserPassword가 최소 길이를 넘기지 않았다면 create은 실패해야 한다.', () => {
		const userPasswordOrError = UserPassword.create('12345');
	
		expect(userPasswordOrError.isSuccess).toBe(false);
		expect(userPasswordOrError.errorValue()).toEqual(USER_PASSWORD_SHOULD_BE_LONGER_THAN_MINI_LENGTH);
	});
});
