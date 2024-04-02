import { route } from "../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;
const multer = require('multer');
const upload = multer({ dest: "temp/" });

const routes: route[] = [
	{ path: controller.__component + '/', method: "get", function: controller.list, private: true, perm_component: "deal", permission: "list" },
	{ path: controller.__component + '/get/dealCount', method: "get", function: controller.generateId, private: true, perm_component: "deal", permission: "list" },
	{ path: controller.__component + '/:id', method: "get", function: controller.get, private: true, perm_component: "deal", permission: "get" },
	{ path: controller.__component + '/', method: "post", function: controller.createOrUpdate, uploader: upload.fields([{ name: 'checkoutLogo', maxCount: 1 }]), private: true, perm_component: "deal", permission: "add" },
	{ path: controller.__component + '/:id', method: "put", function: controller.createOrUpdate, uploader: upload.fields([{ name: 'checkoutLogo', maxCount: 1 }]), private: true, perm_component: "deal", permission: "update" },
	{ path: controller.__component + '/:id', method: "delete", function: controller.delete, private: true, perm_component: "deal", permission: "delete" },
	{ path: controller.__component + '/updatestatus/:id', method: "put", function: controller.changeStatus, private: true, perm_component: "deal", permission: "update" }
];
export default routes;