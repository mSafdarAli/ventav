import { route } from "../../__types";
import AuthController from './controller';
const controller: AuthController = new AuthController();

const routes: route[] = [
	{ path: controller.__component + '/login', method: "post", function: controller.login, private: false },
	{ path: controller.__component + '/register', method: "post", function: controller.register, private: false },
	{ path: controller.__component + '/forgetPassword', method: "post", function: controller.forgetPassword, private: false },
	{ path: controller.__component + '/resetPassword', method: "put", function: controller.resetPassword, private: false },
];
export default routes;