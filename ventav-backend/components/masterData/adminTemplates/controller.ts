
import { ObjectId } from 'mongodb';
import { BaseController } from '../../../core/BaseController';
import { Filter_Options, Request, Response } from '../../../__types';

export default class AdminEmailController extends BaseController {
	public __component: string = "adminTemplate";
	private filter_options: Filter_Options = {
		search: ["templateName","used_for"],
		defaultSort: "_id",
		filters: {},
	};

	public get = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			const defaultFilter = { _id: new ObjectId(id) };
			const emailTemplate = await this.collections.emailTemplates.findOne(defaultFilter, {
				projection: {
					_id: 1,
					templateName: 1,
					used_for: 1,
					fields: 1
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
			const defaultFilter = {};
			this.getAggrigation(req, this.filter_options, defaultFilter);
			const [data, count] = await Promise.all([
				this.collections.emailTemplates.aggregate([
					...req.aggregations,
				]).toArray(),
				this.collections.emailTemplates.aggregate(req.dbPagination).toArray(),
			]);
			return this.json(req, res, 200, { data, count: count });

		} catch (error) {
			return this.jsonError(res, 500, this.__component, "wrong", error);
		}
	}

	public createOrUpdate = async (req: Request, res: Response): Promise<Response> => {
		try {

			const { id } = req.params;
			const Validationrules = {
				templateName: global['config'].commonRules.name,
				used_for: global['config'].commonRules.name,
				fields: 'required',
			}
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = this.getFormFields(req.body, Validationrules);
			if (!formErrors) {
				if (id) {
					await this.collections.emailTemplates?.updateOne({ _id: new ObjectId(id) }, { $set: FormBody });
				} else {
					const existingTemplate = await this.collections.emailTemplates.findOne({
						templateName: FormBody.templateName,
					});
					if (existingTemplate) {
						return this.jsonError(
							res,
							400,
							this.__component,
							"Template already Exists"
						);
					}
					await this.collections.emailTemplates?.insertOne(FormBody);
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
				await this.collections.emailTemplates.deleteOne({ _id: new ObjectId(id) });
				return this.json(req, res, 200, { message: `Email Template Deleted Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, 'delete');
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

}