import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { mobileTransform, toLowerTransform, trimTransform } from "../../utilities/transformer"
import { Nas } from "./nas"
import { Policies } from "./policies"
import { Pos } from "./pos"
import { Radcheck } from "./radcheck"
import { getDataSource } from "../../data.source"

@Entity({ synchronize: false })
export class Subscribers extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text', unique: true, transformer: toLowerTransform })
    username: string


    @Column({ length: 255, nullable: false, transformer: [trimTransform] })
    password?: string

    @Column({ type: 'text', transformer: trimTransform })
    groupname: string

    @Column({ nullable: true })
    expiration: Date

    @Column({ default: false })
    renewable: boolean

    @Column({ default: 0 })
    priority: number

    @Column({ length: 128, nullable: true, default: 'N/A', transformer: trimTransform })
    name: string

    @Column({ length: 16, nullable: true, transformer: [trimTransform, mobileTransform] })
    mobile: string

    @Column({ length: 16, nullable: true, transformer: trimTransform, comment: 'in case pos is hotel' })
    room: string

    @Column({ length: 128, default: 'Syrian', transformer: trimTransform })
    nationality: string

    @Column({ length: 128, nullable: true, transformer: trimTransform })
    idCard: string

    @Column()
    nasname: string

    @Column()
    posId: number


    @Column({ nullable: true })
    createdByUser: string

    @ManyToOne(() => Nas, nas => nas.nasname, { eager: true })
    @JoinColumn({ name: "nasname", referencedColumnName: 'nasname' })
    nas: Nas

    @ManyToOne(() => Policies, policy => policy.name, { eager: true })
    @JoinColumn({ name: "groupname", referencedColumnName: 'name' })
    policy: Policies

    @ManyToOne(() => Pos, pos => pos.id, { eager: true })
    @JoinColumn({ name: "posId" })
    pos: Pos




    //reply: Radreply[]
    check: Radcheck[]

    static async generateCredential(prefix: string) {
        const no = await getDataSource('admin').query(`SELECT nextval('subscriber_seq')`)
        const seq = no[0].nextval

        const credential = {
            username: `${prefix}${seq}${Math.floor(Math.random() * 90) + 10}`.toLowerCase(),
            password: `${Math.floor(100000 + Math.random() * 900000)}`
        }

        return credential
    }

}