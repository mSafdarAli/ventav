import { ObjectId } from "mongodb";
import { BaseController } from "../../core";
import { Filter_Options, Request, Response } from '../../__types';

export default class DealController extends BaseController {
	public __component: string = "tickets";
	private filter_options: Filter_Options = {
		search: ["couponCode", "ticketNumber", "deal.dealName", "deal.firm.companyName"],
		defaultSort: "_id",
		filters: {
			redeemOnline: { type: "boolean", filter: "$eq" },
			industryId: { type: "objectId", filter: "$in" },
			dealId: { type: "objectId", filter: "$in" },
			createdAt__gte: { type: "date", filter: "$gte" },
			createdAt__lte: { type: "date", filter: "$lte" },
		},
	};

	public list = async (req: Request, res: Response): Promise<Response> => {
		try {
			const defaultFilter = { isDeleted: false };
			this.getAggrigation(req, this.filter_options, defaultFilter);
			const [data, count] = await Promise.all([
				this.collections.tickets.aggregate([
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
							from: "coupons",
							localField: "couponId",
							foreignField: "_id",
							as: "redeemed"
						}
					},
					// {
					// 	$lookup: {
					// 		from: "merchants",
					// 		localField: "merchantId",
					// 		foreignField: "_id",
					// 		as: "merchant"
					// 	}
					// },
					{
						$lookup: {
							from: 'merchants',
							as: 'merchant',
							let: { id: "$merchantId" },
							pipeline: [
								{
									$match: {
										$expr: { $eq: ["$_id", "$$id"] },
									},
								},
								{
									$lookup: {
										from: 'states',
										localField: "stateId",
										foreignField: "_id",
										as: 'st'
									}
								},
								{
									$lookup: {
										from: 'regions',
										localField: "regionIds",
										foreignField: "_id",
										as: 'r'
									}
								},
							]
						}
					},
					...req.aggregations,
					{
						$project: {
							_id: 1,
							couponCode: 1,
							ticketNumber: 1,
							createdAt: 1,
							redeemOnline:1,
							deal: "$deal.dealName",
							name: { $arrayElemAt: ["$redeemed.name", 0] },
							firm: { $arrayElemAt: ["$deal.firm.companyName", 0] },
							industry: { $arrayElemAt: ["$industry.name", 0] },
							merchant: { $arrayElemAt: ["$merchant.name", 0] },
							street: { $arrayElemAt: ["$merchant.street", 0] },
							city: { $arrayElemAt: ["$merchant.city", 0] },
							state: { $arrayElemAt: ["$merchant.st.name", 0] },
							zipCode: { $arrayElemAt: ["$merchant.zipCode", 0] }
						}
					}
				]).toArray(),
				this.collections.tickets.aggregate(req.dbPagination).toArray(),
			]);
			return this.json(req, res, 200, { data, count: count });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	
	
	public delete = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			if (id) {
				await this.collections.tickets.updateOne({ _id: new ObjectId(id) }, { $set: { isDeleted: true } });
				return this.json(req, res, 200, { message: `Ticket Deleted Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, 'delete');
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
}