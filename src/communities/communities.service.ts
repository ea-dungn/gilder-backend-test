import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Community } from './entities/community.entity';

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
  ) {}

  findAll() {
    return `This action returns all communities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} community`;
  }

  create() {
    this.communityRepository.create();
  }
}
