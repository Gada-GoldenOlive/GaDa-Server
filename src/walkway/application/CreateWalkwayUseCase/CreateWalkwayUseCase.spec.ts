import { mock, MockProxy } from 'jest-mock-extended';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { User } from '../../../user/domain/User/User';
import { UserLoginId } from '../../../user/domain/User/UserLoginId';
import { UserName } from '../../../user/domain/User/UserName';
import { UserPassword } from '../../../user/domain/User/UserPassword';
import { UserTotalDistance } from '../../../user/domain/User/UserTotalDistance';
import { UserTotalTime } from '../../../user/domain/User/UserTotalTime';

import { IWalkwayRepository } from '../../infra/IWalkwayRepository';
import { CreateWalkwayUseCase, CreateWalkwayUseCaseCodes } from './CreateWalkwayUseCase';

describe('CreateSeoulmapWalkwaysUseCase', () => {
    let uut: CreateWalkwayUseCase;
    let walkwayRepository: MockProxy<IWalkwayRepository>;

    const testWalkwayTitle = '용답 산책로';
    const testWalkwayAddress = '성동구 용답동';
    const testWalkwayDistance = 5;
    const testWalkwayTime = 60;
    const testWalkwayPath = [
        { lat: 30, lng: 30 },
        { lat: 40, lng: 30 },
    ];
    const createdAt = new Date();
    const updatedAt = new Date();
    const testUser = User.create({
        name: UserName.create('user name').value,
        image: ImageUrl.create('user-image-test.jpg').value,
        totalDistance: UserTotalDistance.create(30).value,
        totalTime: UserTotalTime.create(300).value,
        loginId: UserLoginId.create('user-id').value,
        password: UserPassword.create('user-password').value,
        createdAt,
        updatedAt,
    }, 'test-user-uuid').value;

    beforeAll(() => {
        walkwayRepository = mock<IWalkwayRepository>();
        uut = new CreateWalkwayUseCase(walkwayRepository);
    });

    it('create 성공', async () => {
        givenSaveSuccess();

        const createWalkwayResponse = await uut.execute({
            title: testWalkwayTitle,
            address: testWalkwayAddress,
            distance: testWalkwayDistance,
            time: testWalkwayTime,
            path: testWalkwayPath,
            user: testUser,
        });

        expect(createWalkwayResponse.code).toBe(CreateWalkwayUseCaseCodes.SUCCESS);
    })

    it('create 실패', async () => {
        givenSaveFailure();

        const createWalkwayResponse = await uut.execute({
            title: testWalkwayTitle,
            address: testWalkwayAddress,
            distance: testWalkwayDistance,
            time: testWalkwayTime,
            path: testWalkwayPath,
            user: testUser,
        });

        expect(createWalkwayResponse.code).toBe(CreateWalkwayUseCaseCodes.FAILURE);
    })

    function givenSaveSuccess() {
        walkwayRepository.save.mockResolvedValueOnce(true);
    }

    function givenSaveFailure() {
        walkwayRepository.save.mockRejectedValue(new Error('Unhandled error'))
    }
})
