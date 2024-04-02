import { ObjectId } from "mongodb";
import { BaseController } from "../../../core";
import { Filter_Options, Request, Response } from '../../../__types';

export default class RoleController extends BaseController {
	public __component: string = "roles";
	private filter_options: Filter_Options = {
		search: ["name"],
		defaultSort: "_id",
		filters: {},
	};
	public list = async (req: Request, res: Response): Promise<Response> => {
		try {
			const defaultFilter = {};
			this.getAggrigation(req, this.filter_options, defaultFilter);
			const [data, count] = await Promise.all([
				this.collections.roles.aggregate([
					...req.aggregations,
					{
						$project: {
							_id: 1,
							name: 1,
							priority:1
						},
					}
				]).toArray(),
				this.collections.roles.aggregate(req.dbPagination).toArray(),
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
			const role = await this.collections.roles.findOne(defaultFilter, {
				projection: {
					_id: 1,
					name: 1,
					priority: 1,
					permissions:1
				}
			});
			if (role) {
				return this.json(req, res, 200, { data: role });
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
				name: global["config"].commonRules.name,
				priority: global["config"].commonRules.gender,
				permissions: 'required'
			};
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = this.getFormFields(req.body, Validationrules);
			if (!formErrors) {
				if (id) {
					await this.collections.roles.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody } });
				} else {
					await this.collections.roles.insertOne({ ...FormBody });
				}
				return this.json(req, res, 200, { message: `Role ${(id) ? 'Updated' : 'Created'} Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, formErrors);
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public assignPermissions = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { role_id } = req.params;
			const data = req.body;
			if (role_id) {
				await this.collections.roles?.updateOne({ _id: new ObjectId(role_id) }, { $set: { permissions: JSON.parse(data.permissions) } });
				return this.json(req, res, 200, { message: `Permissions Assigned Successfully` });
			} else {
				return this.jsonError(res, 404, this.__component, "wrong", "Not Found");
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "wrong", error);
		}
	}

	public delete = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			if (id) {
				await this.collections.roles.deleteOne({ _id: new ObjectId(id) });
				return this.json(req, res, 200, { message: `Role Deleted Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, 'delete');
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	
}