import { route } from "../../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;

const routes: route[] = [
	{ path: controller.__component + '/getStates', method: "get", function: controller.getStatesData, private: false },
	{ path: controller.__component + '/getRegions/:ids', method: "get", function: controller.getRegionsData, private: false },
	{ path: controller.__component + '/getDeal/:id', method: "get", function: controller.getDeal, private: false },
	// { path: controller.__component + '/', method: "post", function: controller.redeem, private: false },
];
export default routes;