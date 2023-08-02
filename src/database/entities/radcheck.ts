import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"
import { toLowerTransform, trimTransform } from "../../utilities/transformer"


@Entity({synchronize:false})
@Index('radcheck_username', ['username', 'attribute'], { unique: true })
export class Radcheck extends BaseEntity {

    @PrimaryGeneratedColumn()
    id?: number

    @Column({ type: 'text', transformer: toLowerTransform })
    username: string

    @Column({ type: 'text', transformer: trimTransform })
    attribute: string

    @Column({ length: 2, default: '==', transformer: trimTransform })
    op: string

    @Column({ type: 'text', default: '', nullable: true, transformer: trimTransform })
    value: string
}