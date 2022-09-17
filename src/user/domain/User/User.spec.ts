import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { initialNumber, PROPS_VALUES_ARE_REQUIRED, User } from './User';
import { UserLoginId } from './UserLoginId';
import { UserName } from './UserName';
import { UserPassword } from './UserPassword';
import { UserTotalDistance } from './UserTotalDistance';
import { UserTotalTime } from './UserTotalTime';


describe('User', () => {
    const TEST_USER_ID = 'test-user-uuid';
    const userName = UserName.create('시어니').value;
    const userImage = ImageUrl.create('test-image-url.png').value;
    const userLoginId = UserLoginId.create('user-id').value;
    const userPassword = UserPassword.create('user-password').value;
    const userTotalDistance = UserTotalDistance.create(initialNumber).value;
    const userTotalTime = UserTotalTime.create(initialNumber).value;
    const createdAt = new Date();
    const updatedAt = new Date();

    it('User createNew 성공', () => {
        const userOrError = User.createNew({
            name: userName,
            image: userImage,
            loginId: userLoginId,
            password: userPassword,
            totalDistance: userTotalDistance,
            totalTime: userTotalTime,
        });

        expect(userOrError.isSuccess).toBeTruthy();
        expect(userOrError.value.id).toBeDefined();
        expect(userOrError.value.name.value).toBe(userName.value);
        expect(userOrError.value.image.value).toBe(userImage.value);
        expect(userOrError.value.totalDistance.value).toBe(userTotalDistance.value);
        expect(userOrError.value.totalTime.value).toBe(userTotalTime.value);
    });

    it('User create 성공', () => {
        const userOrError = User.create({
            name: userName,
            image: userImage,
            loginId: userLoginId,
            password: userPassword,
            totalDistance: userTotalDistance,
            totalTime: userTotalTime,
            createdAt,
            updatedAt,
        }, TEST_USER_ID);

        expect(userOrError.isSuccess).toBeTruthy();
        expect(userOrError.value.id).toBe(TEST_USER_ID);
        expect(userOrError.value.name.value).toBe(userName.value);
        expect(userOrError.value.image.value).toBe(userImage.value);
        expect(userOrError.value.totalDistance.value).toBe(userTotalDistance.value);
        expect(userOrError.value.totalTime.value).toBe(userTotalTime.value);
        expect(userOrError.value.createdAt).toBe(createdAt);
        expect(userOrError.value.updatedAt).toBe(updatedAt);
    });

    it('name이 null이나 undefined로 전달될 경우 User createNew는 실패해야 한다.', () => {
        const userOrErrorWithNull = User.createNew({
            name: null,
            image: userImage,
            loginId: userLoginId,
            password: userPassword,
            totalDistance: userTotalDistance,
            totalTime: userTotalTime,
        });
        
        const userOrErrorWithUndefined = User.createNew({
            name: undefined,
            image: userImage,
            loginId: userLoginId,
            password: userPassword,
            totalDistance: userTotalDistance,
            totalTime: userTotalTime,
        });
        
        expect(userOrErrorWithNull.isFailure).toBeTruthy();
        expect(userOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(userOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(userOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

    it('user total distance가 전달되지 않았을 경우 createNew에서 0으로 자동 생성되어야 한다.', () => {
        const userTotalDistanceOrError = User.createNew({
            name: userName,
            image: userImage,
            loginId: userLoginId,
            password: userPassword,
            totalTime: userTotalTime,
        });

        expect(userTotalDistanceOrError.isSuccess).toBeTruthy();
        expect(userTotalDistanceOrError.value.totalDistance.value).toBe(initialNumber);
    });

    it('user total time이 전달되지 않았을 경우 createNew에서 0으로 자동 생성되어야 한다.', () => {
        const userTotalTimeOrError = User.createNew({
            name: userName,
            image: userImage,
            loginId: userLoginId,
            password: userPassword,
            totalDistance: userTotalDistance,
        });

        expect(userTotalTimeOrError.isSuccess).toBeTruthy();
        expect(userTotalTimeOrError.value.totalTime.value).toBe(initialNumber);
    });

    it('user total distance가 null이나 undefined로 전달 될 경우 createNew에서 0개로 자동 생성되어야 한다.', () => {
        const userTotalDistanceOrErrorWithNull = User.createNew({
            name: userName,
            image: userImage,
            loginId: userLoginId,
            password: userPassword,
            totalDistance: null,
            totalTime: userTotalTime,
        });

        const userTotalDistanceOrErrorWithUndefined = User.createNew({
            name: userName,
            image: userImage,
            loginId: userLoginId,
            password: userPassword,
            totalDistance: undefined,
            totalTime: userTotalTime,
        });

        expect(userTotalDistanceOrErrorWithNull.isSuccess).toBeTruthy();
        expect(userTotalDistanceOrErrorWithUndefined.isSuccess).toBeTruthy();
        expect(userTotalDistanceOrErrorWithNull.value.totalDistance.value).toBe(initialNumber);
        expect(userTotalDistanceOrErrorWithUndefined.value.totalDistance.value).toBe(initialNumber);
    });
    
    it('user total time이 null이나 undefined로 전달 될 경우 createNew에서 0개로 자동 생성되어야 한다.', () => {
        const userTotalTimeOrErrorWithNull = User.createNew({
            name: userName,
            image: userImage,
            loginId: userLoginId,
            password: userPassword,
            totalDistance: userTotalDistance,
            totalTime: null,
        });

        const userTotalTimeOrErrorWithUndefined = User.createNew({
            name: userName,
            image: userImage,
            loginId: userLoginId,
            password: userPassword,
            totalDistance: userTotalDistance,
            totalTime: undefined,
        });

        expect(userTotalTimeOrErrorWithNull.isSuccess).toBeTruthy();
        expect(userTotalTimeOrErrorWithUndefined.isSuccess).toBeTruthy();
        expect(userTotalTimeOrErrorWithNull.value.totalDistance.value).toBe(initialNumber);
        expect(userTotalTimeOrErrorWithUndefined.value.totalDistance.value).toBe(initialNumber);
    });
});
