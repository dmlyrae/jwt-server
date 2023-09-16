import { NextFunction, Request, Response } from "express";
import { ApiError } from "../exceptions/api-error";

export const errorMiddleware = function (error: ApiError | Error, req: Request, res: Response, next: NextFunction) {
	if (error instanceof ApiError) {
		const { message, errors } = error;
		return res
			.status(error.status)
			.json({
				message,
				errors
			})
	}
	return res
		.status(500)
		.json({
			message: "Unexpected server-error."
		})
}