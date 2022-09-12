import { UserGoalDistance, USER_GOAL_DISTANCE_CANNOT_BE_NEGATIVE } from './UserGoalDistance';

describe('UserGoalDistance', () => {
    const startUserGoalDistanceNumber = 0;

    it('UserGoalDistance create 성공', () => {
        const UserGoalDistanceOrError = UserGoalDistance.create(startUserGoalDistanceNumber);

        expect(UserGoalDistanceOrError.isSuccess).toBeTruthy();
        expect(UserGoalDistanceOrError.value.value).toBe(startUserGoalDistanceNumber);
    });

    it('사용자가 설정한 목표 거리(goal distance)는 음수일 수 없다.', () => {
        const UserGoalDistanceWithNegative = -1;

        const UserGoalDistanceOrErrorWithNegative = UserGoalDistance.create(UserGoalDistanceWithNegative);

        expect(UserGoalDistanceOrErrorWithNegative.isFailure).toBeTruthy();
        expect(UserGoalDistanceOrErrorWithNegative.errorValue()).toBe(USER_GOAL_DISTANCE_CANNOT_BE_NEGATIVE);
    });
});
