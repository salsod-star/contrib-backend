import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrganizationSetting } from "./organizationSettings";
import { Membership } from "./membership";

@Entity()
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  adminId!: string;

  @Column({ nullable: true })
  memberCount!: number;

  @OneToOne(() => OrganizationSetting, (settings) => settings.organization)
  @JoinColumn()
  settings!: OrganizationSetting;

  @OneToMany(() => Membership, (userMembership) => userMembership.organization)
  members!: Membership[];
}
