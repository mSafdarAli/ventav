import { ObjectId } from "mongodb";
import { BaseController } from "../../../core";
import { Filter_Options, Request, Response } from '../../../__types';


export default class FirmController extends BaseController {
	public __component: string = "firms";
	private d: Date = new Date();
	private filter_options: Filter_Options = {
		search: ["companyName", "contactName"],
		defaultSort: "_id",
		filters: {},
	};
	public list = async (req: Request, res: Response): Promise<Response> => {
		try {
			const defaultFilter = { isDeleted: false };
			this.getAggrigation(req, this.filter_options, defaultFilter);
			const [data, count] = await Promise.all([
				this.collections.firms.aggregate([
					...req.aggregations,
					{
						$project: {
							_id: 1,
							companyName: 1,
							contactName: 1,
							contactPhone: 1,
							contactEmail: 1,
							rating: 1,
							active:1
						},
					}
				]).toArray(),
				this.collections.firms.aggregate(req.dbPagination).toArray(),
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
			const firm = await this.collections.firms.findOne(defaultFilter, {
				projection: {
					_id: 1,
					companyName: 1,
					contactName: 1,
					contactPhone: 1,
					contactEmail: 1,
					rating: 1,
					active: 1
				}
			});
			if (firm) {
				return this.json(req, res, 200, { data: firm });
			}
			return this.jsonError(res, 400, this.__component, "get");
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public createOrUpdate = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			const Validationrules = {
				companyName: global["config"].commonRules.name,
				contactName: global["config"].commonRules.name,
				contactPhone: global["config"].commonRules.phone,
				contactEmail: global["config"].commonRules.email,
				rating: 'required',
				active: 'required'
			};
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = this.getFormFields(req.body, Validationrules);
			FormBody.isDeleted = false
			if (!formErrors) {
				if (id) {
					const addFields = { modifiedAt: this.d}
					await this.collections.firms.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody, ...addFields } });
				} else {
					const addFields = { createdAt: this.d, modifiedAt: this.d, createdBy: new ObjectId(req.user._id) }
					await this.collections.firms.insertOne({ ...FormBody, ...addFields });
				}
				return this.json(req, res, 200, { message: `Firm ${(id) ? 'Updated' : 'Created'} Successfully` });
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
				await this.collections.firms.updateOne({ _id: new ObjectId(id) }, { $set: { isDeleted: true } });
				return this.json(req, res, 200, { message: `Firm Deleted Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, 'delete');
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

}