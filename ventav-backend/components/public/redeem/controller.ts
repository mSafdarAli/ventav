import { ObjectId } from "mongodb";
import { BaseController } from "../../../core";
import { Request, Response } from '../../../__types';
import Utility from "../../../helpers/utility";


export default class RedeemController extends BaseController {
	public __component: string = "redeem";

	public getIndustry = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			const defaultFilter = { _id: new ObjectId(id) };
			const industry = await this.collections.industries.findOne(defaultFilter, {
				projection: {
					_id: 1,
					redumptionSuccessMessage: 1,
					redumptionAlreadyMessage: 1,
					questions: 1,
					buttonColorCode: 1,
					textColorCode: 1,
					active: 1
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

	public getStatesAndRegions = async (req: Request, res: Response): Promise<Response> => {
		try {
			const stateData: any[] = [];
			const regionData: any[] = [];
			const Validationrules = {
				redemptionCode: global["config"].commonRules.name,
			};
			const formErrors = await this.validateForm(req.body, Validationrules);
			const { redemptionCode } = req.body;
			if (!formErrors) {
				const result = await this.collections.coupons.aggregate([
					{
						$match: { couponCode: redemptionCode }
					},
					{
						$lookup: {
							from: 'deals',
							as: 'deal',
							let: { id: "$dealId" },
							pipeline: [
								{
									$match: {
										$expr: { $eq: ["$_id", "$$id"] },
									},
								},
								{
									$lookup: {
										from: 'states',
										localField: "stateIds",
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
					{
						$project: {
							states: { $arrayElemAt: ["$deal.st", 0] },
							regions: { $arrayElemAt: ["$deal.r", 0] }
						}
					}
				]).toArray();
				if (result) {
					result.forEach((el, i) => {
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
				}
				return this.json(req, res, 200, { data: { states: stateData, regions: regionData } });
			} else {
				return this.jsonError(res, 400, this.__component, formErrors);
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public redeem = async (req: Request, res: Response): Promise<Response> => {
		try {
			let d = new Date();
			const tickets:any[]=[];
			const stateIds:any[]=[];
			const regionIds:any[]=[];
			const Validationrules = {
				redemptionCode: global["config"].commonRules.name,
				email: global["config"].commonRules.email,
				zipCode: 'required',
			};
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = req.body;
			if (FormBody.stateIds.length>0){
				FormBody.stateIds.forEach(el => {
					stateIds.push(new ObjectId(el))
				});
			}
			if (FormBody.regionIds.length > 0) {
				FormBody.regionIds.forEach(el => {
					regionIds.push(new ObjectId(el))
				});
			}
			if (!formErrors) {
				let coupon = await this.collections.coupons.findOne({ couponCode: FormBody.redemptionCode });
				if (coupon) {
					if (coupon.redeemOnline == false) {
						FormBody.redeemOnline = true;
						delete FormBody.redemptionCode
						FormBody.stateIds = stateIds;
						FormBody.regionIds = regionIds;
						const result = await this.collections.coupons.updateOne({ _id: coupon._id }, { $set: { ...FormBody } });
						if (result) {
							const generate = new Utility();
							const industry = await this.collections.deals.findOne({ _id: coupon.dealId }, {
								projection: {
									industryDetails: 1
								}
							})
							if (industry) {
								industry.industryDetails.forEach(el => {
									for (let i = 0; i < el.quantity; i++) {
										const code = generate.randomString(16)
										if (code) {
											tickets.push({ couponId: coupon?._id, couponCode: coupon?.couponCode, ticketNumber: code, industryId: el.industryId, dealId: coupon?.dealId, isDeleted: false, redeemOnline:false, redeemDate:null, merchantId:null, createdAt: d, modifiedAt: d })
										}
									}

								});
							}
							await this.collections.tickets.insertMany(tickets);
							const user = await this.collections.users.findOne({ email: FormBody.email });
							if (!user) {
								const customerRoleId = await this.collections.roles.findOne({ name: "Customer" }, { projection: { _id: 1 } });
								if (customerRoleId) {
									await this.collections.users.insertOne({ _id: new ObjectId(), name: FormBody.name, email: FormBody.email, dob: FormBody.dob, zipCode: FormBody.zipCode, roleId: customerRoleId._id, active: false, isDeleted: false, modifiedAt: d, createdAt: d })
								}
							}
						}
					}
					else {
						return this.json(req, res, 200, { data: { success: false, message: `Coupon Already Redeemed` } });
					}
				}
				return this.json(req, res, 200, { data: { success: true, message: `Coupon Redeemed Successfully` } });
			} else {
				return this.jsonError(res, 400, this.__component, formErrors);
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};



}