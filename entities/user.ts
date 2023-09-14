import { Unique } from "typeorm";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
@Unique('email_unique', ["email"])
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	isActivated: boolean;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column()
	isActive: boolean;

	@Column()
	activationLink: string;

	@Column()
	password: string;
}