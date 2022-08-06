import { PROPS_VALUES_ARE_REQUIRED } from '../../../common/domain/Image/Image';
import { Walkway } from './Walkway';
import { WalkwayAddress } from './WalkwayAddress';
import { WalkwayCreator, } from './WalkwayCreator';
import { WalkwayDistance } from './WalkwayDistance';
import { WalkwayPath } from './WalkwayPath';
import { WalkwayTime } from './WalkwayTime';
import { WalkwayTitle } from './WalkwayTitle';

describe('Walkway', () => {
    const TEST_WALKWAY_ID = 'test-walkway-uuid';
    const walkwayTitle = WalkwayTitle.create('서지니 집 가는 길').value;
    const walkwayAddress = WalkwayAddress.create('서울특별시 성동구 왕십리로 222').value;
    const walkwayDistance = WalkwayDistance.create(300).value;
    const walkwayTime = WalkwayTime.create(30).value;
    const walkwayPath = WalkwayPath.create({
        'type': 'LineString',
        'coordinates': [[100, 40], [105, 45], [110, 55]],
    }).value;
    const walkwayCreator = WalkwayCreator.create('서지니').value;
    const createdAt = new Date();
    const updatedAt = new Date();

    it('Walkway createNew 성공', () => {
        const walkwayOrError = Walkway.createNew({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            creator: walkwayCreator,
        });

        expect(walkwayOrError.isSuccess).toBeTruthy();
        expect(walkwayOrError.value.id).toBeDefined();
        expect(walkwayOrError.value.title.value).toBe(walkwayTitle.value);
        expect(walkwayOrError.value.address.value).toBe(walkwayAddress.value);
        expect(walkwayOrError.value.distance.value).toBe(walkwayDistance.value);
        expect(walkwayOrError.value.time.value).toBe(walkwayTime.value);
        expect(walkwayOrError.value.path.value).toBe(walkwayPath.value);
        expect(walkwayOrError.value.creator.value).toBe(walkwayCreator.value);
    })

    it('Walkway create 성공', () => {
        const walkwayOrError = Walkway.create({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            creator: walkwayCreator,
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
        expect(walkwayOrError.value.creator.value).toBe(walkwayCreator.value);
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
            creator: walkwayCreator,
        });

        const walkwayOrErrorWithUndefined = Walkway.createNew({
            title: undefined,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            creator: walkwayCreator,
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
            creator: walkwayCreator,
        });

        const walkwayOrErrorWithUndefined = Walkway.createNew({
            title: walkwayTitle,
            address: undefined,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            creator: walkwayCreator,
        });

        expect(walkwayOrErrorWithNull.isFailure).toBeTruthy();
        expect(walkwayOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(walkwayOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(walkwayOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    })

    it('creator가 null이나 undefined로 전달될 경우 Walkway createNew는 실패해야 한다.', () => {
        const walkwayOrErrorWithNull = Walkway.createNew({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            creator: null,
        });

        const walkwayOrErrorWithUndefined = Walkway.createNew({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: walkwayPath,
            creator: undefined,
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
            creator: walkwayCreator,
        });

        const walkwayOrErrorWithUndefined = Walkway.createNew({
            title: walkwayTitle,
            address: walkwayAddress,
            distance: walkwayDistance,
            time: walkwayTime,
            path: undefined,
            creator: walkwayCreator,
        });

        expect(walkwayOrErrorWithNull.isFailure).toBeTruthy();
        expect(walkwayOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(walkwayOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(walkwayOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    })
})