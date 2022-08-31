import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { User } from '../../../user/domain/User/User';
import { UserName } from '../../../user/domain/User/UserName';
import { UserStatus } from '../../../user/domain/User/UserStatus';
import { UserTotalDistance } from '../../../user/domain/User/UserTotalDistance';
import { UserTotalTime } from '../../../user/domain/User/UserTotalTime';
import { Walkway } from '../../../walkway/domain/Walkway/Walkway';
import { WalkwayAddress } from '../../../walkway/domain/Walkway/WalkwayAddress';
import { WalkwayDistance } from '../../../walkway/domain/Walkway/WalkwayDistance';
import { WalkwayPath } from '../../../walkway/domain/Walkway/WalkwayPath';
import { WalkwayStartPoint } from '../../../walkway/domain/Walkway/WalkwayStartPoint';
import { WalkwayStatus } from '../../../walkway/domain/Walkway/WalkwayStatus';
import { WalkwayTime } from '../../../walkway/domain/Walkway/WalkwayTime';
import { WalkwayTitle } from '../../../walkway/domain/Walkway/WalkwayTitle';
import { Pin, PROPS_VALUES_ARE_REQUIRED } from './Pin';
import { PinContent } from './PinContent';
import { PinLocation } from './PinLocation';
import { PinStatus } from './PinStatus';
import { PinTitle } from './PinTitle';

