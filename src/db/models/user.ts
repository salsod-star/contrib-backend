import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Contribution } from "./contribution";
import { Membership } from "./membership";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 15 })
  firstName!: string;

  @Column({ length: 15 })
  lastName!: string;

  @Column({ length: 12, unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: null })
  passwordResetToken!: string;

  @Column({ type: "timestamp", default: null, nullable: true })
  passwordResetTokenExpires!: Date | null;

  @Column({ type: "timestamp", default: null })
  lastSeen!: Date;

  @Column({ default: false })
  isActive!: boolean;

  @Column({ nullable: true })
  defaultOrganizationId!: string;

  @Column({ nullable: true })
  ownerOrganizationId!: string;

  @OneToMany(() => Contribution, (contribution) => contribution.user)
  contributions!: Contribution[];

  @OneToMany(() => Membership, (userMembership) => userMembership.user)
  organizations!: Membership[];
}
