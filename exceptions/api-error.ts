import { ValidationError } from "class-validator";

export class ApiError extends Error {
	constructor( 
		public status: number,
		public message: string,
		public errors: Array<Error | ValidationError> = [],
	) {
		super(message);
	}

	static UnauthorizedException() {
		return new ApiError(401, "User not authorized.")
	}

	static ValidationException(errors: ValidationError[] ) {
		return new ApiError(400, "Validation errors.", errors)
	}

	static BadRequest(message: string, errors: Error[] = []) {
		return new ApiError(400, message, errors)
	}

	static ServerError(message: string, errors: Error[] = []) {
		return new ApiError(500, message, errors)
	}

}