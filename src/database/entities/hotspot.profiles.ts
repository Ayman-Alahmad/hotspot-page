import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { assetsPathTransform, trimTransform } from "../../utilities/transformer";

@Entity({ synchronize: false })
export class HotspotProfile extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 126, unique: true, transformer: trimTransform })
    name: string

    @Column({ length: 512 })
    description: string

    //-------------- Hotspot Profile ---------------------

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

    /**
     * Sign in (Mobile)
     */
    @Column({ type: 'text', nullable: true })
    signIn: string

    /**
     * Login (Mobile)
     */
    @Column({ type: 'text', nullable: true })
    verifySMS: string

    /**
     * Login (Account)
     */
    @Column({ type: 'text', nullable: true })
    login: string


    @Column({ type: 'text', nullable: true })
    status: string

    @Column({ type: 'text', nullable: true })
    logout: string



}
