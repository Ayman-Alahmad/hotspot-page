import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { trimTransform } from "../../utilities/transformer"

@Entity({ synchronize: false })
export class Policies extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 128, unique: true, transformer: trimTransform })
    name: string

    @Column({ length: 512, transformer: trimTransform })
    description: string

    @Column()
    period: 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'

    @Column()
    duration: number





}