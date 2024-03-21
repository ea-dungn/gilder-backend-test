import { Test, TestingModule } from '@nestjs/testing';

import { CommunitiesService } from './communities.service';

describe.skip('CommunitiesService', () => {
  let service: CommunitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunitiesService],
    }).compile();

    service = module.get<CommunitiesService>(CommunitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
