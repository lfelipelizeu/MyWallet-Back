/* eslint-disable indent */
import {
    Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn,
} from 'typeorm';
import UserEntity from './UserEntity';

@Entity('sessions')
export default class SessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @OneToOne(() => UserEntity, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}
