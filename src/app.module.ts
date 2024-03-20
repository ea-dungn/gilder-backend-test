import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommunitiesModule } from './communities/communities.module';
import { PostsModule } from './posts/posts.module';
import { TasksService } from './tasks/tasks.service';
import { ConfigModule } from '@nestjs/config';

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
    ScheduleModule.forRoot(),
    CommunitiesModule,
    PostsModule,
  ],
  controllers: [],
  providers: [TasksService],
})
export class AppModule {}
