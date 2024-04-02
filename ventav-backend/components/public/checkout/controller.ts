import { ObjectId } from "mongodb";
import { BaseController } from "../../../core";
import { Request, Response } from '../../../__types';


export default class CheckoutController extends BaseController {
	public __component: string = "checkout";

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
	public getDeal = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			const defaultFilter = { _id: new ObjectId(id) };
			const industry = await this.collections.deals.findOne(defaultFilter, {
				projection: {
					_id: 1,
					checkoutLogo: 1,
					checkoutText: 1,
					buttonColorCode: 1,
					bannerColorCode: 1,
					textColorCode: 1,
					customerPrice:1,
					discountCodes:1
				}
			});
			if (industry) {
				return this.json(req, res, 200, { data: industry });
			}
			return this.jsonError(res, 400, this.__component, "get");
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public checkout = async (req: Request, res: Response): Promise<Response> => {
		try {
			return this.json(req, res, 200, { data: { success: true, message: `Coupon Redeemed Successfully` } });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};



}