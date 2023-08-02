import { BaseEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Pos } from "./pos";
import { dateTransform, gsmTransform, integerTransform, toLowerTransform, trimTransform } from "../../utilities/transformer";

@Entity({synchronize:false})
export class SMSQueue extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text', transformer: toLowerTransform })
    username: string

    @Column({ length: 16, transformer: gsmTransform })
    gsm: string

    @Column({ length: 8 })
    code: string

    @Column({ type: 'text', nullable: true, transformer: trimTransform })
    ipAddress: string

    @Column({ length: 64 })
    mac: string

    @Column({ type: 'text', transformer: trimTransform })
    nasname: string

    @Column({ nullable: true })
    posId: number

    @CreateDateColumn({ transformer: dateTransform })
    createdAt: Date

    @Column({ nullable: true, transformer: dateTransform })
    lastAttemptDate: Date

    @Column({ type: 'text', nullable: true })
    reply: string

    @Column({ default: 0, transformer: integerTransform })
    attempts: number


    @ManyToOne(() => Pos, pos => pos.id, { eager: true })
    @JoinColumn({ name: "posId" })
    pos: Pos


}