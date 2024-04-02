import { route } from "../../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;
const multer = require('multer');
const upload = multer({ dest: "temp/" });

const routes: route[] = [
	{ path: controller.__component + '/', method: "get", function: controller.list, private: true, perm_component: "industry", permission: "list" },
	{ path: controller.__component + '/:id', method: "get", function: controller.get, private: true, perm_component: "industry", permission: "get" },
	{ path: controller.__component + '/', method: "post", function: controller.createOrUpdate, uploader: upload.fields([{ name: 'ticketImage', maxCount: 1 }, { name: 'dealPageImages', maxCount: 3 }]), private: true, perm_component: "industry", permission: "add" },
	{ path: controller.__component + '/:id', method: "put", function: controller.createOrUpdate, uploader: upload.fields([{ name: 'ticketImage', maxCount: 1 }, { name: 'dealPageImages', maxCount: 3 }]), private: true, perm_component: "industry", permission: "update" },
	{ path: controller.__component + '/:id', method: "delete", function: controller.delete, private: true, perm_component: "industry", permission: "delete" }
];
export default routes;