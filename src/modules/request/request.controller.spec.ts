import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectionKeys } from '../../common/config/config';
import { RequestDto } from './dto/request.dto';
import { RequestStatus } from './entities/request.entity';

describe('RequestController', () => {
  let requestTestModule: TestingModule;
  const mockRequest: RequestDto = {
    id: 2,
    name: 'Test mock request',
    status: RequestStatus.New,
  };

  const mockRequestService = {
    create: jest.fn().mockResolvedValue(mockRequest),
  };

  const mockClientProxy = {
    emit: jest.fn(),
  };

  const cache = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    requestTestModule = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [
        {
          provide: RequestService,
          useValue: mockRequestService,
        },
        {
          provide: InjectionKeys.ClientProxyRequest,
          useValue: mockClientProxy,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cache,
        },
      ],
    }).compile();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new request', async () => {
    const controller = await requestTestModule.get(RequestController);
    const result = await controller.createRequest(mockRequest as any);
    expect(result.id).not.toBe(undefined);
  });
});
