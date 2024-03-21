import { TaskProducerService } from './tasks.producer';

describe('TasksProducer', () => {
  // TODO: How to refactor to use this instead
  // beforeEach(async () => {
  //   const moduleRef = await Test.createTestingModule({
  //     providers: [TaskProducerService],
  //     imports: [],
  //   }).compile();
  //   tasksProducer = await moduleRef.resolve(TaskProducerService);
  // });

  let service: TaskProducerService;
  let mockQueue: any;

  beforeEach(() => {
    mockQueue = { addBulk: jest.fn() };
    service = new TaskProducerService(mockQueue);
  });

  it('should send one bulk if thres is not surpassed', async () => {
    const [from, to, thres] = [1000, 1200, 500];
    await service.fetchEvents(from, to, thres);

    expect(mockQueue.addBulk).toHaveBeenCalledTimes(1);
  });

  it('should send multiple bulk if thres is surpassed', async () => {
    const [from, to, thres] = [1000, 1180, 50];
    await service.fetchEvents(from, to, thres);

    expect(mockQueue.addBulk).toHaveBeenCalledTimes(4);
  });
});
