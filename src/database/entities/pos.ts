import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { toLowerTransform, trimTransform } from "../../utilities/transformer"
import { Nas } from "./nas"
import { Policies } from "./policies"


@Entity({ synchronize: false })
export class Pos extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 128, transformer: trimTransform })
    name: string

    @Column({ length: 6, nullable: true, unique: true, transformer: toLowerTransform })
    prefix: string

    @Column({ length: 128, transformer: trimTransform })
    company: string

    @Column({ length: 128 })
    category: string

    @Column({ length: 11, default: 'enabled' })
    status: 'enabled' | 'disabled'


    @OneToMany(() => Nas, nas => nas.pos)
    nas: Nas[]


    @ManyToMany(() => Policies)
    @JoinTable({ name: 'pos_policies' })
    policies: Policies[]


}



