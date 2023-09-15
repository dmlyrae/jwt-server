import { Request, Response } from "express";
import { userService } from "../service/user-service";

class UserController {
	async registration (req:Request, res:Response, next) {
		try {
			const { email, password } = req.body;
			const result = await userService.registration(email, password)
			res.json(result)
		} catch (e) {

		}
	}
	async login (req, res, next) {
		try {

		} catch (e) {

		}
	}
	async logout (req, res, next) {
		try {

		} catch (e) {

		}
	}
	async refresh (req, res, next) {
		try {

		} catch (e) {

		}
	}
	async activate (req, res, next) {
		try {

		} catch (e) {

		}
	}
	async getAllUser (req:Request, res:Response, next) {
		console.log('getAllusers start')
		const result = await userService.getAllUser();
		res.json(result)
	}
}

const userController = new UserController();
export { userController }