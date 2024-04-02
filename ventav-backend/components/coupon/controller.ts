import { ObjectId } from "mongodb";
import { BaseController } from "../../core";
import { Filter_Options, Request, Response } from '../../__types';
import IdGenerater from "../../helpers/generateId";

export default class DealController extends BaseController {
	public __component: string = "coupons";
	private d: Date = new Date();
	private filter_options: Filter_Options = {
		search: ["couponCode", "name", "email"],
		defaultSort: "_id",
		filters: {
			dealId: { type: "objectId", filter: "$in" },
			redeemOnline: { type: "boolean", filter: "$eq" },
			// firmId: { type: "objectId", filter: "$in" },
		},
	};

	public list = async (req: Request, res: Response): Promise<Response> => {
		try {
			const defaultFilter = { isDeleted: false };
			this.getAggrigation(req, this.filter_options, defaultFilter);
			const [data, count] = await Promise.all([
				this.collections.coupons.aggregate([
					{
						$lookup: {
							from: "deals",
							localField: "dealId",
							foreignField: "_id",
							as: "deal"
						}
					},
					{
						$unwind: "$deal"
					},
					{
						$lookup: {
							from: "firms",
							localField: "deal.firmId",
							foreignField: "_id",
							as: "deal.firm"
						}
					},
					...req.aggregations,
					{
						$project: {
							_id: 1,
							couponCode: 1,
							deal: "$deal.dealName",
							firm: { $arrayElemAt: ["$deal.firm.companyName", 0] },
							redeemOnline: 1,
							name: 1,
							createdAt: 1,
							email: 1
						}
					}
				]).toArray(),
				this.collections.coupons.aggregate(req.dbPagination).toArray(),
			]);
			return this.json(req, res, 200, { data, count: count });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	// public get = async (req: Request, res: Response): Promise<Response> => {
	// 	try {
	// 		let result;
	// 		const { id } = req.params;
	// 		const defaultFilter = { _id: new ObjectId(id) };
	// 		this.getAggrigation(req, this.filter_options, defaultFilter);
	// 		result = await this.collections.coupons.aggregate([
	// 			...req.aggregations,
	// 		]).toArray(),
	// 			result = result[0]
	// 		return this.json(req, res, 200, { data: result });
	// 	} catch (error) {
	// 		return this.jsonError(res, 500, this.__component, "invalid", error);
	// 	}
	// };
	public createOrUpdate = async (req: Request, res: Response): Promise<Response> => {
		try {
			let coupons: any[] = []
			const { id } = req.params;
			const Validationrules = {
				dealId: global["config"].commonRules.id,
				noOfCoupons: "required",
				alphanumeric: "required"
			};
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = req.body;
			if (!formErrors) {
				const generate = new IdGenerater();
				for (let i = 0; i < FormBody.noOfCoupons; i++) {
					const code = await generate.coupons(FormBody.firstLetter, FormBody.codeLength, FormBody.alphanumeric)
					coupons.push({
						couponCode: (FormBody.firstLetter) ? FormBody.firstLetter + code : code, dealId: new ObjectId(FormBody.dealId), isDeleted: false, redeemOnline: false, email: null, name: null, dob: null, survey: null, zipCode: null, stateIds: null, regionIds: null, createdAt: this.d, modifiedAt: this.d, createdBy: new ObjectId(req.user._id)
					})
				}
				await this.collections.coupons.insertMany(coupons);
				return this.json(req, res, 200, { message: `Coupons ${(id) ? 'Updated' : 'Created'} Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, formErrors);
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public updateEmail = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			const Validationrules = {
				email: global["config"].commonRules.email,
			};
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = await this.getFormFields(req.body, Validationrules);
			if (!formErrors) {
				await this.collections.coupons?.updateOne({ _id: new ObjectId(id) }, { $set: { email: FormBody.email, modifiedAt: this.d } })
				return this.json(req, res, 200, { message: "Email Updated Successfully" });
			} else {
				return this.jsonError(res, 400, this.__component, formErrors);
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "wrong", error);
		}
	}
	public exportCoupons = async (req: Request, res: Response): Promise<Response> => {
		try {
			const Validationrules = {
				dealId: global["config"].commonRules.id,
				date: global["config"].commonRules.date,
			};
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = req.body;
			if (!formErrors) {
				const result = await this.collections.coupons.find({ dealId: new ObjectId(FormBody.dealId), createdAt: { $gt: new Date(FormBody.date) } }, { projection: { couponCode: 1 } }).sort({ _id: -1 }).toArray()
				return this.json(req, res, 200, { data: result });
			} else {
				return this.jsonError(res, 400, this.__component, formErrors);
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "wrong", error);
		}
	}
	public delete = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			if (id) {
				await this.collections.coupons.updateOne({ _id: new ObjectId(id) }, { $set: { isDeleted: true } });
				return this.json(req, res, 200, { message: `Coupon Deleted Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, 'delete');
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
}