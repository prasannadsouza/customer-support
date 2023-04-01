import { User } from 'src/users/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm'

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  subject: string

  @Column()
  description: string

  @ManyToOne(type => User, user => user.id)
  @JoinColumn()
  assignedTo?: User

  @Column({ nullable: true })
  assignedToId: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Index()
  @Column()
  resolved: boolean

  @Column()
  resolution: string

  @Column()
  createdByEmail: string
}
