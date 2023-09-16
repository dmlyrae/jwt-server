import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString, Length, validate } from "class-validator";
import { User } from "../entities/user";

export class UserUpdateDto {
	constructor (user: User) {
		const { email, id, isActive } = user;
		this.email = email;
		this.id = id;
		this.isActive = !!isActive;
	}

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNumber()
	@IsNotEmpty()
	id: number;

	@IsBoolean()
	isActive: boolean;

}

export class UserCreateDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@Length(5, 100) 
	password: string;
}

export class UserLoginDto extends UserCreateDto {}

export type TUserDTO = UserUpdateDto | UserCreateDto | UserLoginDto;