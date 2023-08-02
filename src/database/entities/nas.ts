import { BaseEntity, Column, CreateDateColumn, Entity, Generated, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { assetsPathTransform, trimTransform } from "../../utilities/transformer";
import { HotspotProfile } from "./hotspot.profiles";
import { Policies } from "./policies";
import { Pos } from "./pos";

@Entity({ synchronize: false })
export class Nas extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    /**
    * private IP address
    */
    @Column({ type: 'text', unique: true, transformer: trimTransform })
    nasname: string

    @Column({ type: 'text', unique: true, transformer: trimTransform })
    shortname: string



    @Column({ length: 11, default: 'enabled' })
    status: 'enabled' | 'disabled'



    @Column({ nullable: true })
    profileId: number

    @Column({ default: true })
    allow_SMS: boolean

    @Column({ default: false })
    twoStepVerification: boolean

    @Column({ length: 6, nullable: true, transformer: trimTransform })
    verificationCode: string

    @Column({ length: 128, nullable: true, transformer: assetsPathTransform })
    logo: string

    @Column({ length: 128, nullable: true, transformer: assetsPathTransform })
    image1: string

    @Column({ length: 128, nullable: true, transformer: assetsPathTransform })
    image2: string

    @Column({ length: 512, nullable: true })
    title: string

    @Column({ length: 512, nullable: true })
    ad1: string

    @Column({ length: 512, nullable: true })
    ad2: string
    @Column({ length: 512, nullable: true })
    ad3: string

    @ManyToOne(() => HotspotProfile, profile => profile.id)
    @JoinColumn({ name: "profileId" })
    profile: HotspotProfile

    @Column({ nullable: true })
    policyId: number

    @Column({ nullable: true })
    posId: number

    @ManyToOne(() => Policies, policy => policy.id)
    @JoinColumn({ name: "policyId" })
    policy: Policies


    @ManyToOne(() => Pos, pos => pos.id, { eager: true })
    @JoinColumn({ name: "posId" })
    pos: Pos

}
