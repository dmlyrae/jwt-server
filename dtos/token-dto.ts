import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class TokenPayloadDto {
	@IsNumber()
	@IsNotEmpty()
	id: number;

	@IsEmail()
	@IsNotEmpty()
	email: string;

    @IsBoolean()
    isActive?: boolean;

    iat?: number;

    exp?: number;
}