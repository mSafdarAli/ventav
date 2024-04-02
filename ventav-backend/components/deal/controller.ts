import { ObjectId } from "mongodb";
import { BaseController } from "../../core";
import { Filter_Options, Request, Response } from '../../__types';
import { uploadImages } from "../../helpers/image";
import config from "../../config/config";
import Utility from "../../helpers/utility";
import IdGenerater from "../../helpers/generateId";

export default class DealController extends BaseController {
	public __component: string = "deals";
	private d: Date = new Date();
	private filter_options: Filter_Options = {
		search: ["dealName", "dealNumber"],
		defaultSort: "_id",
		filters: {
			promoterIds: { type: "objectId", filter: "$in" },
			industryIds: { type: "objectId", filter: "$in" },
			firmId: { type: "objectId", filter: "$in" },
		},
	};
	public generateId = async (req: Request, res: Response): Promise<Response> => {
		try {
			const generate = new IdGenerater()
			const dealId = await generate.dealId();
			return this.json(req, res, 200, { data: dealId });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public list = async (req: Request, res: Response): Promise<Response> => {
		try {
			const defaultFilter = { isDeleted: false };
			this.getAggrigation(req, this.filter_options, defaultFilter);
			const [data, count] = await Promise.all([
				this.collections.deals.aggregate([
					...req.aggregations,
					{
						$lookup: {
							from: "coupons",
							localField: "_id",
							foreignField: "dealId",
							as: "coupons"
						}
					},
					{
						$addFields: {
							redeemedOnline: {
								$size: {
									$filter: {
										input: { $ifNull: ["$coupons", []] },
										cond: "$$this.redeemOnline"
									}
								}
							}
						}
					},
					// {
					// 	$lookup: {
					// 		from: "industries",
					// 		localField: "industryId",
					// 		foreignField: "_id",
					// 		as: "industry"
					// 	}
					// },
					// {
					// 	$lookup: {
					// 		from: "states",
					// 		localField: "stateIds",
					// 		foreignField: "_id",
					// 		as: "states"
					// 	}
					// },
					// {
					// 	$lookup: {
					// 		from: "regions",
					// 		localField: "regionIds",
					// 		foreignField: "_id",
					// 		as: "regions"
					// 	}
					// },
					// {
					// 	$lookup: {
					// 		from: "merchants",
					// 		localField: "merchantIds",
					// 		foreignField: "_id",
					// 		as: "merchants"
					// 	}
					// },
					{
						$lookup: {
							from: "firms",
							localField: "firmId",
							foreignField: "_id",
							as: "firm"
						}
					},
					{
						$project: {
							_id: 1,
							firm: { $arrayElemAt: ["$firm.companyName", 0] },
							dealName: 1,
							dealNumber: 1,
							dealSiteLink: 1,
							offerStartDate: 1,
							offerEndDate: 1,
							couponExpiryDate: 1,
							inHouseDeal: 1,
							generatedCoupons: { $size: "$coupons" },
							redeemedOnline: 1,
							active: 1
						}
					}

				]).toArray(),
				this.collections.deals.aggregate(req.dbPagination).toArray(),
			]);
			return this.json(req, res, 200, { data, count: count });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public get = async (req: Request, res: Response): Promise<Response> => {
		try {
			let result;
			const { id } = req.params;
			const defaultFilter = { _id: new ObjectId(id) };
			this.getAggrigation(req, this.filter_options, defaultFilter);
			result = await this.collections.deals.aggregate([
				...req.aggregations,
				{
					$lookup: {
						from: "users",
						localField: "promoterIds",
						foreignField: "_id",
						as: "promoter"
					}
				},
				{
					$lookup: {
						from: "industries",
						localField: "industryIds",
						foreignField: "_id",
						as: "industry"
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
						from: "merchants",
						localField: "merchantIds",
						foreignField: "_id",
						as: "merchants"
					}
				},
				{
					$lookup: {
						from: "firms",
						localField: "firmId",
						foreignField: "_id",
						as: "firm"
					}
				},
				{
					$project: {
						_id: 1,
						dealName: 1,
						dealNumber: 1,
						publicDealName: 1,
						dealSiteLink: 1,
						dealSpecificEmail: 1,
						offerStartDate: 1,
						offerEndDate: 1,
						couponExpiryDate: 1,
						hideExpiryDate: 1,
						inHouseDeal: 1,
						startNotification: 1,
						customerPrice: 1,
						charity: 1,
						representative: 1,
						discount: 1,
						templateId: 1,
						dailyFirmPortion: 1,
						emailCC: 1,
						sortBy: 1,
						discountCodes: 1,
						firmId: 1,
						firm: { $arrayElemAt: ["$firm.companyName", 0] },
						promoterIds: 1,
						promoters: "$promoter.name",
						promoterPortionDetails: 1,
						industryIds: 1,
						industries: "$industry.name",
						industryDetails: 1,
						merchantIds: 1,
						merchants: "$merchants.name",
						regionIds: 1,
						regions: "$regions.name",
						stateIds: 1,
						states: "$states.name",
						checkoutLogo: 1,
						checkoutText: 1,
						buttonColorCode: 1,
						bannerColorCode: 1,
						textColorCode: 1,
						active: 1,

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
			const allPromoters: any[] = [];
			const allStates: any[] = [];
			const allRegions: any[] = [];
			const allIndustries: any[] = [];
			const allMerchants: any[] = [];
			const { id } = req.params;
			const Validationrules = {
				promoterIds: global["config"].commonRules.id,
				dealNumber: "required",
				dealName: global["config"].commonRules.name,
				publicDealName: global["config"].commonRules.name,
				firmId: global["config"].commonRules.id,
				dealSiteLink: global["config"].commonRules.url,
				offerStartDate: global["config"].commonRules.date,
				offerEndDate: global["config"].commonRules.date,
				couponExpiryDate: global["config"].commonRules.date,
				customerPrice: "required",
				dailyFirmPortion: "required",
				charity: "required",
				representative: global["config"].commonRules.name,
				discount: "required",
				industryIds: global["config"].commonRules.id,
				stateIds: global["config"].commonRules.id,
				regionIds: global["config"].commonRules.id,
				merchantIds: global["config"].commonRules.id,
				industryDetails: 'required',
				promoterPortionDetails: 'required',
				hideExpiryDate: "required",
				dealSpecificEmail: "required",
				startNotification: "required",
				inHouseDeal: "required",
				sortBy: global["config"].commonRules.name,
				emailCC: global["config"].commonRules.email,
				active: "required",
			};
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = req.body;
			const promoters = FormBody.promoterIds;
			promoters.forEach(el => {
				allPromoters.push(new ObjectId(el))
			});
			const states = FormBody.stateIds;
			states.forEach(el => {
				allStates.push(new ObjectId(el))
			});
			const regions = FormBody.regionIds;
			regions.forEach(el => {
				allRegions.push(new ObjectId(el))
			});
			const industries = FormBody.industryIds;
			industries.forEach(el => {
				allIndustries.push(new ObjectId(el))
			});
			const merchants = FormBody.merchantIds;
			merchants.forEach(el => {
				allMerchants.push(new ObjectId(el))
			});
			FormBody.industryDetails = FormBody.industryDetails.map(obj => {
				const el = JSON.parse(obj);
				return { ...el, industryId: new ObjectId(el.industryId) }
			});
			FormBody.promoterPortionDetails = FormBody.promoterPortionDetails.map(obj => {
				const el = JSON.parse(obj);
				return { ...el, promoterId: new ObjectId(el.promoterId) }
			});
			FormBody.discountCodes = FormBody.discountCodes.map(obj => {
				return JSON.parse(obj);
			});

			FormBody.firmId = new ObjectId(FormBody.firmId);
			FormBody.stateIds = allStates;
			FormBody.regionIds = allRegions;
			FormBody.merchantIds = allMerchants;
			FormBody.industryIds = allIndustries;
			FormBody.promoterIds = allPromoters;
			FormBody.hideExpiryDate = JSON.parse(FormBody.hideExpiryDate);
			FormBody.dealSpecificEmail = JSON.parse(FormBody.dealSpecificEmail);
			FormBody.startNotification = JSON.parse(FormBody.startNotification);
			FormBody.inHouseDeal = JSON.parse(FormBody.inHouseDeal);
			FormBody.active = JSON.parse(FormBody.active);
			FormBody.discount = JSON.parse(FormBody.discount);
			FormBody.charity = JSON.parse(FormBody.charity);
			FormBody.customerPrice = JSON.parse(FormBody.customerPrice);
			FormBody.dailyFirmPortion = JSON.parse(FormBody.dailyFirmPortion);
			FormBody.isDeleted = false;
			// console.log(FormBody);
			if (!formErrors) {
				if (req.files != null && req.files != undefined && Object.keys(req.files).length > 0) {
					const filesArray = req.files;
					if (id) {
						if (config.production) {
							const existingImages = await this.collections.deals?.findOne(
								{ _id: new ObjectId(id) }
							);
							if (existingImages) {
								if (filesArray["checkoutLogo"]) {
									const images = await uploadImages(filesArray["checkoutLogo"], 'Ticket Images', [])
									FormBody['checkoutLogo'] = images;
								}
							}
						} else {
							const img = new Utility();
							if (filesArray["checkoutLogo"]) {
								const images = await img.uploadFiles(filesArray["checkoutLogo"], ['png', 'jpg', 'jpeg'], "checkoutLogo/")
								FormBody['checkoutLogo'] = images;
							}
						}
					} else {
						if (config.production) {
							if (filesArray["checkoutLogo"]) {
								const images = await uploadImages(filesArray["checkoutLogo"], 'Ticket Images')
								FormBody['checkoutLogo'] = images;
							}
						} else {
							const img = new Utility();
							if (filesArray["checkoutLogo"]) {
								const images = await img.uploadFiles(filesArray["checkoutLogo"], ['png', 'jpg', 'jpeg'], "checkoutLogo/")
								FormBody['checkoutLogo'] = images;
							}
						}
					}
				}
				if (id) {
					const addFields = { modifiedAt: this.d }
					await this.collections.deals.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody, ...addFields } });
				} else {
					const addFields = { createdAt: this.d, modifiedAt: this.d, createdBy: new ObjectId(req.user._id) }
					await this.collections.deals.insertOne({ ...FormBody, ...addFields });
				}
				return this.json(req, res, 200, { message: `Deal ${(id) ? 'Updated' : 'Created'} Successfully` });
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
				await this.collections.deals.updateOne({ _id: new ObjectId(id) }, { $set: { isDeleted: true } });
				return this.json(req, res, 200, { message: `Deal Deleted Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, 'delete');
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public changeStatus = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			const FormBody = req.body;
			await this.collections.deals?.updateOne({ _id: new ObjectId(id) }, { $set: { active: FormBody.active } });
			return this.json(req, res, 200, { message: `Deal ${(FormBody.active == true) ? 'Activated' : 'Deactivated'} Successfully` });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "wrong", error);
		}
	}

}