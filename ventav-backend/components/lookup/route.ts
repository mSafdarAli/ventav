import { route } from "../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;

const routes: route[] = [
	{ path: controller.__component + '/getStates', method: "get", function: controller.getStatesData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getRegions/:ids', method: "get", function: controller.getRegionsData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getIndustries', method: "get", function: controller.getIndustriesData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getRoles', method: "get", function: controller.getRolesData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getPromoters', method: "get", function: controller.getPromotersData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getFirms', method: "get", function: controller.getFirmsData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getDeals', method: "get", function: controller.getDealDataLookup, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getDealData/:id', method: "get", function: controller.getDealData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getDealTemplates', method: "get", function: controller.getDealTemplate, private: true, perm_component: 'lookup', permission: 'list' },
];
export default routes;