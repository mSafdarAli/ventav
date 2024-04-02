import { route } from "../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;

const routes: route[] = [
	{ path: controller.__component + '/', method: "get", function: controller.list, private: true, perm_component: "coupon", permission: "list" },
	{ path: controller.__component + '/get/export', method: "post", function: controller.exportCoupons, private: true, perm_component: "coupon", permission: "export" },
	{ path: controller.__component + '/', method: "post", function: controller.createOrUpdate, private: true, perm_component: "coupon", permission: "add" },
	{ path: controller.__component + '/:id', method: "put", function: controller.updateEmail, private: true, perm_component: "coupon", permission: "update" },
	{ path: controller.__component + '/:id', method: "delete", function: controller.delete, private: true, perm_component: "coupon", permission: "delete" },
];
export default routes;