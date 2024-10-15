import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Organization } from "./organization";
import { Contribution } from "./contribution";

enum UserRole {
  SUPER_ADMIN = "superAdmin",
  ADMIN = "admin",
  TREASURER = "treasurer",
  MEMBER = "member",
  USER = "user",
}

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

  @Column({ nullable: true })
  defaultOrganizationId!: string;

  @Column({ nullable: true })
  ownerOrganizationId!: string;

  @ManyToOne(() => Organization, (organization) => organization.users)
  organization!: Organization;

  @OneToMany(() => Contribution, (contribution) => contribution.user)
  contributions!: Contribution[];

  @Column()
  password!: string;

  @Column({ default: null })
  passwordResetToken!: string;

  @Column({ type: "timestamp", default: null, nullable: true })
  passwordResetTokenExpires!: Date | null;

  @Column({ type: "timestamp", default: null })
  lastSeen!: Date;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ default: false })
  isActive!: boolean;
}
