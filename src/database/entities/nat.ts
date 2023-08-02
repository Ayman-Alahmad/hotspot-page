import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { trimTransform } from "../../utilities/transformer"
import { Nas } from "./nas"
import { Policies } from "./policies"
import { Pos } from "./pos"


@Entity({ synchronize: false })
export class Nat extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'inet', transformer: trimTransform })
    publicIp: string

    @Column({ type: 'inet', unique: true, transformer: trimTransform })
    privateIp: string

    @Column()
    startPorts: number

    @Column()
    endPorts: number

    @Column()
    poolId: number

    @Column()
    nasId: number

    // no validation required
    // manual entry
    @Column()
    posId: number

    @Column({ type: 'text', nullable: true, transformer: trimTransform })
    groupname: string

    //----------------------



    @JoinColumn({ name: "nasId" })
    nas: Nas

    @ManyToOne(() => Policies, policy => policy.name)
    @JoinColumn({ name: "groupname", referencedColumnName: 'name' })
    policy: Policies


    @ManyToOne(() => Pos, pos => pos.id)
    @JoinColumn({ name: "posId" })
    pos: Pos


}