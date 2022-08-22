import { UserName, USER_NAME_SHOULD_NOT_BE_EMPTY } from './UserName';

describe('UserName', () => {
    const userNameString = '서시언';

    it('UserName create 성공', () => {
        const userNameOrError = UserName.create(userNameString);

        expect(userNameOrError.isSuccess).toBeTruthy();
        expect(userNameOrError.value.value).toBe(userNameString);
    });

    it('빈 값이 들어왔다면 create은 실패해야 한다.', () => {
        const userNameOrError = UserName.create('');

        expect(userNameOrError.isFailure).toBeTruthy();
        expect(userNameOrError.errorValue()).toBe(USER_NAME_SHOULD_NOT_BE_EMPTY);
    });
});
