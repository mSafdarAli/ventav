import { route } from "../../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;

const routes: route[] = [
	{ path: controller.__component + '/get/details/:id', method: "get", function: controller.list, private: true, perm_component: "emailTemplate", permission: "list" },
	{ path: controller.__component + '/get/template-Fields/:id', method: "get", function: controller.getFieldByCategory, private: true, perm_component: "emailTemplate", permission: "get" },
	{ path: controller.__component + '/list/templates', method: "get", function: controller.getTemplateNames, private: true, perm_component: "emailTemplate", permission: "list" },
	{ path: controller.__component + '/:id', method: "get", function: controller.get, private: true, perm_component: "emailTemplate", permission: "get" },
	{ path: controller.__component + '/', method: "post", function: controller.createOrUpdate, private: true, perm_component: "emailTemplate", permission: "add" },
	{ path: controller.__component + '/duplicate/:id', method: "post", function: controller.duplicateTemplate, private: true, perm_component: "emailTemplate", permission: "add" },
	{ path: controller.__component + '/:id', method: "put", function: controller.createOrUpdate, private: true, perm_component: "emailTemplate", permission: "update" },
	{ path: controller.__component + '/:id', method: "delete", function: controller.delete, private: true, perm_component: "emailTemplate", permission: "delete" },
	{ path: controller.__component + '/updatestatus/:id', method: "put", function: controller.changeStatus, private: true, perm_component: "emailTemplate", permission: "update" }
];
export default routes;