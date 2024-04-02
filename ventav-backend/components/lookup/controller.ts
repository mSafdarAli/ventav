import { ObjectId } from "mongodb";
import { Request, Response } from "../../__types";
import { BaseController } from "../../core";

export default class UserController extends BaseController {
	public __component: string = "lookup";
	public getStatesData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const result = await this.collections.states.aggregate([
				{
					$project: {
						name: 1,
						value: "$_id"
					},
				}
			]).toArray();
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public getRolesData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const result = await this.collections.roles.aggregate([
				{
					$match: {
						priority: {
							$gt: req.user?.role?.priority
						}
					}
				},
				{
					$project: {
						name: 1,
						value: "$_id"
					},
				}
			]).toArray();
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public getRegionsData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const states: any = [];
			const regions: any = [];
			const { ids } = req.params;
			const st = ids.split(',');
			if (st && st.length > 0) {
				st.forEach(el => {
					states.push(new ObjectId(el));
				});
			}
			const result = await this.collections.regions.aggregate([
				{
					$match: {
						stateId: { $in: states }
					}
				},
				{
					$lookup: {
						from: "states",
						localField: "stateId",
						foreignField: "_id",
						as: "states"
					}
				},
			]).toArray();
			result.forEach(el => {
				regions.push({
					name: "[" + el.states[0].name + "] - " + el.name,
					value: el._id,
				})
			})
			return this.json(req, res, 200, { data: regions });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public getIndustriesData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const result = await this.collections.industries.aggregate([
				{
					$match: {
						isDeleted: false
					}
				},
				{
					$project: {
						name: 1,
						value: "$_id"
					},
				}
			]).toArray();
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public getPromotersData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const role = await this.collections.roles.findOne({ name: 'Promoter' }, { projection: { _id: 1 } });
			const result = await this.collections.users.aggregate([
				{
					$match: {
						roleId: new ObjectId(role?._id),
						isDeleted: false
					}
				},
				{
					$project: {
						name: 1,
						value: "$_id"
					},
				}
			]).toArray();
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public getFirmsData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const result = await this.collections.firms.aggregate([
				{
					$match: {
						isDeleted: false
					}
				},
				{
					$project: {
						name: "$companyName",
						value: "$_id"
					},
				}
			]).toArray();
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public getDealData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const matchIndIds: any[] = [];
			const { id } = req.params;
			const indIds = id.split(',')
			indIds.forEach(el => {
				matchIndIds.push(new ObjectId(el))
			})
			const stateData: any[] = [];
			const regionData: any[] = [];
			const merchantData: any[] = [];
			const result = await this.collections.merchants.aggregate([
				{
					$match: {
						industryId: { $in: matchIndIds },
						isDeleted: false
					}
				},
				{
					$lookup: {
						from: "industries",
						localField: "industryId",
						foreignField: "_id",
						as: "industries"
					}
				},
				{
					$lookup: {
						from: "states",
						localField: "stateIds",
						foreignField: "_id",
						as: "states"
					}
				},
				{
					$lookup: {
						from: "regions",
						localField: "regionIds",
						foreignField: "_id",
						as: "regions"
					}
				},
				{
					$lookup: {
						from: "users",
						localField: "promoterId",
						foreignField: "_id",
						as: "promoters"
					}
				},
				{
					$project: {
						_id: 1,
						name: 1,
						states: "$states",
						regions: "$regions",
						industries: "$industries",
						promoters: "$promoters"
					},
				},
			]).toArray();
			result.forEach((el, i) => {
				merchantData.push({ name: "(" + el.promoters[0].name + ") - " + "[" + el.industries[0].name + "] - " + el.name, value: el._id, region: el.regions })
				el.states.forEach(st => {
					if (stateData.findIndex(x => x.name == st.name) == -1) {
						stateData.push({
							name: st.name,
							value: st._id,
						})
					}
				});
				stateData.forEach(st => {
					el.regions.forEach(r => {
						if (String(st.value) == String(r.stateId))
							regionData.push({
								name: "[" + st.name + "] - " + r.name,
								value: r._id,
								stateId: r.stateId,
							})
					})
				});
			})
			return this.json(req, res, 200, { data: { merchants: merchantData, states: stateData, regions: regionData } });
		}
		catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public getDealTemplate = async (req: Request, res: Response): Promise<Response> => {
		try {
			const dealTemp: any[] = [];
			const result = await this.collections.emailTemplates.aggregate([
				{
					$match: {
						used_for: "deal"
					}
				},
				{
					$lookup: {
						from: "templateDetails",
						localField: "_id",
						foreignField: "templateId",
						as: "templates"
					}
				},
				{
					$project: {
						templates: "$templates",
					},
				}
			]).toArray();
			result.forEach(el => {
				el.templates.forEach(e => {
					dealTemp.push({
						name: e.name,
						value: e._id
					})
				});
			})
			return this.json(req, res, 200, { data: dealTemp });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public getDealDataLookup = async (req: Request, res: Response): Promise<Response> => {
		try {
			if (req.query["dealName"]){
				const dealName = req.query["dealName"].toString();
				const result = await this.collections.deals.aggregate([
					{
						$match: {
							dealName: new RegExp(dealName, "gim"),
							isDeleted: false
						}
					},
					{
						$project: {
							name: "$dealName",
							value: "$_id"
						},
					}
				]).toArray();
				return this.json(req, res, 200, { data: result });
			}else{
				return this.json(req, res, 200, { data: {} });
			}	
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
}
