import { AppDataSource } from "../connect/connect";
import { User } from "../entities/user";
import bcrypt from "bcrypt";
import { v4 as uuid} from "uuid";
import { mailService } from "./mail-service";

class UserService {
	async registration (email:string, password: string) {
		try {
			const candidate = await AppDataSource.manager.findOneBy(User, {email})
			if (candidate) {
				throw new Error(`User with email "${email}" already exist.`);
			}
			//const salt = process.env.SALT;
			const salt = await bcrypt.genSalt(3);
			const hashPassword = await bcrypt.hash(password, salt)
			const activationLink = uuid();
			const preparedUser = AppDataSource.manager.create(User, {email, password: hashPassword, activationLink}) 
			const newUser = await AppDataSource.manager.save(User, preparedUser)
			await mailService.sendActivationMail(email, activationLink)
			const {password:_, ...user} = newUser;
			return user
		} catch (e:any) {
			return {
				error: e.message
			}
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
	async getAllUser () {
		try {
			const result = await AppDataSource.manager
				.getRepository(User)
				.createQueryBuilder("user")
				.where("id = :id", { id: 1 })
				.getOne();
			console.log('result', result);
			return result;
		} catch (e) {
			console.log(e.message)
		}
	}
}

const userService = new UserService();
export { userService }