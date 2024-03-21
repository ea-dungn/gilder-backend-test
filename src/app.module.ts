import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommunitiesModule } from './communities/communities.module';
import { PostsModule } from './posts/posts.module';
import { PROCESS_QUEUE_NAME } from './tasks/tasks.constants';
import { TaskConsumerService } from './tasks/tasks.consumer';
import { TaskProducerService } from './tasks/tasks.producer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'typeorm_test',
      autoLoadEntities: true,
      synchronize: true,
    }),

    BullModule.forRoot({
      redis: { host: 'localhost', port: 6379 },
      defaultJobOptions: { attempts: 5, backoff: { type: 'exponential' } },
    }),
    BullModule.registerQueue({ name: PROCESS_QUEUE_NAME }),
    ScheduleModule.forRoot(),

    // REST API modules
    CommunitiesModule,
    PostsModule,
  ],
  controllers: [],
  providers: [TaskProducerService, TaskConsumerService],
})
export class AppModule {}
