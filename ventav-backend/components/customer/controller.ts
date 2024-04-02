import { ObjectId } from "mongodb";
import { BaseController } from "../../core";
import { Filter_Options, Request, Response } from '../../__types';
import { uploadImages } from "../../helpers/image";
import config from "../../config/config";
import Utility from "../../helpers/utility";
import IdGenerater from "../../helpers/generateId";

export default class DealController extends BaseController {
	public __component: string = "customers";
	private filter_options: Filter_Options = {
		search: ["name", "email"],
		defaultSort: "_id",
		filters: {

		},
	};
	public list = async (req: Request, res: Response): Promise<Response> => {
		try {
			const customerRoleId = await this.collections.roles.findOne({ name: "Customer" }, { projection: { _id: 1 } });
			if(customerRoleId){
				const defaultFilter = { isDeleted: false, roleId:customerRoleId._id };
				this.getAggrigation(req, this.filter_options, defaultFilter);
				const [data, count] = await Promise.all([
					this.collections.users.aggregate([
						...req.aggregations,
						{
							$project: {
								_id: 1,
								name: 1,
								email: 1,
								dob: 1,
								zipCode: 1,
								createdAt:1
							}
						}
	
					]).toArray(),
					this.collections.users.aggregate(req.dbPagination).toArray(),
				]);
				return this.json(req, res, 200, { data, count: count });
			}else{
				return this.json(req, res, 200, {data:[]});
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
}