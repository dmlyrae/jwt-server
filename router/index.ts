import { Router } from "express";
import { userController } from "../controllers/user-controllers";
import { authMiddleware } from "../middlewares/auth-middlewares";

const router = Router();

router.post(`/registration`, userController.registration);
router.post(`/login`, userController.login);
router.post(`/logout`, userController.logout);
router.get(`/activate/:link`, userController.activate);
router.get(`/refresh`, userController.refresh);
router.get(`/users`, authMiddleware, userController.getAllUser);

export { router };