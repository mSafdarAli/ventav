import { ObjectId } from "mongodb";
import { BaseController } from "../../../core";
import { Filter_Options, Request, Response } from '../../../__types';
import { uploadImages } from "../../../helpers/image";
import config from "../../../config/config";
import Utility from "../../../helpers/utility";

export default class IndustryController extends BaseController {
	public __component: string = "industries";
	private d: Date = new Date();
	private filter_options: Filter_Options = {
		search: ["name"],
		defaultSort: "_id",
		filters: {},
	};
	public list = async (req: Request, res: Response): Promise<Response> => {
		try {
			const defaultFilter = { $or: [{ isDeleted: { $eq: null } }, { isDeleted: { $ne: true } }] };
			this.getAggrigation(req, this.filter_options, defaultFilter);
			const [data, count] = await Promise.all([
				this.collections.industries.aggregate([
					...req.aggregations,
					{
						$project: {
							_id: 1,
							name: 1,
							active: 1
						},
					}
				]).toArray(),
				this.collections.industries.aggregate(req.dbPagination).toArray(),
			]);
			return this.json(req, res, 200, { data, count: count });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public get = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			const defaultFilter = { _id: new ObjectId(id) };
			const industry = await this.collections.industries.findOne(defaultFilter, {
				projection: {
					_id: 1,
					name: 1,
					redumptionSuccessMessage: 1,
					redumptionAlreadyMessage: 1,
					dealPageImages: 1,
					ticketImage: 1,
					ticketText: 1,
					imageText: 1,
					questions:1,
					buttonColorCode:1,
					textColorCode:1,
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
	public createOrUpdate = async (req: Request, res: Response): Promise<Response> => {
		try {
			const questions:any[]=[];
			const { id } = req.params;
			const Validationrules = {
				name: global["config"].commonRules.name,
				redumptionSuccessMessage: global["config"].commonRules.name,
				redumptionAlreadyMessage: global["config"].commonRules.name,
				ticketText: global["config"].commonRules.name,
				imageText: global["config"].commonRules.name,
				active: 'required'
			};
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = req.body;
			FormBody.questions = FormBody.questions.map(obj => {
				return JSON.parse(obj);
			});
			FormBody.isDeleted = false
			// FormBody.active = (FormBody.active == 'true') ? true : false
			if (!formErrors) {
				if (req.files != null && req.files != undefined && Object.keys(req.files).length > 0) {
					const filesArray = req.files;
					if (id) {
						if (config.production) {
							const existingImages = await this.collections.industries?.findOne(
								{ _id: new ObjectId(id) }
							);
							if (existingImages) {
								if (filesArray["ticketImage"]) {
									const images = await uploadImages(filesArray["ticketImage"], 'Ticket Images', existingImages.ticketImage)
									FormBody['ticketImage'] = images;
								}
								if (filesArray["dealPageImages"]) {
									const images = await uploadImages(filesArray["dealPageImages"], 'Deal Page Images', existingImages.dealPageImages)
									FormBody['dealPageImages'] = images;
								}
							}
						} else {
							const img = new Utility();
							if (filesArray["ticketImage"]) {
								const images = await img.uploadFiles(filesArray["ticketImage"], ['png', 'jpg', 'jpeg'], "ticketImage/")
								FormBody['ticketImage'] = images;
							}
							if (filesArray["dealPageImages"]) {
								const images = await img.uploadFiles(filesArray["dealPageImages"], ['png', 'jpg', 'jpeg'], "dealPageImages/")
								FormBody['dealPageImages'] = images;
							}
						}
					} else {
						if (config.production) {
							if (filesArray["ticketImage"]) {
								const images = await uploadImages(filesArray["ticketImage"], 'Ticket Images')
								FormBody['ticketImage'] = images;
							}
							if (filesArray["dealPageImages"]) {
								const images = await uploadImages(filesArray["dealPageImages"], 'Deal Page Images')
								FormBody['dealPageImages'] = images;
							}
						} else {
							const img = new Utility();
							if (filesArray["ticketImage"]) {
								const images = await img.uploadFiles(filesArray["ticketImage"], ['png', 'jpg', 'jpeg'], "ticketImage/")
								FormBody['ticketImage'] = images;
							}
							if (filesArray["dealPageImages"]) {
								const images = await img.uploadFiles(filesArray["dealPageImages"], ['png', 'jpg', 'jpeg'], "dealPageImages/")
								FormBody['dealPageImages'] = images;
							}
						}
					}
				}
				if (id) {
					console.log(this.d)
					const addFields = { modifiedAt: this.d}
					await this.collections.industries.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody, ...addFields } });
				} else {
					const addFields = { createdAt: this.d, modifiedAt: this.d, createdBy: new ObjectId(req.user._id) }
					await this.collections.industries.insertOne({ ...FormBody, ...addFields });
				}
				return this.json(req, res, 200, { message: `Industry ${(id) ? 'Updated' : 'Created'} Successfully` });
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
				await this.collections.industries.updateOne({ _id: new ObjectId(id) }, { $set: { isDeleted: true } });
				return this.json(req, res, 200, { message: `Industry Deleted Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, 'delete');
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

}