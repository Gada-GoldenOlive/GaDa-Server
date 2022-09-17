import { UserGoalTime, USER_GOAL_TIME_CANNOT_BE_NEGATIVE } from './UserGoalTime';

describe('UserGoalTime', () => {
    const startUserGoalTimeNumber = 0;

    it('UserGoalTime create 성공', () => {
        const UserGoalTimeOrError = UserGoalTime.create(startUserGoalTimeNumber);

        expect(UserGoalTimeOrError.isSuccess).toBeTruthy();
        expect(UserGoalTimeOrError.value.value).toBe(startUserGoalTimeNumber);
    });

    it('사용자가 설정한 목표 시간(goal time)는 음수일 수 없다.', () => {
        const UserGoalTimeWithNegative = -1;

        const UserGoalTimeOrErrorWithNegative = UserGoalTime.create(UserGoalTimeWithNegative);

        expect(UserGoalTimeOrErrorWithNegative.isFailure).toBeTruthy();
        expect(UserGoalTimeOrErrorWithNegative.errorValue()).toBe(USER_GOAL_TIME_CANNOT_BE_NEGATIVE);
    });
});
