import { PROPS_VALUES_ARE_REQUIRED } from '../../../common/domain/Image/Image';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { User } from '../../../user/domain/User/User';
import { UserLoginId } from '../../../user/domain/User/UserLoginId';
import { UserName } from '../../../user/domain/User/UserName';
import { UserPassword } from '../../../user/domain/User/UserPassword';
import { UserTotalDistance } from '../../../user/domain/User/UserTotalDistance';
import { UserTotalTime } from '../../../user/domain/User/UserTotalTime';
import { Walkway } from './Walkway';
import { WalkwayAddress } from './WalkwayAddress';
import { WalkwayDistance } from './WalkwayDistance';
import { WalkwayEndPoint } from './WalkwayEndPoint';
import { WalkwayPath } from './WalkwayPath';
import { WalkwayStartPoint } from './WalkwayStartPoint';
import { WalkwayStatus } from './WalkwayStatus';
import { WalkwayTime } from './WalkwayTime';
import { WalkwayTitle } from './WalkwayTitle';

describe('Walkway', () => {
    const TEST_WALKWAY_ID = 'test-walkway-uuid';
    const walkwayTitle = WalkwayTitle.create('서지니 집 가는 길').value;
    const walkwayAddress = WalkwayAddress.create('서울특별시 성동구 왕십리로 222').value;
    const walkwayDistance = WalkwayDistance.create(300).value;
    const walkwayTime = WalkwayTime.create(30).value;
    const walkwayPath = WalkwayPath.create([
        {lat: 100, lng: 40}, 
        {lat: 100, lng: 40},
    ]).value;
    const walkwayStartPoint = WalkwayStartPoint.create({
        lat: 100,
        lng: 40
    }).value;
    const createdAt = new Date();
    const updatedAt = new Date();
    const TEST_USER_ID = 'test-user-uuid';
    const userName = UserName.create('유저이름').value;
    const userImage = ImageUrl.create('user-image-test.png').value;
    const userId = UserLoginId.create('user-id').value;
    const userPassword = UserPassword.create('user-password').value;
    const userTotalDistance = UserTotalDistance.create(20).value;
    const userTotalTime = UserTotalTime.create(1123).value;
    const user = User.create({
        name: userName,
        image: userImage,
        totalDistance: userTotalDistance,
        totalTime: userTotalTime,
        loginId: userId,
        password: userPassword,
        createdAt,
        updatedAt,
    }, TEST_USER_ID).value;


    it('Walkway createNew 성공', () => {
        const walkwayOrError = Walkway.createNew({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            user,
            path: walkwayPath,
            startPoint: walkwayStartPoint,
            endPoint: walkwayStartPoint,
            status: WalkwayStatus.NORMAL,
        });

        expect(walkwayOrError.isSuccess).toBeTruthy();
        expect(walkwayOrError.value.id).toBeDefined();
        expect(walkwayOrError.value.title.value).toBe(walkwayTitle.value);
        expect(walkwayOrError.value.address.value).toBe(walkwayAddress.value);
        expect(walkwayOrError.value.distance.value).toBe(walkwayDistance.value);
        expect(walkwayOrError.value.time.value).toBe(walkwayTime.value);
        expect(walkwayOrError.value.path.value).toBe(walkwayPath.value);
        expect(walkwayOrError.value.startPoint.value).toBe(walkwayStartPoint.value);
        expect(walkwayOrError.value.user).toBeDefined();
    })

    it('Walkway create 성공', () => {
        const walkwayOrError = Walkway.create({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            startPoint: walkwayStartPoint,
            user,
            endPoint: walkwayStartPoint,
            status: WalkwayStatus.NORMAL,
            createdAt,
            updatedAt,
        }, TEST_WALKWAY_ID);

        expect(walkwayOrError.isSuccess).toBeTruthy();
        expect(walkwayOrError.value.id).toBe(TEST_WALKWAY_ID);
        expect(walkwayOrError.value.title.value).toBe(walkwayTitle.value);
        expect(walkwayOrError.value.address.value).toBe(walkwayAddress.value);
        expect(walkwayOrError.value.distance.value).toBe(walkwayDistance.value);
        expect(walkwayOrError.value.time.value).toBe(walkwayTime.value);
        expect(walkwayOrError.value.path.value).toBe(walkwayPath.value);
        expect(walkwayOrError.value.startPoint.value).toBe(walkwayStartPoint.value);
        expect(walkwayOrError.value.user).toBeDefined();
        expect(walkwayOrError.value.createdAt).toBe(createdAt);
        expect(walkwayOrError.value.updatedAt).toBe(updatedAt);
    })

    it('title이 null이나 undefined로 전달될 경우 Walkway createNew는 실패해야 한다.', () => {
        const walkwayOrErrorWithNull = Walkway.createNew({
            title: null,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            startPoint: walkwayStartPoint,
            endPoint: walkwayStartPoint,
            user,
        });

        const walkwayOrErrorWithUndefined = Walkway.createNew({
            title: undefined,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            startPoint: walkwayStartPoint,
            endPoint: walkwayStartPoint,
            user,
        });

        expect(walkwayOrErrorWithNull.isFailure).toBeTruthy();
        expect(walkwayOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(walkwayOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(walkwayOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    })

    it('address가 null이나 undefined로 전달될 경우 Walkway createNew는 실패해야 한다.', () => {
        const walkwayOrErrorWithNull = Walkway.createNew({
            title: walkwayTitle,
            address: null,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            startPoint: walkwayStartPoint,
            endPoint: walkwayStartPoint,
            user,
        });

        const walkwayOrErrorWithUndefined = Walkway.createNew({
            title: walkwayTitle,
            address: undefined,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            startPoint: walkwayStartPoint,
            endPoint: walkwayStartPoint,
            user,
        });

        expect(walkwayOrErrorWithNull.isFailure).toBeTruthy();
        expect(walkwayOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(walkwayOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(walkwayOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    })

    it('path가 null이나 undefined로 전달될 경우 Walkway createNew는 실패해야 한다.', () => {
        const walkwayOrErrorWithNull = Walkway.createNew({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: null,
            startPoint: walkwayStartPoint,
            endPoint: walkwayStartPoint,
            user,
        });

        const walkwayOrErrorWithUndefined = Walkway.createNew({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: undefined,
            startPoint: walkwayStartPoint,
            endPoint: walkwayStartPoint,
            user,
        });

        expect(walkwayOrErrorWithNull.isFailure).toBeTruthy();
        expect(walkwayOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(walkwayOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(walkwayOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    })

    it('startPoint가 null이나 undefined로 전달될 경우 Walkway createNew는 실패해야 한다.', () => {
        const walkwayOrErrorWithNull = Walkway.createNew({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            startPoint: null,
            endPoint: walkwayStartPoint,
            user,
        });

        const walkwayOrErrorWithUndefined = Walkway.createNew({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            startPoint: undefined,
            endPoint: walkwayStartPoint,
            user,
        });

        expect(walkwayOrErrorWithNull.isFailure).toBeTruthy();
        expect(walkwayOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(walkwayOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(walkwayOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

    it('user가 null이나 undefined로 전달될 경우 Walkway createNew는 실패해야 한다.', () => {
        const walkwayOrErrorWithNull = Walkway.createNew({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            startPoint: walkwayStartPoint,
            endPoint: walkwayStartPoint,
            user: null,
        });

        const walkwayOrErrorWithUndefined = Walkway.createNew({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            startPoint: walkwayStartPoint,
            endPoint: walkwayStartPoint,
            user: undefined,
        });

        expect(walkwayOrErrorWithNull.isFailure).toBeTruthy();
        expect(walkwayOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(walkwayOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(walkwayOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

    it('status가 전달되지 않은 경우에는 NORMAL로 임의 설정되어야 한다.', () => {
        const walkwayStatusOrError = Walkway.createNew({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            startPoint: walkwayStartPoint,
            endPoint: walkwayStartPoint,
            user,
        });
        
        expect(walkwayStatusOrError.isSuccess).toBeTruthy();
        expect(walkwayStatusOrError.value.status).toBe(WalkwayStatus.NORMAL);
    });

    it('status가 null이나 undefined로 전달되는 경우에는 NORMAL로 임의 설정되어야 한다.', () => {
        const walkwayOrErrorWithNull = Walkway.createNew({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            startPoint: walkwayStartPoint,
            endPoint: walkwayStartPoint,
            user,
            status: null,
        });

        const walkwayOrErrorWithUndefined = Walkway.createNew({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            startPoint: walkwayStartPoint,
            endPoint: walkwayStartPoint,
            user,
            status: undefined,
        });

        expect(walkwayOrErrorWithNull.isSuccess).toBeTruthy();
        expect(walkwayOrErrorWithUndefined.isSuccess).toBeTruthy();
        expect(walkwayOrErrorWithNull.value.status).toBe(WalkwayStatus.NORMAL);
        expect(walkwayOrErrorWithUndefined.value.status).toBe(WalkwayStatus.NORMAL);
    });
})
