import { NextFunction, Request, Response } from "express";
import { ApiError } from "../exceptions/api-error";
import { tokenService } from "../service/token-service";

export const authMiddleware = function (req: Request, res: Response, next: NextFunction) {
	try {

		const authorizationHeader = req.headers.authorization;
		if (!authorizationHeader) {
			throw ApiError.UnauthorizedException()
		}

		const accessToken = authorizationHeader.split(" ")[1];
		if (!accessToken) {
			throw ApiError.UnauthorizedException()
		}

		const tokenPayload = tokenService.validateAccessToken(accessToken);
		if (!tokenPayload) {
			throw ApiError.UnauthorizedException()
		}

		// req.user = tokenPayload;

		next();
	} catch (e) {
		next(ApiError.UnauthorizedException())
	}
}