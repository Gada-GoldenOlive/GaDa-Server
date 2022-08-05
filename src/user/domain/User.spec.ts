import { PROPS_VALUES_ARE_REQUIRED } from '../../common/domain/Image/Image';
import { ImageUrl, IMAGE_URL_SHOULD_NOT_BE_EMPTY } from '../../common/domain/Image/ImageUrl';
import { initialNumber, User } from './User';
import { UserName } from './UserName';
import { UserPinCount } from './UserPinCount';
import { UserTotalDistance } from './UserTotalDistance';
import { UserTotalTime } from './UserTotalTime';


describe('User', () => {
    const TEST_USER_ID = 'test-user-uuid';
    const userName = UserName.create('시어니').value;
    const userImage = ImageUrl.create('test-image-url.png').value;
    const userPinCount = UserPinCount.create(initialNumber).value;
    const userTotalDistance = UserTotalDistance.create(initialNumber).value;
    const userTotalTime = UserTotalTime.create(initialNumber).value;
    const createdAt = new Date();
    const updatedAt = new Date();

    it('User createNew 성공', () => {
        const userOrError = User.createNew({
            name: userName,
            image: userImage,
            pinCount: userPinCount,
            totalDistance: userTotalDistance,
            totalTime: userTotalDistance,
        });

        expect(userOrError.isSuccess).toBeTruthy();
        expect(userOrError.value.id).toBeDefined();
        expect(userOrError.value.name.value).toBe(userName.value);
        expect(userOrError.value.image.value).toBe(userImage.value);
        expect(userOrError.value.pinCount.value).toBe(userPinCount.value);
        expect(userOrError.value.totalDistance.value).toBe(userTotalDistance.value);
        expect(userOrError.value.totalTime.value).toBe(userTotalTime.value);
    });

    it('User create 성공', () => {
        const userOrError = User.create({
            name: userName,
            image: userImage,
            pinCount: userPinCount,
            totalDistance: userTotalDistance,
            totalTime: userTotalDistance,
            createdAt,
            updatedAt,
        }, TEST_USER_ID);

        expect(userOrError.isSuccess).toBeTruthy();
        expect(userOrError.value.id).toBe(TEST_USER_ID);
        expect(userOrError.value.name.value).toBe(userName.value);
        expect(userOrError.value.image.value).toBe(userImage.value);
        expect(userOrError.value.pinCount.value).toBe(userPinCount.value);
        expect(userOrError.value.totalDistance.value).toBe(userTotalDistance.value);
        expect(userOrError.value.totalTime.value).toBe(userTotalTime.value);
        expect(userOrError.value.createdAt).toBe(createdAt);
        expect(userOrError.value.updatedAt).toBe(updatedAt);
    });

    it('name이 null이나 undefined로 전달될 경우 User createNew는 실패해야 한다.', () => {
        const userOrErrorWIthNull = User.createNew({
            name: null,
            image: userImage,
            pinCount: userPinCount,
            totalDistance: userTotalDistance,
            totalTime: userTotalDistance,
        });
        
        const userOrErrorWIthUndefined = User.createNew({
            name: undefined,
            image: userImage,
            pinCount: userPinCount,
            totalDistance: userTotalDistance,
            totalTime: userTotalDistance,
        });
        
        expect(userOrErrorWIthNull.isFailure).toBeTruthy();
        expect(userOrErrorWIthUndefined.isFailure).toBeTruthy();
        expect(userOrErrorWIthNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(userOrErrorWIthUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

    it('user pin count가 전달되지 않았을 경우 createNew에서 0개로 자동 생성되어야 한다.', () => {
        const userPinCountOrError = User.createNew({
            name: userName,
            image: userImage,
            totalDistance: userTotalDistance,
            totalTime: userTotalDistance,
        });

        expect(userPinCountOrError.isSuccess).toBeTruthy();
        expect(userPinCountOrError.value.pinCount.value).toBe(initialNumber);
    })

    it('user total distance가 전달되지 않았을 경우 createNew에서 0으로 자동 생성되어야 한다.', () => {
        const userTotalDistanceOrError = User.createNew({
            name: userName,
            image: userImage,
            pinCount: userPinCount,
            totalTime: userTotalDistance,
        });

        expect(userTotalDistanceOrError.isSuccess).toBeTruthy();
        expect(userTotalDistanceOrError.value.totalDistance.value).toBe(initialNumber);
    });

    it('user total time이 전달되지 않았을 경우 createNew에서 0으로 자동 생성되어야 한다.', () => {
        const userTotalTimeOrError = User.createNew({
            name: userName,
            image: userImage,
            pinCount: userPinCount,
            totalDistance: userTotalDistance,
        });

        expect(userTotalTimeOrError.isSuccess).toBeTruthy();
        expect(userTotalTimeOrError.value.totalTime.value).toBe(initialNumber);
    });

    it('user pin count가 null이나 undefined로 전달 될 경우 createNew에서 0개로 자동 생성되어야 한다.', () => {
        const userPinCountOrErrorWithNull = User.createNew({
            name: userName,
            image: userImage,
            pinCount: null,
            totalDistance: userTotalDistance,
            totalTime: userTotalDistance,
        });

        const userPinCountOrErrorWithUndefined = User.createNew({
            name: userName,
            image: userImage,
            pinCount: null,
            totalDistance: userTotalDistance,
            totalTime: userTotalDistance,
        });

        expect(userPinCountOrErrorWithNull.isSuccess).toBeTruthy();
        expect(userPinCountOrErrorWithUndefined.isSuccess).toBeTruthy();
        expect(userPinCountOrErrorWithNull.value.pinCount.value).toBe(initialNumber);
        expect(userPinCountOrErrorWithUndefined.value.pinCount.value).toBe(initialNumber);
    });

})