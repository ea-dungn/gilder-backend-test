import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';

import {
  PROCESS_GILDER_TASK_NAME,
  PROCESS_INFO_TASK_NAME,
  PROCESS_MANAGER_TASK_NAME,
  PROCESS_QUEUE_NAME,
  THRES_IN_MILLISECONDS,
} from './tasks.constants';
import { Tasks } from './tasks.interface';

@Injectable()
export class TaskProducerService {
  constructor(
    @InjectQueue(PROCESS_QUEUE_NAME) private fetchQueue: Queue<Tasks>,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchEvents(
    from: number | null,
    to: number | null,
    thres: number | null,
  ) {
    // get checkpoint from db
    // if no checkpoint: crawl from beginning
    //   - in the case that this app his hard refreshed somehow, spawn multiple tasks to crawl
    // if yes checkpoint: 2 cases that can happen:
    //   - the checkpoint is more than 10 minutes behind -> spawn multiple tasks that cover up to saved timestamp, then another one from the saved timestamp to current
    //   - the checkpoint is not 10 minute behind: spawn task that cover from the saved timestamp to current

    // NOTE: Three modules should have only one latest checkpoint to simplify things
    // TODO: handle if null
    const threshold = thres || THRES_IN_MILLISECONDS;
    const latestCheckpoint = from || Date.now() - threshold;
    const currentTimestamp = to || Date.now();

    let cursor = latestCheckpoint;
    const startEndPairs: number[][] = [];
    while (cursor < currentTimestamp) {
      const lookAhead = cursor + threshold;
      startEndPairs.push([cursor, Math.min(lookAhead, currentTimestamp)]);
      cursor = lookAhead;
    }

    startEndPairs.forEach(([start, end]) => {
      const [startTime, endTime] = [start.toString(), end.toString()];

      this.fetchQueue.addBulk([
        { name: PROCESS_GILDER_TASK_NAME, data: { startTime, endTime } },
        { name: PROCESS_INFO_TASK_NAME, data: { startTime, endTime } },
        { name: PROCESS_MANAGER_TASK_NAME, data: { startTime, endTime } },
      ]);
    });

    // update the current timestamp as latest
  }
}
