import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly client = new SuiClient({ url: getFullnodeUrl('testnet') });

  constructor(private configService: ConfigService) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async fetchEvents() {
    const packageId = this.configService.get<string>('PACKAGE_ID', 'unknown');
    this.logger.log('===> Fetching events from ' + packageId);

    const gilderEvents = await this.client.queryEvents({
      query: { MoveModule: { package: packageId, module: 'gilder' } },
      cursor: null,
      limit: null,
    });
    this.logger.log(gilderEvents);

    const userManagerEvents = await this.client.queryEvents({
      query: {
        MoveModule: { package: packageId, module: 'user_manager' },
      },
      cursor: null,
      limit: null,
    });
    this.logger.log(userManagerEvents);

    const userInfoEvents = await this.client.queryEvents({
      query: { MoveModule: { package: packageId, module: 'user_info' } },
      cursor: null,
      limit: null,
    });
    this.logger.log(userInfoEvents);
  }
}
