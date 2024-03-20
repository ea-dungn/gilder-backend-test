import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }
}
