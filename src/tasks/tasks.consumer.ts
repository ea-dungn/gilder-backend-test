import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';

import {
  PROCESS_GILDER_TASK_NAME,
  PROCESS_INFO_TASK_NAME,
  PROCESS_MANAGER_TASK_NAME,
  PROCESS_QUEUE_NAME,
} from './tasks.constants';
import { Tasks } from './tasks.interface';
import { TaskProducerService } from './tasks.producer';

@Processor(PROCESS_QUEUE_NAME)
export class TaskConsumerService {
  private readonly logger = new Logger(TaskProducerService.name);
  private readonly client = new SuiClient({ url: getFullnodeUrl('testnet') });
  private readonly packageId = this.configService.get<string>(
    'PACKAGE_ID',
    'unknown',
  );

  constructor(private configService: ConfigService) {}

  @Process(PROCESS_GILDER_TASK_NAME)
  async fetchAndSaveGilderEvents(job: Job<Tasks>) {
    this.logger.log('===> Fetching events from ' + this.packageId + '::gilder');

    const { startTime, endTime } = job.data;
    let cursor = null;

    do {
      const events = await this.client.queryEvents({
        query: {
          And: [
            { MoveModule: { package: this.packageId, module: 'gilder' } },
            { TimeRange: { startTime, endTime } },
          ],
        },
        cursor,
      });

      // Save this to db
      this.logger.log(events.data);
      cursor = events.nextCursor;
    } while (!cursor);

    // TODO: What to return?
    return {};
  }

  @Process(PROCESS_INFO_TASK_NAME)
  async fetchAndSaveUserInfoEvents(job: Job<Tasks>) {
    this.logger.log(
      '===> Fetching events from ' + this.packageId + '::user_info',
    );

    const { startTime, endTime } = job.data;
    let cursor = null;

    do {
      const events = await this.client.queryEvents({
        query: {
          And: [
            { MoveModule: { package: this.packageId, module: 'user_info' } },
            { TimeRange: { startTime, endTime } },
          ],
        },
        cursor,
      });

      this.logger.log(events.data);
      cursor = events.nextCursor;
    } while (!cursor);

    return {};
  }

  @Process(PROCESS_MANAGER_TASK_NAME)
  async fetchAndSaveUserManagerEvents(job: Job<Tasks>) {
    this.logger.log(
      '===> Fetching events from ' + this.packageId + '::user_manager',
    );

    const { startTime, endTime } = job.data;
    let cursor = null;

    do {
      const events = await this.client.queryEvents({
        query: {
          And: [
            { MoveModule: { package: this.packageId, module: 'user_manager' } },
            { TimeRange: { startTime, endTime } },
          ],
        },
        cursor,
      });

      this.logger.log(events.data);
      cursor = events.nextCursor;
    } while (!cursor);

    return {};
  }
}
