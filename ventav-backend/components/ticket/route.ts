import { route } from "../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;

const routes: route[] = [
	{ path: controller.__component + '/', method: "get", function: controller.list, private: true, perm_component: "ticket", permission: "list" },
	// { path: controller.__component + '/:id', method: "get", function: controller.get, private: true, perm_component: "ticket", permission: "get" },
	// { path: controller.__component + '/', method: "post", function: controller.createOrUpdate, private: true, perm_component: "ticket", permission: "add" },
	// { path: controller.__component + '/:id', method: "put", function: controller.createOrUpdate, private: true, perm_component: "ticket", permission: "update" },
	{ path: controller.__component + '/:id', method: "delete", function: controller.delete, private: true, perm_component: "ticket", permission: "delete" },
];
export default routes;