describe('Pin', () => {
    const TEST_PIN_ID = 'test-pin-uuid';
    const pinTitle = PinTitle.create('여기에 경사가 있어요').value;
    const pinContent = PinContent.create('대충 내용').value;
    const pinImage = ImageUrl.create('test-image-url.png').value;
    const pinLocation = PinLocation.create({
        lat: 12124.125124,
        lng: 1512.1241424,
    }).value;
    const createdAt = new Date();
    const updatedAt = new Date();
    const TEST_USER_ID = 'test-user-uuid';
    const userName = UserName.create('유저이름').value;
    const userImage = ImageUrl.create('user-image-test.png').value;
    const userTotalDistance = UserTotalDistance.create(20).value;
    const userTotalTime = UserTotalTime.create(1123).value;
    const user = User.create({
        name: userName,
        image: userImage,
        totalDistance: userTotalDistance,
        totalTime: userTotalTime,
        status: UserStatus.NORMAL,
        createdAt,
        updatedAt,
    }, TEST_USER_ID).value;
    const TEST_WALKWAY_ID = 'test-walkway-uuid';
    const walkwayTitle = WalkwayTitle.create('산책로 이름').value;
    const walkwayAddress = WalkwayAddress.create('산책로 주소').value
    const walkwayDistance = WalkwayDistance.create(25).value;
    const walkwayTime = WalkwayTime.create(30).value;
    const walkwayPath = WalkwayPath.create([
        {lat: 100, lng: 40}, 
        {lat: 100, lng: 40},
    ]).value;
    const walkwayStartPoint = WalkwayStartPoint.create({
        lat: 100,
        lng: 40
    }).value;
    const walkway = Walkway.create({
        title: walkwayTitle,
        address: walkwayAddress,
        distance: walkwayDistance,
        time: walkwayTime,
        path: walkwayPath,
        status: WalkwayStatus.NORMAL,
        startPoint: walkwayStartPoint,
        user,
        createdAt,
        updatedAt,
    }, TEST_WALKWAY_ID).value;

    it('Pin createNew 성공', () => {
        const pinOrError = Pin.createNew({
            title: pinTitle,
            content: pinContent,
            image: pinImage,
            location: pinLocation,
            walkway,
            user,
            status: PinStatus.NORMAL,
        });
        
        expect(pinOrError.isSuccess).toBeTruthy();
        expect(pinOrError.value.id).toBeDefined();
        expect(pinOrError.value.title.value).toBe(pinTitle.value);
        expect(pinOrError.value.content.value).toBe(pinContent.value);
        expect(pinOrError.value.image.value).toBe(pinImage.value);
        expect(pinOrError.value.walkway).toBeDefined();
    });

    it('Pin create 성공', () => {
        const pinOrError = Pin.create({
            title: pinTitle,
            content: pinContent,
            image: pinImage,
            location: pinLocation,
            status: PinStatus.NORMAL,
            walkway,
            user,
            createdAt,
            updatedAt,
        }, TEST_PIN_ID);

        expect(pinOrError.isSuccess).toBeTruthy();
        expect(pinOrError.value.id).toBe(TEST_PIN_ID);
        expect(pinOrError.value.title.value).toBe(pinTitle.value);
        expect(pinOrError.value.content.value).toBe(pinContent.value);
        expect(pinOrError.value.image.value).toBe(pinImage.value);
        expect(pinOrError.value.status).toBe(PinStatus.NORMAL);
        expect(pinOrError.value.createdAt).toBe(createdAt);
        expect(pinOrError.value.updatedAt).toBe(updatedAt);
    });

    it('pin title이 null이나 undefined로 전달될 경우 Pin createNew는 실패해야 한다.', () => {
        const pinOrErrorWithNull = Pin.createNew({
            title: null,
            content: pinContent,
            image: pinImage,
            location: pinLocation,
            status: PinStatus.NORMAL,
            walkway,
            user,
        });

        
        const pinOrErrorWithUndefined = Pin.createNew({
            title: undefined,
            content: pinContent,
            image: pinImage,
            location: pinLocation,
            status: PinStatus.NORMAL,
            walkway,
            user,
        });

        expect(pinOrErrorWithNull.isFailure).toBeTruthy();
        expect(pinOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(pinOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(pinOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

    it('walkway가 null이나 undefined로 전달될 경우 Pin createNew는 실패해야 한다.', () => {
        const pinOrErrorWithNull = Pin.createNew({
            title: pinTitle,
            content: pinContent,
            image: pinImage,
            location: pinLocation,
            status: PinStatus.NORMAL,
            walkway: null,
            user,
        });
        
        const pinOrErrorWithUndefined = Pin.createNew({
            title: pinTitle,
            content: pinContent,
            image: pinImage,
            location: pinLocation,
            status: PinStatus.NORMAL,
            walkway: undefined,
            user,
        });

        expect(pinOrErrorWithNull.isFailure).toBeTruthy();
        expect(pinOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(pinOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(pinOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

    it('user가 null이나 undefined로 전달될 경우 Pin createNew는 실패해야 한다.', () => {
        const pinOrErrorWithNull = Pin.createNew({
            title: pinTitle,
            content: pinContent,
            image: pinImage,
            location: pinLocation,
            status: PinStatus.NORMAL,
            walkway,
            user: null,
        });
        
        const pinOrErrorWithUndefined = Pin.createNew({
            title: pinTitle,
            content: pinContent,
            image: pinImage,
            location: pinLocation,
            status: PinStatus.NORMAL,
            walkway,
            user: undefined,
        });

        expect(pinOrErrorWithNull.isFailure).toBeTruthy();
        expect(pinOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(pinOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(pinOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

    it('pin content가 null이나 undefined로 전달될 경우 Pin createNew는 실패해야 한다.', () => {
        const pinOrErrorWithNull = Pin.createNew({
            title: pinTitle,
            content: null,
            image: pinImage,
            location: pinLocation,
            status: PinStatus.NORMAL,
            walkway,
            user,
        });
        
        const pinOrErrorWithUndefined = Pin.createNew({
            title: pinTitle,
            content: undefined,
            image: pinImage,
            location: pinLocation,
            status: PinStatus.NORMAL,
            walkway,
            user,
        });

        expect(pinOrErrorWithNull.isFailure).toBeTruthy();
        expect(pinOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(pinOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(pinOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

    
    it('status가 전달되지 않은 경우에는 NORMAL로 임의 설정되어야 한다.', () => {
        const pinStatusOrError = Pin.createNew({
            title: pinTitle,
            content: pinContent,
            image: pinImage,
            location: pinLocation,
            walkway,
            user,
        });
        
        expect(pinStatusOrError.isSuccess).toBeTruthy();
        expect(pinStatusOrError.value.status).toBe(PinStatus.NORMAL);
    });

    it('status가 null이나 undefined로 전달되는 경우에는 NORMAL로 임의 설정되어야 한다.', () => {
        const pinStatusOrErrorWithNull = Pin.createNew({
            title: pinTitle,
            content: pinContent,
            image: pinImage,
            location: pinLocation,
            status: null,
            walkway,
            user,
        });

        const pinStatusOrErrorWithUndefined = Pin.createNew({
            title: pinTitle,
            content: pinContent,
            image: pinImage,
            location: pinLocation,
            status: undefined,
            walkway,
            user,
        });

        expect(pinStatusOrErrorWithNull.isSuccess).toBeTruthy();
        expect(pinStatusOrErrorWithUndefined.isSuccess).toBeTruthy();
        expect(pinStatusOrErrorWithNull.value.status).toBe(PinStatus.NORMAL);
        expect(pinStatusOrErrorWithUndefined.value.status).toBe(PinStatus.NORMAL);
    });
})
