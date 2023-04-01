import { Ticket } from 'src/tickets/ticket.entity'
import {
  Entity,
  Column,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  email: string

  @Column({ nullable: false })
  password: string

  @Column({ nullable: false })
  role: string

  @UpdateDateColumn()
  updatedAt: Date
}
