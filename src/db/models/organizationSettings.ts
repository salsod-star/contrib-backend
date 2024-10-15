import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Organization } from "./organization";

@Entity()
export class OrganizationSetting {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  twitterUrl!: string;

  @Column()
  facebookUrl!: string;

  @Column()
  instagramUrl!: string;

  @Column()
  linkedInUrl!: string;

  @Column()
  youtubeUrl!: string;

  @Column({ type: "interval" })
  contributionInterval!: string;

  @Column({ type: "timestamp" })
  nextContributionDate!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  startDate!: Date;

  @OneToOne(() => Organization, (organization) => organization.settings)
  organization!: Organization;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  handleContributionIntervalOnInsert() {
    if (this.startDate > this.nextContributionDate) {
      this.nextContributionDate = this.startDate;
    }

    this.nextContributionDate = new Date(
      this.nextContributionDate.getMilliseconds() +
        this.parseIntervalToMilli(this.contributionInterval)
    );
  }

  parseIntervalToMilli(interval: string) {
    let [num, unit] = interval.split(" ");

    let value = parseInt(num, 10);

    switch (unit.toLowerCase()) {
      case "day":
      case "days":
        return value * 24 * 60 * 60 * 1000;
      case "week":
      case "weeks":
        return value * 7 * 24 * 60 * 60 * 1000;

      case "month":
      case "months":
        return value * 7 * 24 * 60 * 60 * 1000;
      default:
        throw new Error("Unsupported interval unit");
    }
  }
}
