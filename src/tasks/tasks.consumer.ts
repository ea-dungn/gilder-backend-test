import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';

import { PROCESS_TASK_NAME, PROCESS_QUEUE_NAME } from './tasks.constants';
import { Tasks } from './tasks.interface';
import { TaskProducerService } from './tasks.producer';

@Processor(PROCESS_QUEUE_NAME)
export class TaskConsumerService {
  private readonly logger = new Logger(TaskProducerService.name);
  private readonly client = new SuiClient({ url: getFullnodeUrl('testnet') });

  constructor(private configService: ConfigService) {}

  @Process(PROCESS_TASK_NAME)
  async fetchAndProcess(job: Job<Tasks>) {
    const packageId = this.configService.get<string>('PACKAGE_ID', 'unknown');

    this.logger.log('===> Fetching events from ' + packageId);

    const { module, startTs, endTs } = job.data;

    this.logger.log(startTs, endTs);

    // probably loop through until reached endTs
    const events = await this.client.queryEvents({
      query: { MoveModule: { package: packageId, module } },
      cursor: null,
      limit: null,
    });

    this.logger.log(events);

    return {};
  }
}
