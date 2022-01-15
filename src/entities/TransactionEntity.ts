/* eslint-disable indent */
import {
    Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn,
} from 'typeorm';
import UserEntity from './UserEntity';

@Entity('transactions')
export default class TransactionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    value: number;

    @Column()
    type: string;

    @Column()
    date: Date;

    @OneToOne(() => UserEntity, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}
