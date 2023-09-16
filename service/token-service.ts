import { AppDataSource } from "../connect/connect";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { Token } from "../entities/token";
import { UserLoginDto, UserUpdateDto } from "../dtos/user-dto";
import { DeleteResult, InsertResult, Repository } from "typeorm";
import { TokenPayloadDto } from "../dtos/token-dto";

abstract class AbstractTokenService {
	generateToken: {
		(userUpdateDto: UserUpdateDto | UserLoginDto): Promise<{
			tokenAccess?: string;
			tokenRefresh?: string;
			error: string | null;
		}>
	}
	saveToken: {
		(refreshToken: string, user: number): Promise<{
			error: null,
			result?: InsertResult,
		}>
	}
	removeToken: {
		(refreshToken: string): Promise<{
			error?: string | null;
			result?: DeleteResult;
		}>
	}
	validateAccessToken: (token: string) => JwtPayload;
	validateRefreshToken: (token: string) => JwtPayload;
}

class TokenService implements AbstractTokenService {

	private tokenRepo: Repository<Token>;

	constructor () {
		this.tokenRepo = AppDataSource.getRepository(Token);
	}

	validateAccessToken(accessToken: string) {
		try {
			const result = verify(accessToken, process.env.JWT_ACCESS_SECRET);
			if (typeof result === "string") {
				throw new Error()
			}
			return result
		} catch (e) {
			console.warn("Verification error.", e.message)
			return null;
		}
	}

	validateRefreshToken(refreshToken: string) {
		try {
			const result = verify(refreshToken, process.env.JWT_REFRESH_SECRET);
			if (typeof result === "string") {
				throw new Error()
			}
			return result
		} catch (e) {
			console.warn("Verification error.", e.message)
			return null;
		}
	}

	async findToken(refreshToken) {
		try {
			return await this.tokenRepo.findOneBy({refreshToken})
		} catch (e) {
			console.warn("Find token error.", e.message)
			return null;
		}
	}

	async generateToken (userUpdateDto: UserUpdateDto|UserLoginDto) {
		const payload = {...userUpdateDto};
		try {
			const secretAccess = process.env.JWT_ACCESS_SECRET;
			const secretRefresh = process.env.JWT_REFRESH_SECRET;
			const tokenAccess = sign( payload, secretAccess, {
				expiresIn: '15m'
			} );
			const tokenRefresh = sign( payload, secretRefresh, {
				expiresIn: '30d' 
			} );
			return {
				tokenAccess,
				tokenRefresh,
				error: null,	
			}
		} catch (e) {
			console.warn(`Error in TokenService.generateToken.`, e.message )
			return {
				error: e.message,
			}
		}
	}
	saveToken = async function (refreshToken, user) {
		try {
			const result = await AppDataSource.manager
				.getRepository(Token)
				.createQueryBuilder()
				.insert()
				.values([ {refreshToken, user} ])
				.orUpdate(["refreshToken"], ["user"])
				.execute();
			return {
				error: null,
				result,
			};
		} catch (e) {
			console.warn(`Error in TokenService.saveToken.`, e.message )
			return {
				error: e.message,
			}
		}
	}
	async removeToken (refreshToken) {
		try {
			const result = await this.tokenRepo.delete({
				refreshToken
			})
			return {
				error: null,
				result,
			}
		} catch (e) {
			console.warn(`Error in TokenService.removeToken.`, e.message )
			return {
				error: e.message
			}

		}
	}
}

export const tokenService = new TokenService();