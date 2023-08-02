import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { SMSQueue } from "./sms.queue";
import { dateTransform, toLowerTransform, trimTransform } from "../../utilities/transformer";

@Entity({synchronize:false})
export class SMSArchived extends SMSQueue {

   @PrimaryColumn()
    id: number

    @Column({ type: 'text', transformer: toLowerTransform })
    username: string

    @Column({ length: 16, transformer: trimTransform })
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

    @Column({ transformer: dateTransform })
    createdAt: Date

    @Column({ nullable: true, transformer: dateTransform })
    lastAttemptDate: Date

    @Column({ type: 'text', nullable: true })
    reply: string

    @Column({ default: 0 })
    attempts: number

}