import { Entity, Column, Index, OneToMany, PrimaryColumn } from 'typeorm';

import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Community {
  @PrimaryColumn()
  @Index({ unique: true })
  address: string;

  // HACK: Onchain, it does not validate url, so we can't either
  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  cover_image: string;

  @Column()
  visible: boolean;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  rules: string;

  @Column()
  links: string;

  @Column()
  resources: string;

  @Column('timestamp')
  created_at: number;

  @Column('timestamp')
  updated_at: number;

  // @OneToMany(() => User, (user) => user.community)
  // members: User[];

  // @OneToMany(() => User, (user) => user.community)
  // followers: User[];

  @OneToMany(() => Post, (post) => post.community)
  posts: Post[];
}
