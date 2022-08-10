import { mock, MockProxy } from 'jest-mock-extended';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { User } from '../../../user/domain/User';
import { UserName } from '../../../user/domain/UserName';
import { UserTotalDistance } from '../../../user/domain/UserTotalDistance';
import { UserTotalTime } from '../../../user/domain/UserTotalTime';
import { Walkway } from '../../../walkway/domain/Walkway/Walkway';
import { WalkwayAddress } from '../../../walkway/domain/Walkway/WalkwayAddress';
import { WalkwayDistance } from '../../../walkway/domain/Walkway/WalkwayDistance';
import { WalkwayPath } from '../../../walkway/domain/Walkway/WalkwayPath';
import { WalkwayTime } from '../../../walkway/domain/Walkway/WalkwayTime';
import { WalkwayTitle } from '../../../walkway/domain/Walkway/WalkwayTitle';
import { Pin } from '../../domain/Pin';
import { PinContent } from '../../domain/PinContent';
import { PinStatus } from '../../domain/PinStatus';
import { PinTitle } from '../../domain/PinTitle';
import { IPinRepository } from '../../infra/IPinRepository';

import { GetAllPinUseCase, GetAllPinUseCaseCodes } from './GetAllPinUseCase';

describe('GetAllPinUseCase', () => {
    const TEST_PIN_ID = 'test-pin-uuid';
    const testPinTitleString = '여기는 계단이에요!';
    const testPinContentString = '계단이 좀 가파르네요 이제 나이먹어서 그런지 계단 오를 때마다 무릎이 시려';
    const createdAt = new Date();
    const updatedAt = new Date();
    const testWalkway = Walkway.create({
        title: WalkwayTitle.create("get walkway title").value,
        address: WalkwayAddress.create('get walkway address').value,
        distance: WalkwayDistance.create(40).value,
        time: WalkwayTime.create(1234).value,
        path: WalkwayPath.create({
            'type': 'LineString',
            'coordinates': [[100, 40], [105, 45], [110, 55]],
        }).value,
        createdAt,
        updatedAt,
    }, 'teste-walkway-uuid').value;
    const testUser = User.create({
        name: UserName.create('user name').value,
        image: ImageUrl.create('user-image-test.jpg').value,
        totalDistance: UserTotalDistance.create(30).value,
        totalTime: UserTotalTime.create(300).value,
        createdAt,
        updatedAt,
    }, 'test-user-uuid').value;

    let uut: GetAllPinUseCase;
    let pinRepository: MockProxy<IPinRepository>;

    beforeAll(() => {
        pinRepository = mock<IPinRepository>();
        uut = new GetAllPinUseCase(pinRepository);
    });

    it('walkway, user를 모두 보냈을 때 execute 성공', async () => {
        givenGetAllSuccess();

        const getAllPinUSeCaseResponse = await uut.execute({
            walkway: testWalkway,
            user: testUser,
        });

        expect(getAllPinUSeCaseResponse.code).toBe(GetAllPinUseCaseCodes.SUCCESS);
        expect(getAllPinUSeCaseResponse.pins).toHaveLength(1);
        expect(getAllPinUSeCaseResponse.pins[0].id).toBe(TEST_PIN_ID);
        expect(getAllPinUSeCaseResponse.pins[0].title.value).toBe(testPinTitleString);
        expect(getAllPinUSeCaseResponse.pins[0].content.value).toBe(testPinContentString);
        expect(getAllPinUSeCaseResponse.pins[0].walkway).toBe(testWalkway);
        expect(getAllPinUSeCaseResponse.pins[0].user).toBe(testUser);
    });

    it('walkway만 보냈을 때 execute 성공', async () => {
        givenGetAllSuccess();

        const getAllPinUSeCaseResponse = await uut.execute({
            walkway: testWalkway,
        });

        expect(getAllPinUSeCaseResponse.code).toBe(GetAllPinUseCaseCodes.SUCCESS);
        expect(getAllPinUSeCaseResponse.pins).toHaveLength(1);
        expect(getAllPinUSeCaseResponse.pins[0].id).toBe(TEST_PIN_ID);
        expect(getAllPinUSeCaseResponse.pins[0].title.value).toBe(testPinTitleString);
        expect(getAllPinUSeCaseResponse.pins[0].content.value).toBe(testPinContentString);
        expect(getAllPinUSeCaseResponse.pins[0].walkway).toBe(testWalkway);
        expect(getAllPinUSeCaseResponse.pins[0].user).toBe(testUser);
    });

    /**
    it('user만 보냈을 때 execute 성공', async () => {
        givenGetAllSuccess();

        const getAllPinUSeCaseResponse = await uut.execute({
            user: testUser,
        });

        expect(getAllPinUSeCaseResponse.code).toBe(GetAllPinUseCaseCodes.SUCCESS);
        expect(getAllPinUSeCaseResponse.pins).toHaveLength(1);
        expect(getAllPinUSeCaseResponse.pins[0].id).toBe(TEST_PIN_ID);
        expect(getAllPinUSeCaseResponse.pins[0].title.value).toBe(testPinTitleString);
        expect(getAllPinUSeCaseResponse.pins[0].content.value).toBe(testPinContentString);
        expect(getAllPinUSeCaseResponse.pins[0].walkway).toBe(testWalkway);
        expect(getAllPinUSeCaseResponse.pins[0].user).toBe(testUser);
    });
    */

    it('execute 실패', async () => {
        givenGetAllFailure();

        const getAllPinUSeCaseResponse = await uut.execute({
            walkway: testWalkway,
            user: testUser,
        });

        expect(getAllPinUSeCaseResponse.code).toBe(GetAllPinUseCaseCodes.FAILURE);
        expect(getAllPinUSeCaseResponse.pins).toBeUndefined();
    })

    function givenGetAllSuccess() {
        pinRepository.findAll.mockResolvedValue([
            Pin.create(
                {
                    title: PinTitle.create(testPinTitleString).value,
                    content: PinContent.create(testPinContentString).value,
                    status: PinStatus.NORMAL,
                    walkway: testWalkway,
                    user: testUser,
                    createdAt,
                    updatedAt,
                },
                TEST_PIN_ID,
            ).value,
        ]);
    }

    function givenGetAllFailure() {
        pinRepository.findAll.mockRejectedValue(new Error('Unhandled Error'));
    }
})
