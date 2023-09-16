import { NextFunction, Request, Response } from "express";
import { userService } from "../service/user-service";
import { UserCreateDto, UserLoginDto } from "../dtos/user-dto";

class UserController {
	async registration (req:Request, res:Response, next: NextFunction) {
		try {
			const { email, password, ...restBodyParams } = req.body
			const userCreateDto = new UserCreateDto()
			userCreateDto.email = email
			userCreateDto.password = password
			const result = await userService.registration(userCreateDto)
			res.cookie("refreshToken", result.tokenRefresh, {
				maxAge: 3456000000, // 30 days
				httpOnly: true, // https://expressjs.com/en/advanced/best-practice-security.html#set-cookie-security-options
			})
			return res.json({
				error: null,
				result,
			})
		} catch (e) {
			next(e)
		}
	}
	async login (req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password, ...restBodyParams } = req.body
			const userLoginDto = new UserLoginDto()
			userLoginDto.email = email
			userLoginDto.password = password
			const result = await userService.login(userLoginDto)
			res.cookie("refreshToken", result.tokenRefresh, {
				maxAge: 3456000000,
				httpOnly: true,
			})
			return res.json({
				error: null,
				result,
			})
		} catch (e) {
			next(e)
		}
	}
	async logout (req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies 
			await userService.logout(refreshToken)
			res.clearCookie("refreshToken")
			return res.json({
				error: null,
				result: refreshToken,
			})
		} catch (e) {
			next(e)
		}
	}
	async refresh (req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies 
			const result = await userService.refresh(refreshToken)
			res.cookie("refreshToken", refreshToken, {
				maxAge: 3456000000, 
				httpOnly: true, 
			})
			return res.json({
				error: null,
				...result
			})
		} catch (e) {
			next(e)
		}
	}
	async activate (req: Request, res: Response, next: NextFunction) {
		try {
			const activationLink = req.params.link
			await userService.activate(activationLink)
			res.redirect(process.env.SUCCESS_URL)
		} catch (e) {
			next(e)
		}
	}
	async getAllUser (req:Request, res:Response, next: NextFunction) {
		try {
			const result = await userService.getAllUser();
			res.json(result)
		} catch (e) {
			next(e)
		}
	}
}

const userController = new UserController();
export { userController }