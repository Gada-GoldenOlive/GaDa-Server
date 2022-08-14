import { UserId, USER_ID_SHOULD_BE_LONGER_THAN_MINI_LENGTH, USER_ID_SHOULD_NOT_BE_EMPTY } from './UserId';

describe('UserId', () => {
    const userIdString = '12345678910';

    it('UserId create 성공', () => {
        const userIdOrError = UserId.create(userIdString);

        expect(userIdOrError.isSuccess).toBeTruthy();
        expect(userIdOrError.value.value).toBe(userIdString);
    });

    it('빈 값이 들어왔다면 create은 실패해야 한다.', () => {
        const userIdOrError = UserId.create('');

        expect(userIdOrError.isFailure).toBeTruthy();
        expect(userIdOrError.errorValue()).toBe(USER_ID_SHOULD_NOT_BE_EMPTY);
    });

	it('UserId가 최소 길이를 넘기지 않았다면 create은 실패해야 한다.', () => {
		const userIdOrError = UserId.create('12345');
	
		expect(userIdOrError.isSuccess).toBe(false);
		expect(userIdOrError.errorValue()).toEqual(USER_ID_SHOULD_BE_LONGER_THAN_MINI_LENGTH);
	});
});
