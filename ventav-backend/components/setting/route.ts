import { route } from "../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;

const routes: route[] = [
	{ path: controller.__component + '/permissions', method: "get", function: controller.permissions, private: true, perm_component: 'user', permission: 'me' },
];
export default routes;