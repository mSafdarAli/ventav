import { ObjectId } from "mongodb";
import { BaseController } from "../../core";
import { Filter_Options, Request, Response } from '../../__types';

export default class MerchantController extends BaseController {
	public __component: string = "merchants";
	private d: Date = new Date();
	private filter_options: Filter_Options = {
		search: ["name"],
		defaultSort: "_id",
		filters: {
			promoterId: { type: "objectId", filter: "$in" },
			industryId: { type: "objectId", filter: "$in" },
			status: { type: "string", filter: "$eq" },
		},
	};
	public list = async (req: Request, res: Response): Promise<Response> => {
		try {
			const defaultFilter = { isDeleted: false };
			this.getAggrigation(req, this.filter_options, defaultFilter);
			const [data, count] = await Promise.all([
				this.collections.merchants.aggregate([
					...req.aggregations,
					{
						$lookup: {
							from: "users",
							localField: "promoterId",
							foreignField: "_id",
							as: "promoter"
						}
					},
					{
						$lookup: {
							from: "industries",
							localField: "industryId",
							foreignField: "_id",
							as: "industry"
						}
					},
					{
						$lookup: {
							from: "states",
							localField: "stateId",
							foreignField: "_id",
							as: "state"
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
						$project: {
							_id: 1,
							promoter: { $arrayElemAt: ["$promoter.name", 0] },
							name: 1,
							street: 1,
							city: 1,
							state: { $arrayElemAt: ["$state.name", 0] },
							zipCode: 1,
							// email: 1,
							stateIds: "$states.name",
							regionIds: "$regions.name",
							industry: { $arrayElemAt: ["$industry.name", 0] },
							phone: 1,
							// position: 1,
							status: 1,
							contactName: 1,
							// contactEmail: 1,
							// contactPassword: 1,
							// merchantText: 1,
							notes: 1,
							website: 1,
							// revenue: 1,
							// emailRemainingTimes: 1,
							// communicationEmail: 1,
							// language: 1,
							active: 1,
							// isDeleted: 1,
						},
					}
				]).toArray(),
				this.collections.merchants.aggregate(req.dbPagination).toArray(),
			]);
			return this.json(req, res, 200, { data, count: count });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public get = async (req: Request, res: Response): Promise<Response> => {
		try {
			// const { id } = req.params;
			// const defaultFilter = { _id: new ObjectId(id) };
			// const merchant = await this.collections.merchants.findOne(defaultFilter, {
			// 	projection: {
			// 		_id: 1,
			// 		promoterId: 1,
			// 		name: 1,
			// 		street: 1,
			// 		city: 1,
			// 		stateId: 1,
			// 		zipCode: 1,
			// 		email: 1,
			// 		stateIds: 1,
			// 		regionIds: 1,
			// 		industryId: 1,
			// 		phone: 1,
			// 		position: 1,
			// 		status: 1,
			// 		contactName: 1,
			// 		contactEmail: 1,
			// 		contactPassword: 1,
			// 		merchantText: 1,
			// 		notes: 1,
			// 		website: 1,
			// 		revenue: 1,
			// 		emailRemainingTimes: 1,
			// 		communicationEmail: 1,
			// 		language: 1,
			// 		active: 1,
			// 		// isDeleted: 1,
			// 	}
			// });
			// if (merchant) {
			// 	return this.json(req, res, 200, { data: merchant });
			// }
			let result;
			const { id } = req.params;
			const defaultFilter = { _id: new ObjectId(id) };
			this.getAggrigation(req, this.filter_options, defaultFilter);
			result = await this.collections.merchants.aggregate([
				...req.aggregations,
				{
					$lookup: {
						from: "users",
						localField: "promoterId",
						foreignField: "_id",
						as: "promoter"
					}
				},
				{
					$lookup: {
						from: "industries",
						localField: "industryId",
						foreignField: "_id",
						as: "industry"
					}
				},
				{
					$lookup: {
						from: "states",
						localField: "stateId",
						foreignField: "_id",
						as: "state"
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
					$project: {
						_id: 1,
						promoterId: 1,
						name: 1,
						street: 1,
						city: 1,
						stateId: 1,
						zipCode: 1,
						email: 1,
						stateIds: 1,
						regionIds: 1,
						industryId: 1,
						phone: 1,
						position: 1,
						status: 1,
						contactName: 1,
						contactEmail: 1,
						contactPassword: 1,
						merchantText: 1,
						notes: 1,
						website: 1,
						revenue: 1,
						emailRemainingTimes: 1,
						communicationEmail: 1,
						language: 1,
						active: 1,
						promoter: { $arrayElemAt: ["$promoter.name", 0] },
						state: { $arrayElemAt: ["$state.name", 0] },
						industry: { $arrayElemAt: ["$industry.name", 0] },
						states: "$states.name",
						regions: "$regions.name",
					},
				}
			]).toArray(),
				result = result[0]
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public createOrUpdate = async (req: Request, res: Response): Promise<Response> => {
		try {
			const allStates: any[] = [];
			const allRegions: any[] = [];
			const { id } = req.params;
			const Validationrules = {
				promoterId: global["config"].commonRules.id,
				name: global["config"].commonRules.name,
				street: global["config"].commonRules.name,
				city: global["config"].commonRules.name,
				stateId: global["config"].commonRules.id,
				zipCode: 'required',
				email: global["config"].commonRules.email,
				stateIds: global["config"].commonRules.name,
				regionIds: global["config"].commonRules.name,
				industryId: global["config"].commonRules.id,
				phone: global["config"].commonRules.phone,
				position: global["config"].commonRules.name,
				status: global["config"].commonRules.name,
				contactName: global["config"].commonRules.name,
				contactEmail: global["config"].commonRules.email,
				contactPassword: global["config"].commonRules.password,
				merchantText: global["config"].commonRules.message,
				notes: global["config"].commonRules.message,
				website: global["config"].commonRules.url,
				revenue: 'required',
				emailRemainingTimes: "required",
				communicationEmail: global["config"].commonRules.email,
				active: "required"
			};
			// console.log(req.body)
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = this.getFormFields(req.body, Validationrules);
			const states = FormBody.stateIds
			states.forEach(el => {
				allStates.push(new ObjectId(el))
			});
			const regions = FormBody.regionIds
			regions.forEach(el => {
				allRegions.push(new ObjectId(el))
			});
			FormBody.promoterId = new ObjectId(FormBody.promoterId);
			FormBody.stateId = new ObjectId(FormBody.stateId);
			FormBody.industryId = new ObjectId(FormBody.industryId);
			FormBody.stateIds = allStates;
			FormBody.regionIds = allRegions;

			FormBody.isDeleted = false
			if (!formErrors) {
				if (id) {
					const addFields = { modifiedAt: this.d }
					await this.collections.merchants.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody, ...addFields } });
				} else {
					const addFields = { createdAt: this.d, modifiedAt: this.d, createdBy: new ObjectId(req.user._id) }
					await this.collections.merchants.insertOne({ ...FormBody, ...addFields });
				}
				return this.json(req, res, 200, { message: `Merchant ${(id) ? 'Updated' : 'Created'} Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, formErrors);
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public delete = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			if (id) {
				await this.collections.merchants.updateOne({ _id: new ObjectId(id) }, { $set: { isDeleted: true } });
				return this.json(req, res, 200, { message: `Merchant Deleted Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, 'delete');
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

}