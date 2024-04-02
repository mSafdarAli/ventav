import { route } from "../../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;

const routes: route[] = [
	{ path: controller.__component + '/', method: "get", function: controller.getTickets, private: false },
	{ path: controller.__component + '/', method: "post", function: controller.redeemTickets, private: false },
	{ path: controller.__component + '/:industryId', method: "get", function: controller.getLocations, private: false },
];
export default routes;