import { JoinColumn, OneToOne, Unique } from "typeorm";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { User } from "./user";

@Entity()
@Unique('user_unique', ["user"])
export class Token {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	refreshToken: string;

    @Column({
        primaryKeyConstraintName: "user_fk",
	})
	@OneToOne(() => User, (user) => user.id, {
		// cascade: true,
	})
	@JoinColumn([{ 
		name: "user", 
		referencedColumnName: "id", 
		foreignKeyConstraintName: "token_user_fkey"
	}])
    user: number;
}