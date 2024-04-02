
import { ObjectId } from 'mongodb';
import { BaseController } from '../../../core/BaseController';
import { Filter_Options, Request, Response } from '../../../__types';

export default class EmailController extends BaseController {
	public __component: string = "emailTemplate";
	private d: Date = new Date();
	private filter_options: Filter_Options = {
		search: ["name",],
		defaultSort: "_id",
		filters: {},
	};

	public get = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			const defaultFilter = { _id: new ObjectId(id) };
			const emailTemplate = await this.collections.templateDetails.findOne(defaultFilter, {
				projection: {
					_id: 1,
					used_for: 1,
					name: 1,
					subject: 1,
					message: 1,
					active: 1,
					fields: 1,
					mailFrom: 1
				}
			});
			if (emailTemplate) {
				return this.json(req, res, 200, { data: emailTemplate });
			}
			return this.jsonError(res, 400, this.__component, "get");
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "wrong", error);
		}
	}

	public list = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			const defaultFilter = { isDeleted: false };
			if (id != "undefined") {
				defaultFilter['templateId'] = new ObjectId(id);
				// defaultFilter['createdBy'] = new ObjectId(req.user._id);
				// if (req.user.role?.name == 'Promoter') {
				// 	defaultFilter['promoterId'] = new ObjectId(req.user._id)
				// }
				this.getAggrigation(req, this.filter_options, defaultFilter);
				const [data, count] = await Promise.all([
					this.collections.templateDetails.aggregate([
						...req.aggregations,
						{
							$lookup: {
								from: "users",
								localField: "createdBy",
								foreignField: "_id",
								as: "user"
							}
						},
						{
							$project: {
								name: 1,
								subject: 1,
								active: 1,
								createdBy: 1,
								createdByName: { $arrayElemAt: ["$user.name", 0] },
							}
						}
					]).toArray(),
					this.collections.templateDetails.aggregate(req.dbPagination).toArray(),
				]);
				return this.json(req, res, 200, { data, count: count });
			} else {
				return this.json(req, res, 200, {});
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "wrong", error);
		}
	}

	public getTemplateNames = async (req: Request, res: Response): Promise<Response> => {
		try {
			const defaultFilter = {};
			this.getAggrigation(req, this.filter_options, defaultFilter, false);
			const [data] = await Promise.all([
				this.collections.emailTemplates.aggregate([
					...req.aggregations,
					{
						$lookup: {
							from: 'templateDetails',
							as: 'templates',
							let: { createdBy: new ObjectId(req.user._id), templateId: "$_id" },
							pipeline: [
								{
									$match: {
										$expr: { $and: [{ $eq: ["$createdBy", "$$createdBy"] }, { $eq: ["$templateId", "$$templateId"] }] },
									},
								},
							]
						},
					},
					{
						$project: {
							_id: 1,
							templateName: 1,
							count: {
								$size: {
									$filter: {
										input: "$templates",
										as: "temp",
										cond: { $eq: ["$$temp.isDeleted", false] }
									}
								}
							}
						}
					},
					{
						$sort: { templateName: 1 }
					},
				]).toArray(),
			]);
			return this.json(req, res, 200, { data });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "wrong", error);
		}
	}

	public createOrUpdate = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			const Validationrules = {
				name: global['config'].commonRules.name,
				subject: global['config'].commonRules.subject,
				message: global['config'].commonRules.message,
				active: 'required'
			}
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = req.body;
			FormBody.templateId = new ObjectId(FormBody.templateId);
			FormBody.isDeleted = false;
			if (!formErrors) {
				if (id) {
					const addFields = { modifiedAt: this.d }
					await this.collections.templateDetails?.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody, ...addFields } });
				} else {
					const addFields = { createdAt: this.d, modifiedAt: this.d, createdBy: new ObjectId(req.user._id) }
					await this.collections.templateDetails?.updateMany({ templateId: FormBody.templateId, createdBy: new ObjectId(req.user._id) }, { $set: { active: false } })
					await this.collections.templateDetails?.insertOne({ ...FormBody, ...addFields });
				}
				return this.json(req, res, 200, { message: `Email Template ${(id) ? 'Updated' : 'Created'} Successfully` });
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
				await this.collections.templateDetails.updateOne({ _id: new ObjectId(id) }, { $set: { isDeleted: true } });
				return this.json(req, res, 200, { message: `Email Template Deleted Successfully` });
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
			if (FormBody.templateId) {
				await this.collections.templateDetails?.updateMany({ templateId: new ObjectId(FormBody.templateId), createdBy: new ObjectId(req.user._id) }, { $set: { active: false } })
				await this.collections.templateDetails?.updateOne({ _id: new ObjectId(id), createdBy: new ObjectId(req.user._id) }, { $set: { active: true } });
			}
			return this.json(req, res, 200, { message: "Email Template Activated Successfully" });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "wrong", error);
		}
	}

	public duplicateTemplate = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			const template = await this.collections.templateDetails.findOne({ _id: new ObjectId(id) });
			if (template) {
				const { _id: _, ...newObj } = template;
				if (template.active) {
					await this.collections.templateDetails?.updateMany({ templateId: new ObjectId(template.templateId) }, { $set: { active: false } })
				}
				await this.collections.templateDetails?.insertOne({ _id: new ObjectId(), ...newObj });
			}
			return this.json(req, res, 200, { message: "Email Template Duplicated Successfully" });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "wrong", error);
		}
	}

	public getFieldByCategory = async (req: Request, res: Response): Promise<Response> => {
		try {
			let result;
			const { id } = req.params;
			const defaultFilter = { _id: new ObjectId(id) };
			result = await this.collections.emailTemplates.findOne(defaultFilter, {
				projection: {
					_id: 1,
					used_for: 1,
					fields: 1
				}
			});
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "wrong", error);
		}
	}

}