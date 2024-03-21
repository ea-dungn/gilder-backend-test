import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';

import { PROCESS_TASK_NAME, PROCESS_QUEUE_NAME } from './tasks.constants';
import { Tasks } from './tasks.interface';

@Injectable()
export class TaskProducerService {
  constructor(
    @InjectQueue(PROCESS_QUEUE_NAME) private fetchQueue: Queue<Tasks>,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async fetchEvents() {
    // get checkpoint from db

    const name = PROCESS_TASK_NAME;

    this.fetchQueue.addBulk([
      {
        name,
        data: {
          module: 'gilder',
          startTs: 0,
          endTs: 1,
        },
      },
      {
        name,
        data: {
          module: 'user_manager',
          startTs: 0,
          endTs: 1,
        },
      },
      {
        name,
        data: {
          module: 'user_info',
          startTs: 0,
          endTs: 1,
        },
      },
    ]);
  }
}
