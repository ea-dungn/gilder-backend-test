import { Entity, Column, Index, ManyToOne, PrimaryColumn } from 'typeorm';

import { Community } from '../../communities/entities/community.entity';

@Entity()
export class Post {
  @PrimaryColumn()
  @Index({ unique: true })
  address: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  draft: boolean;

  @Column('timestamp')
  created_at: number;

  @Column('timestamp')
  updated_at: number;

  // @ManyToOne(() => User, (user) => user.posts)
  // creator: User;

  // @OneToMany(() => User, (user) => user.voted_post)
  // voters: User[];

  // @OneToMany(() => Comment, (comment) => user.post)
  // comments: Comment[];

  @ManyToOne(() => Community, (community) => community.posts)
  community: Community;
}
