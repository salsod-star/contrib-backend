import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

  @Column({
    length: 15,
  })
  firstName!: string;

  @Column({
    length: 15,
  })
  lastName!: string;

  @Column({
    length: 12,
    unique: true,
  })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: null })
  passwordResetToken!: string;

  @Column({ type: "number", default: null })
  passwordResetTokenExpires!: number;

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
