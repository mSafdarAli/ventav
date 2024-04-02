import { route } from "../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;
const multer = require('multer');
const upload = multer({ dest: "temp/" });

const routes: route[] = [
	{ path: controller.__component + '/', method: "post", function: controller.makePayment, private: false},
];
export default routes;