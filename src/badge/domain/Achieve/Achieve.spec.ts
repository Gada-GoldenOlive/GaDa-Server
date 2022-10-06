import { AchieveStatus } from './AchieveStatus';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { User } from '../../../user/domain/User/User';
import { UserLoginId } from '../../../user/domain/User/UserLoginId';
import { UserName } from '../../../user/domain/User/UserName';
import { UserPassword } from '../../../user/domain/User/UserPassword';
import { UserStatus } from '../../../user/domain/User/UserStatus';
import { UserTotalDistance } from '../../../user/domain/User/UserTotalDistance';
import { UserTotalTime } from '../../../user/domain/User/UserTotalTime';
import { BadgeTitle } from '../Badge/BadgeTitle';
import { Badge } from '../Badge/Badge';
import { BadgeCategory } from '../Badge/BadgeCategory';
import { BadgeCode } from '../Badge/BadgeCode';
import { Achieve, PROPS_VALUES_ARE_REQUIRED } from './Achieve';

describe('Achieve', () => {
	const TEST_ACHIEVE_ID = 'test-achieve-uuid';
	const achieveStatus = AchieveStatus.HIDDEN;
	const createdAt = new Date();
    const updatedAt = new Date();
    const TEST_USER_ID = 'test-user-uuid';
    const userName = UserName.create('유저이름').value;
    const userImage = ImageUrl.create('user-image-test.png').value;
    const userLoginId = UserLoginId.create('user-id').value;
    const userPassword = UserPassword.create('user-password').value;
    const userTotalDistance = UserTotalDistance.create(20).value;
    const userTotalTime = UserTotalTime.create(1123).value;
    const user = User.create({
        name: userName,
        image: userImage,
        totalDistance: userTotalDistance,
        totalTime: userTotalTime,
        status: UserStatus.NORMAL,
        loginId: userLoginId,
        password: userPassword,
        createdAt,
        updatedAt,
    }, TEST_USER_ID).value;
    const TEST_BADGE_ID = 'test-badge-uuid';
	const badgeTitle = BadgeTitle.create('배지제목').value;
	const badgeImage = ImageUrl.create('badge-image-test.png').value;
	const badge = Badge.create({
		title: badgeTitle,
		image: badgeImage,
		category: BadgeCategory.USER,
		code: BadgeCode.FIRST,
		createdAt,
		updatedAt,
	}, TEST_BADGE_ID).value;

	it('Achieve createNew 성공', () => {
		const achieveOrError = Achieve.createNew({
			status: achieveStatus,
			user,
			badge,
		});

		expect(achieveOrError.isSuccess).toBeTruthy();
		expect(achieveOrError.value.id).toBeDefined();
		expect(achieveOrError.value.status).toBe(AchieveStatus.HIDDEN);
		expect(achieveOrError.value.badge).toBe(badge);
		expect(achieveOrError.value.user).toBe(user);
	});

	it('Achieve create 성공', () => {
		const achieveOrError = Achieve.create({
			status: achieveStatus,
			user,
			badge,
			createdAt,
			updatedAt,
		}, TEST_ACHIEVE_ID);

		expect(achieveOrError.isSuccess).toBeTruthy();
		expect(achieveOrError.value.id).toBe(TEST_ACHIEVE_ID);
		expect(achieveOrError.value.status).toBe(AchieveStatus.HIDDEN);
		expect(achieveOrError.value.badge).toBe(badge);
		expect(achieveOrError.value.user).toBe(user);
		expect(achieveOrError.value.createdAt).toBe(createdAt);
		expect(achieveOrError.value.updatedAt).toBe(updatedAt);
	});

	it('user가 null이나 undefined로 전달된다면 Achieve createNew는 실패해야 한다.', () => {
        const achieveOrErrorWithNull = Achieve.createNew({
			status: achieveStatus,
			user: null,
			badge,
        });
        
        const achieveOrErrorWithUndefined = Achieve.createNew({
			status: achieveStatus,
			user: undefined,
			badge,
        });

        expect(achieveOrErrorWithNull.isFailure).toBeTruthy();
        expect(achieveOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(achieveOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(achieveOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

	it('badge가 null이나 undefined로 전달된다면 Achieve createNew는 실패해야 한다.', () => {
        const achieveOrErrorWithNull = Achieve.createNew({
			status: achieveStatus,
			user,
			badge: null,
        });
        
        const achieveOrErrorWithUndefined = Achieve.createNew({
			status: achieveStatus,
			user,
			badge: undefined,
        });

        expect(achieveOrErrorWithNull.isFailure).toBeTruthy();
        expect(achieveOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(achieveOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(achieveOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

	it('status가 전달되지 않았다면 NON_ACHIEVE로 임의 설정되어야 한다.', () => {
        const achieveStatusOrError = Achieve.createNew({
			user,
			badge,
        });
        
        expect(achieveStatusOrError.isSuccess).toBeTruthy();
        expect(achieveStatusOrError.value.status).toBe(AchieveStatus.NON_ACHIEVE);
    });

    it('status가 null이나 undefined로 전달되는 경우에는 NON_ACHIEVE로 임의 설정되어야 한다.', () => {
        const achieveOrErrorWithNull = Achieve.createNew({
			status: null,
			user,
			badge,
        });

        const achieveOrErrorWithUndefined = Achieve.createNew({
			status: undefined,
			user,
			badge,
        });

        expect(achieveOrErrorWithNull.isSuccess).toBeTruthy();
        expect(achieveOrErrorWithUndefined.isSuccess).toBeTruthy();
        expect(achieveOrErrorWithNull.value.status).toBe(AchieveStatus.NON_ACHIEVE);
        expect(achieveOrErrorWithUndefined.value.status).toBe(AchieveStatus.NON_ACHIEVE);
    });
});
