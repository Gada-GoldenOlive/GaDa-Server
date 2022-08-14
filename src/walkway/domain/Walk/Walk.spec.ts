import { ImageUrl } from "../../../common/domain/Image/ImageUrl";
import { User } from "../../../user/domain/User";
import { UserName } from "../../../user/domain/UserName";
import { UserStatus } from "../../../user/domain/UserStatus";
import { UserTotalDistance } from "../../../user/domain/UserTotalDistance";
import { UserTotalTime } from "../../../user/domain/UserTotalTime";
import { Walkway } from "../Walkway/Walkway";
import { WalkwayAddress } from "../Walkway/WalkwayAddress";
import { WalkwayDistance } from "../Walkway/WalkwayDistance";
import { WalkwayPath } from "../Walkway/WalkwayPath";
import { WalkwayStartPoint } from "../Walkway/WalkwayStartPoint";
import { WalkwayStatus } from "../Walkway/WalkwayStatus";
import { WalkwayTime } from "../Walkway/WalkwayTime";
import { WalkwayTitle } from "../Walkway/WalkwayTitle";
import { Walk } from "./Walk";
import { WalkDistance } from "./WalkDistance";
import { WalkFinishStatus } from "./WalkFinishStatus";
import { WalkTime } from "./WalkTime";

describe ('Walk', () => {
    const TEST_WALK_ID = 'test-walk-uuid';
    const walkTime = WalkTime.create(30).value;
    const walkDistance = WalkDistance.create(300).value;
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

    it('Walk createNew 성공', () => {
        const walkOrError = Walk.createNew({
            time: walkTime,
            distance: walkDistance,
            finishStatus: WalkFinishStatus.FINISHED,
            walkway,
            user,
        });

        expect(walkOrError.isSuccess).toBeTruthy();
        expect(walkOrError.value.id).toBeDefined();
        expect(walkOrError.value.time.value).toBe(walkTime.value);
        expect(walkOrError.value.distance.value).toBe(walkDistance.value);
        expect(walkOrError.value.finishStatus).toBe(WalkFinishStatus.FINISHED);
    })

    it('Walk create 성공', () => {
        const walkOrError = Walk.create({
            time: walkTime,
            distance: walkDistance,
            finishStatus: WalkFinishStatus.FINISHED,
            createdAt,
            updatedAt,
            walkway,
            user,
        }, TEST_WALK_ID);

        expect(walkOrError.isSuccess).toBeTruthy();
        expect(walkOrError.value.id).toBe(TEST_WALK_ID);
        expect(walkOrError.value.time.value).toBe(walkTime.value);
        expect(walkOrError.value.distance.value).toBe(walkDistance.value);
        expect(walkOrError.value.finishStatus).toBe(WalkFinishStatus.FINISHED);
        expect(walkOrError.value.createdAt).toBe(createdAt);
        expect(walkOrError.value.updatedAt).toBe(updatedAt);
    })
})
