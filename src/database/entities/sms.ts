import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { dateTransform, gsmTransform, toLowerTransform, trimTransform } from "../../utilities/transformer";

@Entity({ synchronize: false })
export class SMS extends BaseEntity {

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

    @Column({ transformer: dateTransform })
    sendDate: Date

    @Column({ type: 'text', nullable: true })
    reply: string

    @Column({ default: 0 })
    attempts: number

    @Column({ nullable: true })
    posId: number


}