import { UserLoginId, USER_LOGIN_ID_SHOULD_BE_LONGER_THAN_MINI_LENGTH, USER_LOGIN_ID_SHOULD_NOT_BE_EMPTY } from './UserLoginId';

describe('UserLoginId', () => {
    const userLoginIdString = '12345678910';

    it('UserLoginId create 성공', () => {
        const userLoginIdOrError = UserLoginId.create(userLoginIdString);

        expect(userLoginIdOrError.isSuccess).toBeTruthy();
        expect(userLoginIdOrError.value.value).toBe(userLoginIdString);
    });

    it('빈 값이 들어왔다면 create은 실패해야 한다.', () => {
        const userLoginIdOrError = UserLoginId.create('');

        expect(userLoginIdOrError.isFailure).toBeTruthy();
        expect(userLoginIdOrError.errorValue()).toBe(USER_LOGIN_ID_SHOULD_NOT_BE_EMPTY);
    });

	it('UserLoginId가 최소 길이를 넘기지 않았다면 create은 실패해야 한다.', () => {
		const userLoginIdOrError = UserLoginId.create('12345');
	
		expect(userLoginIdOrError.isSuccess).toBe(false);
		expect(userLoginIdOrError.errorValue()).toEqual(USER_LOGIN_ID_SHOULD_BE_LONGER_THAN_MINI_LENGTH);
	});
});
