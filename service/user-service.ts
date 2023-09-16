import { AppDataSource } from "../connect/connect";
import { User } from "../entities/user";
import bcrypt from "bcrypt";
import { v4 as uuid} from "uuid";
import { mailService } from "./mail-service";
import { tokenService } from "./token-service";
import { TUserDTO, UserCreateDto, UserLoginDto, UserUpdateDto } from "../dtos/user-dto";
import { Repository, UpdateResult } from "typeorm";
import { ApiError } from "../exceptions/api-error";
import { validate } from "class-validator";

abstract class AbstractUserService {
	registration: (userCreateDto: UserCreateDto) => Promise<{
		tokenAccess: string;
		tokenRefresh: string;
		user: UserUpdateDto;
	}>
	activate: (activationLink: string) => Promise<UpdateResult>
	validateDTO: (DTO: TUserDTO) => Promise<void>
	login: (userLoginDto: UserLoginDto) => Promise<{
		tokenAccess: string;
		tokenRefresh: string;
		user: UserUpdateDto;
	}>
	logout: (refreshToken: string) => Promise<void>
	refresh: (refreshToken: string) => Promise<{
		tokenAccess: string;
		tokenRefresh: string;
		user: UserUpdateDto;
	}>
}

class UserService implements AbstractUserService {
	private userRepo:Repository<User>;

	constructor() {
		this.userRepo = AppDataSource.getRepository(User);
	}

	async validateDTO (DTO: TUserDTO) {
		const errors = await validate(DTO)
		if (errors.length) {
			throw ApiError.ValidationException(errors)
		}
	}

	async registration (userCreateDto) {

		await this.validateDTO(userCreateDto)
		const { email, password } = userCreateDto

		const candidate = await this.userRepo.findOneBy({email})
		if (candidate) {
			throw ApiError.BadRequest(`User with email "${email}" already exist.`)
		}

		// Creating user
		const salt = await bcrypt.genSalt(3);
		const hashPassword = await bcrypt.hash(password, salt)
		const activationLink = uuid()
		const preparedUser = this.userRepo.create({email, password: hashPassword, activationLink}) 
		const newUser = await this.userRepo.save(preparedUser)
		await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`)
		const updatedUser = new UserUpdateDto(newUser) // truncating password

		const { tokenRefresh, tokenAccess, error: tokenCreateError } = await tokenService.generateToken(updatedUser);
		if (tokenCreateError) { 
			throw ApiError.BadRequest(tokenCreateError);
		}

		const { error: saveError, result } = await tokenService.saveToken(tokenRefresh, updatedUser.id);
		if (saveError) { 
			throw ApiError.BadRequest(saveError);
		}

		return {
			tokenRefresh,
			tokenAccess,
			user: updatedUser,
		}

	}

	async login (userLoginDto: UserLoginDto) {
		await this.validateDTO(userLoginDto);
		const { email, password } = userLoginDto;
		const user = await this.userRepo.findOneBy({ email, isActive: true })
		if (!user) {
			throw ApiError.BadRequest("User not found.");
		}
		const isPassEqual = await bcrypt.compare(password, user.password);
		if (!isPassEqual) {
			throw ApiError.BadRequest("Invalid login or password.");
		}
		const userDto = new UserUpdateDto(user);
		const { tokenAccess, tokenRefresh } = await tokenService.generateToken(userDto) 

		const { error: saveError } = await tokenService.saveToken(tokenRefresh, user.id);
		if (saveError) { 
			throw ApiError.BadRequest(saveError);
		}

		return {
			tokenRefresh,
			tokenAccess,
			user: userDto,
		}
	}

	async logout (refreshToken: string) {
		const { error, result } = await tokenService.removeToken(refreshToken)
		if (error) {
			throw ApiError.ServerError("Something went wrong.")
		}
	}

	async refresh (refreshToken: string) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedException()
		}
		const tokenPayload = tokenService.validateRefreshToken(refreshToken)
		const tokenDto = await tokenService.findToken(refreshToken)
		if (!tokenPayload || !tokenDto) {
			throw ApiError.UnauthorizedException()
		}
		const user = await this.userRepo.findOneBy({ id: tokenPayload.id ?? tokenDto.user })
		const userDto = new UserUpdateDto(user)
		const { tokenAccess, tokenRefresh, error } = await tokenService.generateToken(userDto)
		if (error) {
			throw ApiError.ServerError(error)
		}
		return {
			tokenRefresh,
			tokenAccess,
			user: userDto,
		}
	}

	async activate (activationLink: string) {
		const candidate = await this.userRepo.findOneBy({activationLink})
		if (!candidate) {
			throw new Error("User not found!");
		}
		candidate.isActive = true;
		return await this.userRepo.update({id: candidate.id}, candidate);
	}

	async getAllUser () {
		const users = await this.userRepo.find()
		return users.map( user => new UserUpdateDto(user) )
	}
}

const userService = new UserService();
export { userService }