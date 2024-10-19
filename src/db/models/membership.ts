import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";
import { Organization } from "./organization";

export enum UserRole {
  ADMIN = "admin",
  MODERATOR = "moderator",
  MEMBER = "member",
}

@Entity()
export class Membership {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role!: UserRole;

  @ManyToOne(() => User, (user) => user.organizations)
  user!: User;

  @ManyToOne(() => Organization, (organization) => organization.members)
  organization!: Organization;

  @BeforeInsert()
  incrementMemberCount() {
    this.organization.memberCount += 1;
  }
}
