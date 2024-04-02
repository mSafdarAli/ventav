import { route } from "../../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;

const routes: route[] = [
	{ path: controller.__component + '/getIndustry/:id', method: "get", function: controller.getIndustry, private: false},
	{ path: controller.__component + '/', method: "post", function: controller.redeem, private: false},
	{ path: controller.__component + '/getStates', method: "post", function: controller.getStatesAndRegions, private: false},
];
export default routes;