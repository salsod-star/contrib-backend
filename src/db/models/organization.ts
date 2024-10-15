import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";
import { OrganizationSetting } from "./organizationSettings";

@Entity()
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  isDefault!: boolean;

  @OneToOne(() => OrganizationSetting, (settings) => settings.organization)
  @JoinColumn()
  settings!: OrganizationSetting;

  @OneToMany(() => User, (user) => user.organization)
  users!: User[];
}
