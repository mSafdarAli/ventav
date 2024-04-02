import { ObjectId } from "mongodb";
import { BaseController } from "../../../core";
import { Request, Response } from '../../../__types';


export default class RedeemController extends BaseController {
	public __component: string = "redeem-tickets";

	public getLocations = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { industryId } = req.params;
			const { couponId } = req.query;
			const redeemRegions = await this.collections.coupons.findOne({ couponCode: couponId }, { projection: { regionIds: 1 } });
			const result = await this.collections.merchants.aggregate([
				{
					$match: {
						industryId: new ObjectId(industryId),
						regionIds: { $in: redeemRegions?.regionIds },
						isDeleted: false,
						active: true
					}
				},
				{
					$project: {
						name: 1,
						value: "$_id"
					}
				}
			]).toArray();
			return this.json(req, res, 200, { data: result });
		}
		catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public getTickets = async (req: Request, res: Response): Promise<Response> => {
		try {
			let industry;
			let locations: any[] = [];
			const { couponId, industryId } = req.query;
			if (industryId) {
				const redeemRegions = await this.collections.coupons.findOne({ couponCode: couponId }, { projection: { regionIds: 1 } });
				industry = await this.collections.industries.findOne({ _id: new ObjectId(industryId.toString()) }, { projection: { ticketImage: 1, ticketText: 1, imageText: 1 } });
				locations = await this.collections.merchants.aggregate([
					{
						$match: {
							industryId: new ObjectId(industryId.toString()),
							regionIds: { $in: redeemRegions?.regionIds },
							isDeleted: false,
							active: true
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
						$project: {
							street: 1,
							city: 1,
							name: 1,
							state: { $arrayElemAt: ["$state.name", 0] },
							zipCode: 1,
							merchantText: 1,
							phone: 1,
							website: 1,
						}
					}
				]).toArray();
				const tickets = await this.collections.tickets.aggregate([
					{
						$match: {
							couponCode: couponId,
							industryId: new ObjectId(industryId?.toString())
						}
					},
					{
						$lookup: {
							from: "coupons",
							localField: "couponId",
							foreignField: "_id",
							as: "coupons"
						}
					},
					{
						$lookup: {
							from: "merchants",
							localField: "merchantId",
							foreignField: "_id",
							as: "merchant"
						}
					},
					{
						$project: {
							_id: 1,
							name: { $arrayElemAt: ["$coupons.name", 0] },
							ticketNumber: 1,
							couponCode: 1,
							redeemOnline: 1,
							redeemDate: 1,
							location: { $arrayElemAt: ["$merchant.name", 0] }
						},
					}
				]).toArray()
				return this.json(req, res, 200, { data: { tickets: tickets, industry: industry, locations: locations } });
			} else {
				return this.jsonError(res, 400, this.__component, "Invalid Url");
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "Invalid", error);
		}
	};
	public redeemTickets = async (req: Request, res: Response): Promise<Response> => {
		try {
			const d = new Date();
			const Validationrules = {
				quantity: 'required',
				merchantId: global["config"].commonRules.id,
				couponCode: 'required',
				industryId: global["config"].commonRules.id,
			};
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = this.getFormFields(req.body, Validationrules);
			if (!formErrors) {
				const tickets = await this.collections.tickets.find({ couponCode: FormBody.couponCode, industryId: new ObjectId(FormBody.industryId), redeemOnline: false }).toArray();
				if (tickets.length > 0) {
					for (let i = 0; i < FormBody.quantity; i++) {
						await this.collections.tickets.updateOne({ _id: tickets[i]._id }, { $set: { redeemOnline: true, merchantId: new ObjectId(FormBody.merchantId), redeemDate: d } });
					}
				}
				return this.json(req, res, 200, { message: `Ticket Redeemed Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, formErrors);
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

}