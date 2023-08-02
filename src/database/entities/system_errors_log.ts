import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { dateTransform } from "../../utilities/transformer";


@Entity({ synchronize: false })
export class SystemErrorsLog extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn({ transformer: dateTransform })
    errorDate: Date

    @Column({ length: 16, default: '500' })
    errorCode: string

    @Column({ length: 24, default: 'N/A' })
    method: string

    @Column({ type: 'text' })
    url: string

    @Column({ type: 'text' })
    error: string

    @Column({ type: 'text', nullable: true })
    data: string

    @Column({ nullable: true })
    userId: number

    @Column({ length: 32, default: 'N/A' })
    ip: string

    @Column({ type: 'json', nullable: true, default: null })
    userAgent: any


}
